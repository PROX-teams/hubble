package com.hubble.note.repository;

import com.hubble.note.dto.NoteSearchCondition;
import com.hubble.note.entity.Note;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface NoteRepositoryCustom {

    Page<Note> searchNotes(NoteSearchCondition condition, Pageable pageable);

    Slice<Note> searchNotesSlice(String keyword, Pageable pageable);

    List<Note> findMostLovedNotes(int limit);

    List<Note> findDiscoverNotes(List<Long> excludeIds, int limit);
}
