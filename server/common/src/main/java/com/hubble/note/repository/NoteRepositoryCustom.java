package com.hubble.note.repository;

import com.hubble.note.dto.NoteSearchCondition;
import com.hubble.note.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoteRepositoryCustom {

    Page<Note> searchNotes(NoteSearchCondition condition, Pageable pageable);
}
