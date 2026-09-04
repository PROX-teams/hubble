package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteHistoryResponse;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.dto.response.TagCountResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteBookmark;
import com.hubble.note.entity.NoteLike;
import com.hubble.note.entity.NoteTag;
import com.hubble.note.entity.Tag;
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

    @Transactional
    public NoteResponse createNote(Long userId, NoteCreateRequest request) {
        User user = getUserEntity(userId);
        Story story;
        if (request.storyId() != null) {
            story = storyRepository.findById(request.storyId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 스토리입니다."));
        } else {
            story = storyService.getOrCreateDefaultStory(user);
        }

        Note note = Note.builder()
                .title(request.title())
                .content(request.content())
                .category(request.category())
                .imageUrl(request.imageUrl())
                .user(user)
                .story(story)
                .build();

        Note savedNote = noteRepository.save(note);
        saveTags(savedNote, request.tag());

        return NoteResponse.of(savedNote, false, false);
    }

    @Transactional
    public NoteResponse updateNote(Long userId, Long noteId, NoteCreateRequest request) {
        User user = getUserEntity(userId);
        Note note = getNoteEntity(noteId);
        validateOwner(user, note);

        Story story = null;
        if (request.storyId() != null) {
            story = storyRepository.findById(request.storyId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 스토리입니다."));
        }

        note.update(request.title(), request.content(), request.category(), story, request.imageUrl());

        // 기존 태그 매핑 벌크 삭제 후 재등록
        noteTagRepository.deleteAllByNote(note);
        saveTags(note, request.tag());

        return NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note));
    }

    @Transactional
    public void deleteNote(Long userId, Long noteId) {
        User user = getUserEntity(userId);
        Note note = getNoteEntity(noteId);
        validateOwner(user, note);
        noteRepository.delete(note);
    }

    // 🚀 [최적화 1] getNote 순수 읽기 전용 격리 & 조회수 비동기 이벤트 발행 (Row Lock 경합 0건)
    public NoteResponse getNote(Long noteId, Long userId) {
        // 비동기 조회수 이벤트 발행 (본 읽기 트랜잭션의 커넥션 점유 및 락 유발 원천 차단)
        eventPublisher.publishEvent(new NoteViewedEvent(noteId));

        Note note = getNoteEntity(noteId);
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note));
    }

    public Page<NoteResponse> getNotes(Category category, String keyword, String tagName, Pageable pageable, Long userId) {
        Page<Note> notes;
        
        if (tagName != null && !tagName.isBlank()) {
            notes = noteRepository.findAllByTagNameWithFetch(tagName, pageable);
        } else if (category != null) {
            notes = noteRepository.findAllByCategoryWithFetch(category, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            notes = noteRepository.findByKeywordWithFetch(keyword, pageable);
        } else {
            notes = noteRepository.findAllWithFetch(pageable);
        }

        return convertToNoteResponses(notes, userId);
    }

    // 🚀 [최적화 2] getBookmarkedNotes Fetch Join 단일 페이징 및 IN 쿼리 매핑
    public Page<NoteResponse> getBookmarkedNotes(Long userId, Pageable pageable) {
        getUserEntity(userId); // 유저 존재 여부 검증
        Page<Note> notes = noteRepository.findBookmarkedNotesByUserIdWithFetch(userId, pageable);
        return convertToNoteResponses(notes, userId);
    }

    public Page<NoteResponse> getUserNotes(Long targetUserId, String tagName, Pageable pageable, Long viewerUserId) {
        getUserEntity(targetUserId); // 타겟 유저 존재 여부 검증

        Page<Note> notes;
        if (tagName != null && !tagName.isBlank()) {
            notes = noteRepository.findAllByUserIdAndTagNameWithFetch(targetUserId, tagName, pageable);
        } else {
            notes = noteRepository.findAllByUserIdWithFetch(targetUserId, pageable);
        }
        return convertToNoteResponses(notes, viewerUserId);
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

    public List<NoteResponse> getTop10LikedNotes(Long userId) {
        List<Note> notes = noteRepository.findTop10ByOrderByLikeCountDescWithFetch(PageRequest.of(0, 10));
        return convertToNoteResponses(notes, userId);
    }

    public List<NoteResponse> getTop10ViewedNotes(Long userId) {
        List<Note> notes = noteRepository.findTop10ByOrderByViewCountDescWithFetch(PageRequest.of(0, 10));
        return convertToNoteResponses(notes, userId);
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
            noteLikeRepository.save(NoteLike.builder().user(userRef).note(noteRef).build());
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
            noteBookmarkRepository.save(NoteBookmark.builder().user(userRef).note(noteRef).build());
            noteRepository.incrementBookmarkCount(noteId);
        }
    }

    // 🚀 [최적화 핵심] N+1 방지를 위한 IN 쿼리 배치 매핑 공통 헬퍼 메서드 (Page)
    private Page<NoteResponse> convertToNoteResponses(Page<Note> notePage, Long userId) {
        List<Note> notes = notePage.getContent();
        List<NoteResponse> responses = convertToNoteResponses(notes, userId);
        return new PageImpl<>(responses, notePage.getPageable(), notePage.getTotalElements());
    }

    // 🚀 [최적화 핵심] N+1 방지를 위한 IN 쿼리 배치 매핑 공통 헬퍼 메서드 (List)
    private List<NoteResponse> convertToNoteResponses(List<Note> notes, Long userId) {
        if (notes == null || notes.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> noteIds = notes.stream().map(Note::getId).toList();

        // IN 쿼리 2회로 현재 페이지에 속한 모든 노트의 좋아요/북마크 상태 일괄 조회 (O(1) Set)
        Set<Long> likedNoteIds = (userId != null)
                ? noteLikeRepository.findLikedNoteIdsByUserIdAndNoteIds(userId, noteIds)
                : Collections.emptySet();

        Set<Long> bookmarkedNoteIds = (userId != null)
                ? noteBookmarkRepository.findBookmarkedNoteIdsByUserIdAndNoteIds(userId, noteIds)
                : Collections.emptySet();

        return notes.stream()
                .map(note -> NoteResponse.of(
                        note,
                        likedNoteIds.contains(note.getId()),
                        bookmarkedNoteIds.contains(note.getId())
                ))
                .toList();
    }

    // 🚀 [최적화 5] 태그 중복 방어(distinct) 및 벌크 배치 저장
    private void saveTags(Note note, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) return;

        // 중복 태그 및 공백 안전 필터링
        List<String> cleanTagNames = tagNames.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();

        if (cleanTagNames.isEmpty()) return;

        // 1. 기존 태그들을 IN 쿼리 1회로 일괄 조회
        List<Tag> existingTags = tagRepository.findAllByNameIn(cleanTagNames);
        Map<String, Tag> tagMap = existingTags.stream()
                .collect(Collectors.toMap(Tag::getName, tag -> tag));

        // 2. 미등록 신규 태그들만 모아서 saveAll 일괄 삽입
        List<Tag> newTags = cleanTagNames.stream()
                .filter(name -> !tagMap.containsKey(name))
                .map(Tag::new)
                .toList();
        if (!newTags.isEmpty()) {
            List<Tag> savedNewTags = tagRepository.saveAll(newTags);
            savedNewTags.forEach(tag -> tagMap.put(tag.getName(), tag));
        }

        // 3. 매핑 엔티티 일괄 삽입
        List<NoteTag> noteTags = cleanTagNames.stream()
                .map(name -> NoteTag.builder().note(note).tag(tagMap.get(name)).build())
                .toList();
        noteTagRepository.saveAll(noteTags);
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
