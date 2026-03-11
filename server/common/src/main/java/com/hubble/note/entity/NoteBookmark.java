package com.hubble.note.entity;

import com.hubble.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "note_bookmarks", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "note_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class NoteBookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", nullable = false)
    private Note note;
}
