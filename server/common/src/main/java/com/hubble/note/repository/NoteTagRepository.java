package com.hubble.note.repository;

import com.hubble.note.dto.TagCountDto;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.NoteTag;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT t.name " +
           "FROM NoteTag nt " +
           "JOIN nt.tag t " +
           "GROUP BY t.name " +
           "ORDER BY COUNT(nt) DESC")
    List<String> findPopularTagNames(Pageable pageable);

    @Query("SELECT t.name " +
           "FROM NoteTag nt " +
           "JOIN nt.tag t " +
           "WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "GROUP BY t.name " +
           "ORDER BY COUNT(nt) DESC")
    List<String> searchTagNamesByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
