package com.hubble.note.repository;
import com.hubble.note.entity.PublicationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface PublicationRequestRepository extends JpaRepository<PublicationRequest, Long> {
    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true)
    @org.springframework.data.jpa.repository.Query(value = "INSERT INTO publication_requests(user_id, request_key, payload_hash, response_json) " +
            "VALUES (:userId, :key, :state, '{}') ON DUPLICATE KEY UPDATE id = id", nativeQuery = true)
    void reserve(@org.springframework.data.repository.query.Param("userId") Long userId,
                 @org.springframework.data.repository.query.Param("key") String key,
                 @org.springframework.data.repository.query.Param("state") String state);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT p FROM PublicationRequest p WHERE p.userId = :userId AND p.requestKey = :key")
    Optional<PublicationRequest> findForUpdate(@org.springframework.data.repository.query.Param("userId") Long userId,
                                               @org.springframework.data.repository.query.Param("key") String key);

    Optional<PublicationRequest> findByUserIdAndRequestKey(Long userId, String requestKey);
}
