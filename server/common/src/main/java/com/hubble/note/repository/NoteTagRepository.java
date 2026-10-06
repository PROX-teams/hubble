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

    @Query("SELECT nt.tag.id FROM NoteTag nt WHERE nt.note.id = :noteId")
    List<Long> findTagIdsByNoteId(@Param("noteId") Long noteId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
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
           "JOIN nt.note n " +
           "JOIN nt.tag t " +
           "WHERE n.deletedAt IS NULL " +
           "GROUP BY t.name " +
           "ORDER BY COUNT(nt) DESC, t.name ASC")
    List<String> findPopularTagNames(Pageable pageable);

    @Query("SELECT t.name " +
           "FROM NoteTag nt " +
           "JOIN nt.note n " +
           "JOIN nt.tag t " +
           "WHERE n.deletedAt IS NULL " +
           "AND LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "GROUP BY t.name " +
           "ORDER BY CASE " +
           "WHEN LOWER(t.name) = LOWER(:keyword) THEN 0 " +
           "WHEN LOWER(t.name) LIKE LOWER(CONCAT(:keyword, '%')) THEN 1 " +
           "ELSE 2 END ASC, COUNT(nt) DESC, t.name ASC")
    List<String> searchTagNamesByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 1. 카테고리별 상위 태그 Top 15 집계 (2레벨 노드용)
    @Query("SELECT new com.hubble.note.dto.TagCountDto(t.name, COUNT(nt)) " +
           "FROM NoteTag nt " +
           "JOIN nt.tag t " +
           "WHERE nt.note.category = :category " +
           "GROUP BY t.name " +
           "HAVING COUNT(nt) >= :minCount " +
           "ORDER BY COUNT(nt) DESC, t.name ASC")
    List<TagCountDto> findTopTagsByCategory(
            @Param("category") com.hubble.common.entity.Category category,
            @Param("minCount") long minCount,
            Pageable pageable
    );

    @Query("SELECT new com.hubble.note.dto.TagCountDto(t.name, COUNT(nt)) " +
           "FROM NoteTag nt JOIN nt.tag t " +
           "WHERE nt.note.category = :category AND nt.note.createdAt >= :since " +
           "GROUP BY t.name ORDER BY COUNT(nt) DESC, t.name ASC")
    List<TagCountDto> findRecentTagsByCategory(
            @Param("category") com.hubble.common.entity.Category category,
            @Param("since") java.time.LocalDateTime since,
            Pageable pageable
    );

    @Query("SELECT nt2.tag.name, COUNT(DISTINCT nt1.note.id) " +
           "FROM NoteTag nt1 JOIN NoteTag nt2 ON nt1.note.id = nt2.note.id " +
           "WHERE nt1.note.category = :category AND nt1.tag.name = :tagName " +
           "AND nt2.tag.name <> :tagName " +
           "GROUP BY nt2.tag.name ORDER BY COUNT(DISTINCT nt1.note.id) DESC, nt2.tag.name ASC")
    List<Object[]> findCoOccurringTagsByCategoryAndTagName(
            @Param("category") com.hubble.common.entity.Category category,
            @Param("tagName") String tagName
    );

    // 3. 카테고리 내 특정 태그들의 전체 사용 빈도 일괄 집계 (자카드 유사도 분모 계산용)
    @Query("SELECT new com.hubble.note.dto.TagCountDto(t.name, COUNT(nt)) " +
           "FROM NoteTag nt " +
           "JOIN nt.tag t " +
           "WHERE nt.note.category = :category " +
           "  AND t.name IN (:tagNames) " +
           "GROUP BY t.name")
    List<TagCountDto> findTagCountsByCategoryAndTagNames(
            @Param("category") com.hubble.common.entity.Category category,
            @Param("tagNames") List<String> tagNames
    );
}
