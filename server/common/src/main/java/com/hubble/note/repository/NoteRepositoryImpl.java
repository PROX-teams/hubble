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
import java.util.Collections;
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

        List<Note> content = queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .where(integratedKeywordPredicate(keyword))
                .offset(pageable.getOffset())
                .limit(pageSize + 1)
                .orderBy(
                        note.popularityScore.desc(),
                        note.createdAt.desc()
                )
                .fetch();

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
