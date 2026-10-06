package com.hubble.note.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "note_tags",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_note_tags_note_tag",
                columnNames = {"note_id", "tag_id"}
        ),
        indexes = {
                // Graph expansion starts from a tag and traverses its notes.
                @Index(name = "idx_note_tag_tag_note", columnList = "tag_id, note_id")
        })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class NoteTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false,
            foreignKey = @ForeignKey(name = "FKb15yxop81senc5xs5tjrsy4k4"))
    private Note note;

    @ManyToOne(fetch = FetchType.LAZY)
    // Removing a tag from a note deletes this link, never the shared Tag.
    // The DB foreign key rejects deleting a Tag while links still reference it.
    @JoinColumn(name = "tag_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK8babdwu6uqiu4rdkeuy8dkna0"))
    private Tag tag;
}
