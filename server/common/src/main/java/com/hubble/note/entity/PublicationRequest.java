package com.hubble.note.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "publication_requests", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "request_key"}))
@Getter @NoArgsConstructor(access = AccessLevel.PROTECTED) @AllArgsConstructor @Builder
public class PublicationRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "user_id", nullable = false) private Long userId;
    @Column(name = "request_key", nullable = false, length = 100) private String requestKey;
    @Column(nullable = false, length = 64) private String payloadHash;
    @Column(nullable = false, columnDefinition = "TEXT") private String responseJson;
    public void complete(String hash, String response) { this.payloadHash = hash; this.responseJson = response; }
}
