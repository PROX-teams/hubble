package com.hubble.note.repository;

import com.hubble.note.dto.TagCountDto;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteTagRepository extends JpaRepository<NoteTag, Long> {

    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM NoteTag nt WHERE nt.note = :note")
    void deleteAllByNote(@Param("note") Note note);

    @Query("SELECT new com.hubble.note.dto.TagCountDto(t.name, COUNT(nt)) " +
           "FROM NoteTag nt " +
           "JOIN nt.tag t " +
           "WHERE nt.note.user.id = :userId " +
           "GROUP BY t.name " +
           "ORDER BY COUNT(nt) DESC")
    List<TagCountDto> findTagCountsByUserId(@Param("userId") Long userId);
}
