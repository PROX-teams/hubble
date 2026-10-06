package com.hubble.note.repository;

import com.hubble.common.entity.Category;
import com.hubble.common.search.MysqlFullTextSearch;
import com.hubble.note.dto.NoteSearchCondition;
import com.hubble.note.entity.Note;
import com.hubble.note.entity.QNoteTag;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.hubble.note.entity.QNote.note;
import static com.hubble.user.entity.QUser.user;

@Repository
@RequiredArgsConstructor
public class NoteRepositoryImpl implements NoteRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;

    private static final String FULLTEXT_SEARCH_IDS_SQL = """
            SELECT n.id
            FROM notes n
            JOIN users u ON u.id = n.user_id
            WHERE n.deleted_at IS NULL
              AND u.deleted_at IS NULL
              AND (
                    MATCH(n.title, n.content) AGAINST (:fullTextQuery IN BOOLEAN MODE) > 0
                    OR MATCH(u.nickname) AGAINST (:fullTextQuery IN BOOLEAN MODE) > 0
                    OR EXISTS (
                        SELECT 1
                        FROM note_tags nt
                        JOIN tags t ON t.id = nt.tag_id
                        WHERE nt.note_id = n.id
                          AND MATCH(t.name) AGAINST (:fullTextQuery IN BOOLEAN MODE) > 0
                    )
              )
            ORDER BY
              CASE
                WHEN LOWER(n.title) = LOWER(:keyword) THEN 0
                WHEN LOWER(n.title) LIKE LOWER(:prefixPattern) ESCAPE '!' THEN 1
                WHEN LOWER(n.title) LIKE LOWER(:containsPattern) ESCAPE '!' THEN 2
                ELSE 3
              END ASC,
              COALESCE(MATCH(n.title, n.content) AGAINST (:fullTextQuery IN BOOLEAN MODE), 0) DESC,
              n.created_at DESC,
              n.id DESC
            LIMIT :limit OFFSET :offset
            """;

    @Override
    public Slice<Note> searchNotesSlice(String keyword, Pageable pageable) {
        String normalizedKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;
        if (MysqlFullTextSearch.supports(normalizedKeyword)) {
            return searchNotesFullTextSlice(normalizedKeyword, pageable);
        }

        int pageSize = pageable.getPageSize();

        List<Note> content = queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(integratedKeywordPredicate(normalizedKeyword))
                .offset(pageable.getOffset())
                .limit(pageSize + 1)
                .orderBy(integratedSearchOrder(normalizedKeyword))
                .fetch();

        boolean hasNext = content.size() > pageSize;
        if (hasNext) {
            content.remove(pageSize);
        }

        return new SliceImpl<>(content, pageable, hasNext);
    }

    private Slice<Note> searchNotesFullTextSlice(String keyword, Pageable pageable) {
        int pageSize = pageable.getPageSize();
        List<Long> ids = findFullTextNoteIds(
                FULLTEXT_SEARCH_IDS_SQL,
                keyword,
                MysqlFullTextSearch.phrase(keyword),
                pageSize + 1,
                pageable.getOffset()
        );

        boolean hasNext = ids.size() > pageSize;
        if (hasNext) {
            ids.remove(pageSize);
        }

        List<Note> notes = loadNotesInOrder(ids);
        return new SliceImpl<>(notes, pageable, hasNext);
    }

    private List<Long> findFullTextNoteIds(
            String sql,
            String keyword,
            String fullTextQuery,
            int limit,
            long offset
    ) {
        Query query = entityManager.createNativeQuery(sql);
        bindFullTextParameters(query, keyword, fullTextQuery);
        query.setParameter("limit", limit);
        query.setParameter("offset", offset);
        return toLongIds(query.getResultList());
    }

    private void bindFullTextParameters(Query query, String keyword, String fullTextQuery) {
        query.setParameter("keyword", keyword);
        query.setParameter("fullTextQuery", fullTextQuery);
        query.setParameter("prefixPattern", MysqlFullTextSearch.likePrefixPattern(keyword));
        query.setParameter("containsPattern", MysqlFullTextSearch.likePattern(keyword));
    }

    private List<Long> toLongIds(List<?> rawIds) {
        return new ArrayList<>(rawIds.stream()
                .map(id -> ((Number) id).longValue())
                .toList());
    }

    private List<Note> loadNotesInOrder(List<Long> ids) {
        if (ids.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Long, Note> notesById = new HashMap<>();
        queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(note.id.in(ids))
                .fetch()
                .forEach(found -> notesById.put(found.getId(), found));

        return ids.stream().map(notesById::get).toList();
    }

    private BooleanExpression integratedKeywordPredicate(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return null;
        }
        String trimmed = keyword.trim();
        return note.title.containsIgnoreCase(trimmed)
                .or(note.content.containsIgnoreCase(trimmed))
                .or(note.noteTags.any().tag.name.containsIgnoreCase(trimmed))
                .or(note.user.nickname.containsIgnoreCase(trimmed));
    }

    private OrderSpecifier<?>[] integratedSearchOrder(String keyword) {
        List<OrderSpecifier<?>> order = new ArrayList<>();
        if (StringUtils.hasText(keyword)) {
            String trimmed = keyword.trim();
            NumberExpression<Integer> titleRank = new CaseBuilder()
                    .when(note.title.equalsIgnoreCase(trimmed)).then(0)
                    .when(note.title.startsWithIgnoreCase(trimmed)).then(1)
                    .when(note.title.containsIgnoreCase(trimmed)).then(2)
                    .otherwise(3);
            order.add(titleRank.asc());
        } else {
            // 인기 목록은 인기도로 정렬하되, 키워드 검색 중에는 점수 변동이 페이지 경계를 흔들지 않게 한다.
            order.add(note.popularityScore.desc());
        }
        order.add(note.createdAt.desc());
        order.add(note.id.desc());
        return order.toArray(new OrderSpecifier<?>[0]);
    }

    @Override
    public Page<Note> searchNotes(NoteSearchCondition condition, Pageable pageable) {
        List<Note> content = queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(
                        userEq(condition.userId()),
                        storyEq(condition.storyId()),
                        categoryEq(condition.category()),
                        tagEq(condition.tagName()),
                        keywordContains(condition.keyword())
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(note.createdAt.desc())
                .fetch();

        JPAQuery<Long> countQuery = queryFactory
                .select(note.count())
                .from(note)
                .where(
                        userEq(condition.userId()),
                        storyEq(condition.storyId()),
                        categoryEq(condition.category()),
                        tagEq(condition.tagName()),
                        keywordContains(condition.keyword())
                );

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    private BooleanExpression userEq(Long userId) {
        return userId != null ? note.user.id.eq(userId) : null;
    }

    private BooleanExpression storyEq(Long storyId) {
        return storyId != null ? note.story.id.eq(storyId) : null;
    }

    private BooleanExpression categoryEq(Category category) {
        return category != null ? note.category.eq(category) : null;
    }

    private BooleanExpression tagEq(String tagName) {
        if (!StringUtils.hasText(tagName)) return null;
        QNoteTag matchingTag = new QNoteTag("matchingTag");
        return JPAExpressions.selectOne()
                .from(matchingTag)
                .where(matchingTag.note.eq(note), matchingTag.tag.name.eq(tagName))
                .exists();
    }

    @Override
    public List<Note> findMostLovedNotes(int limit) {
        // [지연 조인] PK만 먼저 정렬 추출 후 필요한 페치 조인 수행 (Sort Buffer 메모리 낭비 원천 차단)
        List<Long> targetIds = queryFactory
                .select(note.id)
                .from(note)
                .orderBy(note.popularityScore.desc(), note.createdAt.desc())
                .limit(limit)
                .fetch();

        if (targetIds.isEmpty()) {
            return Collections.emptyList();
        }

        return queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(note.id.in(targetIds))
                .orderBy(note.popularityScore.desc(), note.createdAt.desc())
                .fetch();
    }

    @Override
    public List<Note> findRecentTrendingNotes(LocalDateTime after, int limit) {
        // [지연 조인 1단계] 복합 인덱스(createdAt DESC, popularityScore DESC)로 초고속 인덱스 스캔 + PK만 추출
        List<Long> targetIds = queryFactory
                .select(note.id)
                .from(note)
                .where(note.createdAt.goe(after))
                .orderBy(note.popularityScore.desc(), note.createdAt.desc())
                .limit(limit)
                .fetch();

        if (targetIds.isEmpty()) {
            return Collections.emptyList();
        }

        // [지연 조인 2단계] 최종 확정된 ID들만 fetchJoin 수행
        return queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(note.id.in(targetIds))
                .orderBy(note.popularityScore.desc(), note.createdAt.desc())
                .fetch();
    }

    @Override
    public List<Note> findFallbackTrendingNotes(LocalDateTime before, int limit) {
        // [지연 조인 1단계] 과거 글 대상 PK만 인덱스/정렬 추출
        List<Long> targetIds = queryFactory
                .select(note.id)
                .from(note)
                .where(note.createdAt.lt(before))
                .orderBy(note.popularityScore.desc(), note.createdAt.desc())
                .limit(limit)
                .fetch();

        if (targetIds.isEmpty()) {
            return Collections.emptyList();
        }

        // [지연 조인 2단계] 최종 확정된 ID들만 fetchJoin 수행
        return queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(note.id.in(targetIds))
                .orderBy(note.popularityScore.desc(), note.createdAt.desc())
                .fetch();
    }

    private BooleanExpression keywordContains(String keyword) {
        return StringUtils.hasText(keyword)
                ? note.title.containsIgnoreCase(keyword).or(note.content.containsIgnoreCase(keyword))
                : null;
    }
}
