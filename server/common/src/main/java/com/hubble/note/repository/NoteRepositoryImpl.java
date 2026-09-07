package com.hubble.note.repository;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.NoteSearchCondition;
import com.hubble.note.entity.Note;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
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
import java.util.List;

import static com.hubble.note.entity.QNote.note;
import static com.hubble.user.entity.QUser.user;

@Repository
@RequiredArgsConstructor
public class NoteRepositoryImpl implements NoteRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Slice<Note> searchNotesSlice(String keyword, Pageable pageable) {
        int pageSize = pageable.getPageSize();

        // 인기도 점수: 북마크 * 5 + 좋아요 * 3 + 조회수 / 10
        NumberExpression<Long> popularityScore = note.bookmarkCount.multiply(5L)
                .add(note.likeCount.multiply(3L))
                .add(note.viewCount.divide(10L));

        var query = queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(integratedKeywordPredicate(keyword))
                .offset(pageable.getOffset())
                .limit(pageSize + 1); // LIMIT N + 1 (다음 페이지 확인용)

        if (StringUtils.hasText(keyword)) {
            String trimmed = keyword.trim();
            // 1순위: 제목 일치(Tier 1), 2순위: 태그 일치(Tier 2), 3순위: 기타(Tier 3)
            NumberExpression<Integer> relevanceTier = new CaseBuilder()
                    .when(note.title.containsIgnoreCase(trimmed)).then(1)
                    .when(note.noteTags.any().tag.name.equalsIgnoreCase(trimmed)).then(2)
                    .otherwise(3);

            query.orderBy(
                    relevanceTier.asc(),
                    popularityScore.desc(),
                    note.createdAt.desc()
            );
        } else {
            // 키워드가 없을 경우: 순수 인기도 높은 순 -> 최신순
            query.orderBy(
                    popularityScore.desc(),
                    note.createdAt.desc()
            );
        }

        List<Note> content = new ArrayList<>(query.fetch());

        boolean hasNext = content.size() > pageSize;
        if (hasNext) {
            content.remove(pageSize);
        }

        return new SliceImpl<>(content, pageable, hasNext);
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
        return StringUtils.hasText(tagName) ? note.noteTags.any().tag.name.eq(tagName) : null;
    }

    @Override
    public List<Note> findMostLovedNotes(int limit) {
        NumberExpression<Long> popularityScore = note.bookmarkCount.multiply(5L)
                .add(note.likeCount.multiply(3L))
                .add(note.viewCount.divide(10L));

        return queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .orderBy(popularityScore.desc(), note.createdAt.desc())
                .limit(limit)
                .fetch();
    }

    @Override
    public List<Note> findDiscoverNotes(List<Long> excludeIds, int limit) {
        NumberExpression<Long> popularityScore = note.bookmarkCount.multiply(5L)
                .add(note.likeCount.multiply(3L))
                .add(note.viewCount.divide(10L));

        LocalDateTime fourteenDaysAgo = LocalDateTime.now().minusDays(14);

        // 1-Query Fallback: 최근 14일 이내 글(Tier 1) 우선, 부족하면 이전 글(Tier 2)로 채움
        NumberExpression<Integer> timeTier = new CaseBuilder()
                .when(note.createdAt.goe(fourteenDaysAgo)).then(1)
                .otherwise(2);

        BooleanExpression excludeCondition = (excludeIds != null && !excludeIds.isEmpty())
                ? note.id.notIn(excludeIds)
                : null;

        return queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(excludeCondition)
                .orderBy(
                        timeTier.asc(),
                        popularityScore.desc(),
                        note.createdAt.desc()
                )
                .limit(limit)
                .fetch();
    }

    private BooleanExpression keywordContains(String keyword) {
        return StringUtils.hasText(keyword)
                ? note.title.containsIgnoreCase(keyword).or(note.content.containsIgnoreCase(keyword))
                : null;
    }
}
