package com.hubble.story.repository;

import com.hubble.common.search.MysqlFullTextSearch;
import com.hubble.note.entity.QNote;
import com.hubble.story.entity.Story;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.hubble.story.entity.QStory.story;
import static com.hubble.user.entity.QUser.user;

@Repository
@RequiredArgsConstructor
public class StoryRepositoryImpl implements StoryRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;

    private static final String FULLTEXT_SEARCH_IDS_SQL = """
            SELECT s.id
            FROM stories s
            JOIN users u ON u.id = s.user_id
            WHERE s.deleted_at IS NULL
              AND u.deleted_at IS NULL
              AND (
                    MATCH(s.title, s.description) AGAINST (:fullTextQuery IN BOOLEAN MODE) > 0
                    OR MATCH(u.nickname) AGAINST (:fullTextQuery IN BOOLEAN MODE) > 0
                    OR EXISTS (
                        SELECT 1
                        FROM notes n
                        JOIN users nu ON nu.id = n.user_id
                        WHERE n.story_id = s.id
                          AND n.deleted_at IS NULL
                          AND nu.deleted_at IS NULL
                          AND MATCH(n.title, n.content) AGAINST (:fullTextQuery IN BOOLEAN MODE) > 0
                    )
              )
            ORDER BY
              CASE
                WHEN LOWER(s.title) = LOWER(:keyword) THEN 0
                WHEN LOWER(s.title) LIKE LOWER(:prefixPattern) ESCAPE '!' THEN 1
                WHEN LOWER(s.title) LIKE LOWER(:containsPattern) ESCAPE '!' THEN 2
                ELSE 3
              END ASC,
              COALESCE(MATCH(s.title, s.description) AGAINST (:fullTextQuery IN BOOLEAN MODE), 0) DESC,
              s.created_at DESC,
              s.id DESC
            LIMIT :limit OFFSET :offset
            """;

    @Override
    public Slice<Story> searchStoriesSlice(String keyword, Pageable pageable) {
        String normalizedKeyword = normalize(keyword);
        if (MysqlFullTextSearch.supports(normalizedKeyword)) {
            return searchStoriesFullTextSlice(normalizedKeyword, pageable);
        }

        int pageSize = pageable.getPageSize();
        List<Story> content = searchQuery(normalizedKeyword)
                .offset(pageable.getOffset())
                .limit(pageSize + 1L)
                .fetch();

        boolean hasNext = content.size() > pageSize;
        if (hasNext) {
            content.remove(pageSize);
        }

        return new SliceImpl<>(content, pageable, hasNext);
    }

    private Slice<Story> searchStoriesFullTextSlice(String keyword, Pageable pageable) {
        int pageSize = pageable.getPageSize();
        List<Long> ids = findFullTextStoryIds(
                keyword,
                MysqlFullTextSearch.phrase(keyword),
                pageSize + 1,
                pageable.getOffset()
        );

        boolean hasNext = ids.size() > pageSize;
        if (hasNext) {
            ids.remove(pageSize);
        }

        return new SliceImpl<>(loadStoriesInOrder(ids), pageable, hasNext);
    }

    private List<Long> findFullTextStoryIds(String keyword, String fullTextQuery, int limit, long offset) {
        Query query = entityManager.createNativeQuery(FULLTEXT_SEARCH_IDS_SQL);
        query.setParameter("keyword", keyword);
        query.setParameter("fullTextQuery", fullTextQuery);
        query.setParameter("prefixPattern", MysqlFullTextSearch.likePrefixPattern(keyword));
        query.setParameter("containsPattern", MysqlFullTextSearch.likePattern(keyword));
        query.setParameter("limit", limit);
        query.setParameter("offset", offset);
        return toLongIds(query.getResultList());
    }

    private List<Long> toLongIds(List<?> rawIds) {
        return new ArrayList<>(rawIds.stream()
                .map(id -> ((Number) id).longValue())
                .toList());
    }

    private List<Story> loadStoriesInOrder(List<Long> ids) {
        if (ids.isEmpty()) {
            return List.of();
        }

        Map<Long, Story> storiesById = new HashMap<>();
        queryFactory
                .selectFrom(story)
                .join(story.user, user).fetchJoin()
                .where(story.id.in(ids))
                .fetch()
                .forEach(found -> storiesById.put(found.getId(), found));

        return ids.stream().map(storiesById::get).toList();
    }

    private JPAQuery<Story> searchQuery(String keyword) {
        return queryFactory
                .selectFrom(story)
                .join(story.user, user).fetchJoin()
                .where(keywordPredicate(keyword))
                .orderBy(searchOrder(keyword));
    }

    private BooleanExpression keywordPredicate(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return null;
        }
        QNote matchingNote = new QNote("matchingStoryNote");
        BooleanExpression matchingNoteExists = JPAExpressions.selectOne()
                .from(matchingNote)
                .where(
                        matchingNote.story.eq(story),
                        matchingNote.deletedAt.isNull(),
                        matchingNote.user.deletedAt.isNull(),
                        matchingNote.title.containsIgnoreCase(keyword)
                                .or(matchingNote.content.containsIgnoreCase(keyword))
                )
                .exists();

        return story.title.containsIgnoreCase(keyword)
                .or(story.description.containsIgnoreCase(keyword))
                .or(user.nickname.containsIgnoreCase(keyword))
                .or(matchingNoteExists);
    }

    private OrderSpecifier<?>[] searchOrder(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return new OrderSpecifier<?>[]{story.createdAt.desc(), story.id.desc()};
        }
        return new OrderSpecifier<?>[]{
                new CaseBuilder()
                        .when(story.title.equalsIgnoreCase(keyword)).then(0)
                        .when(story.title.startsWithIgnoreCase(keyword)).then(1)
                        .when(story.title.containsIgnoreCase(keyword)).then(2)
                        .otherwise(3)
                        .asc(),
                story.createdAt.desc(),
                story.id.desc()
        };
    }

    private String normalize(String keyword) {
        return StringUtils.hasText(keyword) ? keyword.trim() : null;
    }
}
