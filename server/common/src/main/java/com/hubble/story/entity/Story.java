package com.hubble.story.entity;

import com.hubble.common.entity.BaseTimeEntity;
import com.hubble.common.entity.Category;
import com.hubble.note.entity.Note;
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
@Table(name = "stories", indexes = {
        @Index(name = "idx_story_category", columnList = "category"),
        @Index(name = "idx_story_like_count", columnList = "likeCount"),
        @Index(name = "idx_story_created_at", columnList = "createdAt")
})
@SQLDelete(sql = "UPDATE stories SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@ToString(exclude = {"user", "notes"})
public class Story extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String icon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @BatchSize(size = 100) // N+1 문제 방지: 포함된 노트들을 100개씩 일괄 조회
    @OneToMany(mappedBy = "story")
    @Builder.Default
    private List<Note> notes = new ArrayList<>();

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

    public void update(String title, String description, Category category, String icon) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.icon = icon;
    }
}
