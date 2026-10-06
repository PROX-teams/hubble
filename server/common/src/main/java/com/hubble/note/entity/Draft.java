package com.hubble.note.entity;

import com.hubble.common.entity.BaseTimeEntity;
import com.hubble.common.entity.Category;
import com.hubble.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * 실무 표준 백엔드 영속화 임시저장(Draft) 엔티티.
 * 미완성 초안의 특성을 반영하여 제목/본문/카테고리가 유연하게 저장될 수 있으며,
 * 유저별로 완벽히 격리됩니다.
 */
@Entity
@Table(name = "drafts", indexes = {
        @Index(name = "idx_draft_user_updated", columnList = "user_id, updatedAt DESC")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Draft extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    private Category category;

    private Long storyId;

    private Long noteId;

    private Long baseNoteVersion;

    @Version
    private Long version;

    @Builder.Default
    @Column(nullable = false)
    private boolean published = false;

    public void markPublished(Long noteId) {
        this.noteId = noteId;
        this.published = true;
    }

    @Column(columnDefinition = "TEXT")
    private String tags;

    private String imageUrl;

    public void update(String title, String content, Category category, Long storyId, String tags, String imageUrl) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.storyId = storyId;
        this.tags = tags;
        this.imageUrl = imageUrl;
    }
}
