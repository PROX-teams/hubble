package com.hubble.note.service;

import com.hubble.note.dto.request.DraftSaveRequest;
import com.hubble.note.dto.response.DraftResponse;
import com.hubble.note.entity.Draft;
import com.hubble.note.repository.DraftRepository;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DraftService {

    private final DraftRepository draftRepository;
    private final UserRepository userRepository;
    private final com.hubble.story.service.StoryService storyService;
    private final com.hubble.note.repository.NoteRepository noteRepository;

    @Transactional
    public DraftResponse saveDraft(Long userId, DraftSaveRequest request) {
        if (request.storyId() != null) storyService.getOwnedStoryForUpdate(userId, request.storyId());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (request.noteId() != null) {
            var note = noteRepository.findById(request.noteId())
                    .orElseThrow(() -> new IllegalArgumentException("수정 대상 노트를 찾을 수 없습니다."));
            if (!note.getUser().getId().equals(userId)) {
                throw new IllegalArgumentException("수정 권한이 없습니다.");
            }
        }

        String tagsStr = (request.tags() != null && !request.tags().isEmpty())
                ? String.join(",", request.tags())
                : null;

        Draft draft;
        if (request.id() != null) {
            draft = draftRepository.findByIdAndUserId(request.id(), userId)
                    .orElseThrow(() -> new IllegalArgumentException("임시저장 노트를 찾을 수 없습니다."));
            if (draft.isPublished()) {
                throw new IllegalArgumentException("이미 발행된 초안입니다.");
            }
            if (!java.util.Objects.equals(draft.getNoteId(), request.noteId())) {
                throw new IllegalArgumentException("초안의 수정 대상은 변경할 수 없습니다.");
            }
            if (request.version() == null || !request.version().equals(draft.getVersion())) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.CONFLICT, "다른 곳에서 수정된 임시저장 글입니다.");
            }
            if (!java.util.Objects.equals(draft.getBaseNoteVersion(), request.baseNoteVersion())) {
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.CONFLICT, "수정 대상 버전이 일치하지 않습니다.");
            }
            draft.update(request.title(), request.content(), request.category(), request.storyId(), tagsStr, request.imageUrl());
        } else {
            draft = Draft.builder()
                    .user(user)
                    .noteId(request.noteId())
                    .baseNoteVersion(request.baseNoteVersion())
                    .title(request.title())
                    .content(request.content())
                    .category(request.category())
                    .storyId(request.storyId())
                    .tags(tagsStr)
                    .imageUrl(request.imageUrl())
                    .build();
        }

        Draft saved = draftRepository.saveAndFlush(draft);
        return DraftResponse.from(saved);
    }

    public List<DraftResponse> getDrafts(Long userId) {
        return draftRepository.findByUserIdAndPublishedFalseOrderByUpdatedAtDesc(userId)
                .stream()
                .map(DraftResponse::from)
                .toList();
    }

    public DraftResponse getDraft(Long userId, Long draftId) {
        Draft draft = draftRepository.findByIdAndUserId(draftId, userId)
                .orElseThrow(() -> new IllegalArgumentException("임시저장 노트를 찾을 수 없습니다."));
        if (draft.isPublished()) throw new IllegalArgumentException("이미 발행된 초안입니다.");
        return DraftResponse.from(draft);
    }

    @Transactional
    public void deleteDraft(Long userId, Long draftId) {
        draftRepository.deleteByIdAndUserId(draftId, userId);
    }

    @Transactional
    public void clearAllDrafts(Long userId) {
        draftRepository.deleteAllByUserId(userId);
    }
}
