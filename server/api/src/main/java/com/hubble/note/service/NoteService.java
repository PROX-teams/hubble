package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.graph.service.GraphChangeRecorder;
import com.hubble.note.dto.NoteSearchCondition;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteHistoryResponse;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.dto.response.NoteSummaryResponse;
import com.hubble.note.dto.response.TagCountResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteBookmark;
import com.hubble.note.entity.NoteLike;
import com.hubble.note.entity.NoteTag;
import com.hubble.note.entity.Tag;
import com.hubble.note.event.NoteDeletedEvent;
import com.hubble.note.event.NoteViewedEvent;
import com.hubble.note.repository.*;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import com.hubble.story.service.StoryService;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoteService {

    private final com.hubble.note.repository.DraftRepository draftRepository;
    private final NoteRepository noteRepository;
    private final NoteLikeRepository noteLikeRepository;
    private final NoteBookmarkRepository noteBookmarkRepository;
    private final TagRepository tagRepository;
    private final NoteTagRepository noteTagRepository;
    private final StoryRepository storyRepository;
    private final StoryService storyService;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final EntityManager entityManager;
    private final GraphChangeRecorder graphChangeRecorder;

    @Transactional
    public NoteResponse createNote(Long userId, NoteCreateRequest request) {
        User user = getUserEntity(userId);
        Story story;
        if (request.storyId() != null) {
            story = storyService.getOwnedStoryForUpdate(userId, request.storyId());
        } else {
            story = storyService.getOrCreateDefaultStory(user);
        }

        var draft = lockDraft(userId, request.draftId(), null);
        if (draft != null && draft.isPublished()) return publishedResponse(userId, draft);
        validateDraftVersion(draft, request.draftVersion());


        Note note = Note.builder()
                .title(request.title())
                .content(request.content())
                .category(request.category())
                .imageUrl(request.imageUrl())
                .user(user)
                .story(story)
                .build();

        Note savedNote = noteRepository.save(note);
        List<Long> newTagIds = saveTags(savedNote, request.tag());
        graphChangeRecorder.record(savedNote.getId(), null, List.of(), savedNote.getCategory(), newTagIds);

        if (draft != null) {
            draft.markPublished(savedNote.getId());
            draftRepository.save(draft);
        }
        return NoteResponse.of(savedNote, false, false);
    }

    @Transactional
    public NoteResponse updateNote(Long userId, Long noteId, NoteCreateRequest request) {
        Note snapshot = getNoteEntity(noteId);
        User actor = getUserEntity(userId);
        validateOwner(actor, snapshot);
        Long originalStoryId = snapshot.getStory().getId();
        java.util.stream.Stream.of(originalStoryId, request.storyId()).filter(Objects::nonNull)
                .distinct().sorted().forEach(id -> storyService.getOwnedStoryForUpdate(userId, id));
        entityManager.detach(snapshot);
        var draft = lockDraft(userId, request.draftId(), noteId);
        if (draft != null && draft.isPublished()) return publishedResponse(userId, draft);
        validateDraftVersion(draft, request.draftVersion());

        User user = getUserEntity(userId);
        Note note = noteRepository.findByIdForUpdate(noteId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 노트입니다."));
        validateOwner(user, note);
        if (!note.getStory().getId().equals(originalStoryId)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT, "노트 소속이 변경되었습니다.");
        }
        Long expectedVersion = draft != null ? draft.getBaseNoteVersion() : request.noteVersion();
        if (expectedVersion == null || expectedVersion != note.getContentVersion()
                || request.noteVersion() == null || !expectedVersion.equals(request.noteVersion())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT, "다른 탭에서 게시글을 수정했습니다. 최신 글을 확인해 주세요.");
        }
        Category oldCategory = note.getCategory();
        List<Long> oldTagIds = noteTagRepository.findTagIdsByNoteId(noteId);

        Story story = note.getStory();
        if (request.storyId() != null) {
            story = storyService.getOwnedStoryForUpdate(userId, request.storyId());
        } else if (story == null) {
            story = storyService.getOrCreateDefaultStory(user);
        } else {
            story = storyService.getOwnedStoryForUpdate(userId, story.getId());
        }

        note.update(request.title(), request.content(), request.category(), story, request.imageUrl());

        // 기존 태그 매핑 벌크 삭제 후 재등록
        noteTagRepository.deleteAllByNote(note);
        List<Long> newTagIds = saveTags(note, request.tag());
        graphChangeRecorder.record(noteId, oldCategory, oldTagIds, note.getCategory(), newTagIds);

        if (draft != null) {
            // Tag replacement clears the persistence context; explicitly merge the draft.
            draft.markPublished(noteId);
            draftRepository.save(draft);
        }

        // The bulk delete clears the persistence context. Reload so the response reflects
        // the newly saved tag links instead of the detached note's stale collection.
        entityManager.flush();
        entityManager.clear();
        Note refreshed = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalStateException("수정한 노트를 다시 조회할 수 없습니다."));
        return NoteResponse.of(refreshed, isLiked(user, refreshed), isBookmarked(user, refreshed));
    }

    private void validateDraftVersion(com.hubble.note.entity.Draft draft, Long expectedVersion) {
        if (draft != null && (expectedVersion == null || !expectedVersion.equals(draft.getVersion()))) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT, "다른 탭에서 초안을 수정했습니다. 최신 초안을 확인해 주세요.");
        }
    }

    private com.hubble.note.entity.Draft lockDraft(Long userId, Long draftId, Long noteId) {
        if (draftId == null) return null;
        var draft = draftRepository.findOwnedForUpdate(draftId, userId)
                .orElseThrow(() -> new IllegalArgumentException("임시저장 노트를 찾을 수 없습니다."));
        if (!java.util.Objects.equals(draft.getNoteId(), noteId)
                && !(noteId == null && draft.isPublished())) {
            throw new IllegalArgumentException("초안과 게시글이 일치하지 않습니다.");
        }
        return draft;
    }

    private NoteResponse publishedResponse(Long userId, com.hubble.note.entity.Draft draft) {
        var note = getNoteEntity(draft.getNoteId());
        var user = getUserEntity(userId);
        validateOwner(user, note);
        return NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note));
    }

    @Transactional
    public void deleteNote(Long userId, Long noteId) {
        Note snapshot = getNoteEntity(noteId);
        validateOwner(getUserEntity(userId), snapshot);
        Long originalStoryId = snapshot.getStory().getId();
        storyService.getOwnedStoryForUpdate(userId, originalStoryId);
        entityManager.detach(snapshot);
        User user = getUserEntity(userId);
        Note note = noteRepository.findByIdForUpdate(noteId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 노트입니다."));
        validateOwner(user, note);
        if (!note.getStory().getId().equals(originalStoryId)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT, "노트 소속이 변경되었습니다.");
        }
        graphChangeRecorder.record(noteId, note.getCategory(), noteTagRepository.findTagIdsByNoteId(noteId), null, List.of());

        draftRepository.preserveDeletedNoteDrafts(noteId, userId);
        noteRepository.delete(note);
        eventPublisher.publishEvent(new NoteDeletedEvent(noteId));
    }

    // 🚀 [최적화 1] getNote 순수 읽기 전용 격리 & 조회수 비동기 이벤트 발행 (Row Lock 경합 0건)
    public NoteResponse getNote(Long noteId, Long userId) {
        // 비동기 조회수 이벤트 발행 (본 읽기 트랜잭션의 커넥션 점유 및 락 유발 원천 차단)
        eventPublisher.publishEvent(new NoteViewedEvent(noteId));

        Note note = getNoteEntity(noteId);
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note));
    }

    public Page<NoteSummaryResponse> getNotes(Category category, String keyword, String tagName, Pageable pageable) {
        NoteSearchCondition condition = NoteSearchCondition.of(null, null, category, tagName, keyword);
        Page<Note> notes = noteRepository.searchNotes(condition, pageable);
        return convertToNoteSummaryResponses(notes);
    }

    // 🚀 [최적화 2] getBookmarkedNotes Fetch Join 단일 페이징 및 경량 DTO 매핑
    public Page<NoteSummaryResponse> getBookmarkedNotes(Long userId, Pageable pageable) {
        getUserEntity(userId); // 유저 존재 여부 검증
        Page<Note> notes = noteRepository.findBookmarkedNotesByUserIdWithFetch(userId, pageable);
        return convertToNoteSummaryResponses(notes);
    }

    public Page<NoteSummaryResponse> getUserNotes(Long targetUserId, String tagName, Pageable pageable) {
        getUserEntity(targetUserId); // 타겟 유저 존재 여부 검증
        NoteSearchCondition condition = NoteSearchCondition.forUser(targetUserId, tagName);
        Page<Note> notes = noteRepository.searchNotes(condition, pageable);
        return convertToNoteSummaryResponses(notes);
    }

    public List<TagCountResponse> getUserTags(Long targetUserId) {
        getUserEntity(targetUserId); // 타겟 유저 존재 여부 검증
        return noteTagRepository.findTagCountsByUserId(targetUserId).stream()
                .map(dto -> new TagCountResponse(dto.name(), dto.count()))
                .collect(Collectors.toList());
    }

    public Slice<NoteHistoryResponse> getRecentUpdates(Long userId, Pageable pageable) {
        getUserEntity(userId); // 유저 존재 여부 검증
        return noteRepository.findRecentUpdatesByUserId(userId, pageable)
                .map(NoteHistoryResponse::from);
    }

    public List<NoteSummaryResponse> getTop10LikedNotes() {
        List<Note> notes = noteRepository.findTop10ByOrderByLikeCountDescWithFetch(PageRequest.of(0, 10));
        return convertToNoteSummaryResponses(notes);
    }

    public List<NoteSummaryResponse> getTop10ViewedNotes() {
        List<Note> notes = noteRepository.findTop10ByOrderByViewCountDescWithFetch(PageRequest.of(0, 10));
        return convertToNoteSummaryResponses(notes);
    }

    // 🚀 [최적화 3] 원자적 증감 쿼리 및 getReference 프록시 적용 (SELECT 0건 Zero-I/O 및 Full Scan 오버헤드 제거)
    @Transactional
    public void toggleLike(Long userId, Long noteId) {
        if (noteLikeRepository.existsByUserIdAndNoteId(userId, noteId)) {
            noteLikeRepository.deleteByUserIdAndNoteId(userId, noteId);
            noteRepository.decrementLikeCount(noteId);
        } else {
            User userRef = entityManager.getReference(User.class, userId);
            Note noteRef = entityManager.getReference(Note.class, noteId);
            noteLikeRepository.saveAndFlush(NoteLike.builder().user(userRef).note(noteRef).build());
            noteRepository.incrementLikeCount(noteId);
        }
    }

    // 🚀 [최적화 3] 원자적 증감 쿼리 및 getReference 프록시 적용 (SELECT 0건 Zero-I/O 및 Full Scan 오버헤드 제거)
    @Transactional
    public void toggleBookmark(Long userId, Long noteId) {
        if (noteBookmarkRepository.existsByUserIdAndNoteId(userId, noteId)) {
            noteBookmarkRepository.deleteByUserIdAndNoteId(userId, noteId);
            noteRepository.decrementBookmarkCount(noteId);
        } else {
            User userRef = entityManager.getReference(User.class, userId);
            Note noteRef = entityManager.getReference(Note.class, noteId);
            noteBookmarkRepository.saveAndFlush(NoteBookmark.builder().user(userRef).note(noteRef).build());
            noteRepository.incrementBookmarkCount(noteId);
        }
    }

    // 🚀 [최적화 핵심] 추가 IN 쿼리 없는 경량 DTO 변환 헬퍼 메서드 (Page)
    private Page<NoteSummaryResponse> convertToNoteSummaryResponses(Page<Note> notePage) {
        List<NoteSummaryResponse> responses = notePage.getContent().stream()
                .map(NoteSummaryResponse::from)
                .toList();
        return new PageImpl<>(responses, notePage.getPageable(), notePage.getTotalElements());
    }

    // 🚀 [최적화 핵심] 추가 IN 쿼리 없는 경량 DTO 변환 헬퍼 메서드 (List)
    private List<NoteSummaryResponse> convertToNoteSummaryResponses(List<Note> notes) {
        if (notes == null || notes.isEmpty()) {
            return Collections.emptyList();
        }
        return notes.stream()
                .map(NoteSummaryResponse::from)
                .toList();
    }

    // 🚀 [최적화 5] 태그 중복 방어(distinct) 및 벌크 배치 저장
    private List<Long> saveTags(Note note, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) return List.of();

        List<String> cleanTagNames = tagNames.stream()
                .filter(Objects::nonNull)
                .map(name -> java.text.Normalizer.normalize(name, java.text.Normalizer.Form.NFKC)
                        .strip().replaceAll("\\s+", " ").toLowerCase(java.util.Locale.ROOT))
                .filter(name -> !name.isBlank()).distinct().sorted().toList();
        if (cleanTagNames.size() > 20 || cleanTagNames.stream().anyMatch(name -> name.codePointCount(0, name.length()) > 30)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "태그는 최대 20개, 각 30자까지 입력할 수 있습니다.");
        }
        // Resolve tags in a stable order to reduce deadlock risk across publications.
        List<Tag> resolved = new java.util.ArrayList<>();
        for (String name : cleanTagNames) {
            tagRepository.insertIfAbsent(name);
            resolved.add(tagRepository.findResolvedForUpdate(name)
                    .orElseThrow(() -> new IllegalStateException("태그 생성 결과를 조회할 수 없습니다.")));
        }
        // DB collation can treat different input spellings as the same tag; deduplicate by ID too.
        Map<Long, Tag> tagsById = new java.util.LinkedHashMap<>();
        resolved.forEach(tag -> tagsById.putIfAbsent(tag.getId(), tag));
        noteTagRepository.saveAll(tagsById.values().stream()
                .map(tag -> NoteTag.builder().note(note).tag(tag).build()).toList());
        return List.copyOf(tagsById.keySet());
    }

    private User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

    private Note getNoteEntity(Long noteId) {
        return noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 노트입니다."));
    }

    private void validateOwner(User user, Note note) {
        if (!note.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("해당 노트에 대한 권한이 없습니다.");
        }
    }

    private boolean isLiked(User user, Note note) {
        if (user == null || user.getId() == null || note == null || note.getId() == null) return false;
        return noteLikeRepository.existsByUserIdAndNoteId(user.getId(), note.getId());
    }

    private boolean isBookmarked(User user, Note note) {
        if (user == null || user.getId() == null || note == null || note.getId() == null) return false;
        return noteBookmarkRepository.existsByUserIdAndNoteId(user.getId(), note.getId());
    }
}
