package com.hubble.note.repository;

import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteTagRepository extends JpaRepository<NoteTag, Long> {
    void deleteAllByNote(Note note);
}
