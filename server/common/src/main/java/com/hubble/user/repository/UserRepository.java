package com.hubble.user.repository;

import java.util.List;
import java.util.Optional;
import com.hubble.user.entity.ProviderType;
import com.hubble.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByNickname(String nickname);

    boolean existsByEmailAndProviderType(String email, ProviderType providerType);

    Optional<User> findByEmailAndProviderType(String email, ProviderType providerType);

    List<User> findAllByIdIn(List<Long> ids);

    @Query(
            value = "SELECT * FROM users ORDER BY created_at DESC, id DESC",
            countQuery = "SELECT COUNT(*) FROM users",
            nativeQuery = true
    )
    Page<User> findAllIncludingDeleted(Pageable pageable);

}
