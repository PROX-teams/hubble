package com.hubble.note.entity;

import com.hubble.common.entity.BaseTimeEntity;
import com.hubble.common.entity.Category;
import com.hubble.story.entity.Story;
import com.hubble.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notes", indexes = {
        @Index(name = "idx_note_category", columnList = "category"),
        @Index(name = "idx_note_view_count", columnList = "viewCount"),
        @Index(name = "idx_note_like_count", columnList = "likeCount"),
        @Index(name = "idx_note_created_at", columnList = "createdAt")
})
@SQLDelete(sql = "UPDATE notes SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(exclude = {"user", "story", "noteTags"})
public class Note extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id")
    private Story story;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @BatchSize(size = 100) // N+1 문제 방지: 태그 목록을 100개씩 묶어서 In 쿼리로 조회
    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<NoteTag> noteTags = new ArrayList<>();

    @ColumnDefault("0")
    @Column(nullable = false)
    private long viewCount;

    @ColumnDefault("0")
    @Column(nullable = false)
    private long likeCount;

    @ColumnDefault("0")
    @Column(nullable = false)
    private long bookmarkCount;

    private LocalDateTime deletedAt;

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void updateLikeCount(long count) {
        this.likeCount = count;
    }

    public void updateBookmarkCount(long count) {
        this.bookmarkCount = count;
    }

    public void update(String title, String content, Category category, Story story, String imageUrl) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.story = story;
        this.imageUrl = imageUrl;
    }

    public void setStory(Story story) {
        this.story = story;
    }
}
