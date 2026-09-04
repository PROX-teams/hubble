package com.hubble.note.repository;

import com.hubble.common.entity.Category;
import com.hubble.note.dto.NoteSearchCondition;
import com.hubble.note.entity.Note;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

import static com.hubble.note.entity.QNote.note;
import static com.hubble.story.entity.QStory.story;
import static com.hubble.user.entity.QUser.user;

@Repository
@RequiredArgsConstructor
public class NoteRepositoryImpl implements NoteRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Note> searchNotes(NoteSearchCondition condition, Pageable pageable) {
        List<Note> content = queryFactory
                .selectFrom(note)
                .join(note.user, user).fetchJoin()
                .leftJoin(note.story, story).fetchJoin()
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

    private BooleanExpression keywordContains(String keyword) {
        return StringUtils.hasText(keyword)
                ? note.title.containsIgnoreCase(keyword).or(note.content.containsIgnoreCase(keyword))
                : null;
    }
}
