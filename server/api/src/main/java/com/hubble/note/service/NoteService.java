package com.hubble.note.service;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.request.NoteCreateRequest;
import com.hubble.note.dto.response.NoteResponse;
import com.hubble.note.dto.response.TagCountResponse;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteBookmark;
import com.hubble.note.entity.NoteLike;
import com.hubble.note.entity.NoteTag;
import com.hubble.note.entity.Tag;
import com.hubble.note.repository.*;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryRepository;
import com.hubble.story.service.StoryService;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
                .viewCount(0)
                .likeCount(0)
                .bookmarkCount(0)
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

    @Transactional
    public NoteResponse getNote(Long noteId, Long userId) {
        noteRepository.incrementViewCount(noteId);
        
        Note note = getNoteEntity(noteId);
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note));
    }

    public Page<NoteResponse> getNotes(Category category, String keyword, String tagName, Pageable pageable, Long userId) {
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
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

        return notes.map(note -> NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note)));
    }

    public Page<NoteResponse> getBookmarkedNotes(Long userId, Pageable pageable) {
        User user = getUserEntity(userId);
        return noteBookmarkRepository.findAllByUser(user, pageable)
                .map(bookmark -> NoteResponse.of(bookmark.getNote(), isLiked(user, bookmark.getNote()), true));
    }

    public Page<NoteResponse> getUserNotes(Long targetUserId, String tagName, Pageable pageable, Long viewerUserId) {
        getUserEntity(targetUserId); // 타겟 유저 존재 여부 검증
        User viewerUser = (viewerUserId != null) ? userRepository.findById(viewerUserId).orElse(null) : null;

        Page<Note> notes;
        if (tagName != null && !tagName.isBlank()) {
            notes = noteRepository.findAllByUserIdAndTagNameWithFetch(targetUserId, tagName, pageable);
        } else {
            notes = noteRepository.findAllByUserIdWithFetch(targetUserId, pageable);
        }
        return notes.map(note -> NoteResponse.of(note, isLiked(viewerUser, note), isBookmarked(viewerUser, note)));
    }

    public List<TagCountResponse> getUserTags(Long targetUserId) {
        getUserEntity(targetUserId); // 타겟 유저 존재 여부 검증
        return noteTagRepository.findTagCountsByUserId(targetUserId).stream()
                .map(dto -> new TagCountResponse(dto.name(), dto.count()))
                .collect(Collectors.toList());
    }

    public List<NoteResponse> getTop10LikedNotes(Long userId) {
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return noteRepository.findTop10ByOrderByLikeCountDescWithFetch(PageRequest.of(0, 10)).stream()
                .map(note -> NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note)))
                .collect(Collectors.toList());
    }

    public List<NoteResponse> getTop10ViewedNotes(Long userId) {
        User user = (userId != null) ? userRepository.findById(userId).orElse(null) : null;
        return noteRepository.findTop10ByOrderByViewCountDescWithFetch(PageRequest.of(0, 10)).stream()
                .map(note -> NoteResponse.of(note, isLiked(user, note), isBookmarked(user, note)))
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleLike(Long userId, Long noteId) {
        User user = getUserEntity(userId);
        Note note = getNoteEntity(noteId);
        noteLikeRepository.findByUserAndNote(user, note)
                .ifPresentOrElse(
                        like -> {
                            noteLikeRepository.delete(like);
                            noteRepository.decrementLikeCount(noteId);
                        },
                        () -> {
                            noteLikeRepository.save(NoteLike.builder().user(user).note(note).build());
                            noteRepository.incrementLikeCount(noteId);
                        }
                );
    }

    @Transactional
    public void toggleBookmark(Long userId, Long noteId) {
        User user = getUserEntity(userId);
        Note note = getNoteEntity(noteId);
        noteBookmarkRepository.findByUserAndNote(user, note)
                .ifPresentOrElse(
                        bookmark -> {
                            noteBookmarkRepository.delete(bookmark);
                            noteRepository.decrementBookmarkCount(noteId);
                        },
                        () -> {
                            noteBookmarkRepository.save(NoteBookmark.builder().user(user).note(note).build());
                            noteRepository.incrementBookmarkCount(noteId);
                        }
                );
    }

    private void saveTags(Note note, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) return;

        tagNames.forEach(name -> {
            Tag tag = tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(new Tag(name)));
            
            noteTagRepository.save(NoteTag.builder()
                    .note(note)
                    .tag(tag)
                    .build());
        });
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
        if (user == null) return false;
        return noteLikeRepository.existsByUserAndNote(user, note);
    }

    private boolean isBookmarked(User user, Note note) {
        if (user == null) return false;
        return noteBookmarkRepository.existsByUserAndNote(user, note);
    }
}
