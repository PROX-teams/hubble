package com.hubble.user.repository;

import java.util.List;
import java.util.Optional;
import com.hubble.user.dto.TrendingCreatorDto;
import com.hubble.user.entity.ProviderType;
import com.hubble.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT new com.hubble.user.dto.TrendingCreatorDto(" +
           "u.id, u.nickname, COUNT(n.id), COALESCE(SUM(n.likeCount), 0L), COALESCE(SUM(n.bookmarkCount), 0L)) " +
           "FROM User u " +
           "JOIN Note n ON n.user = u " +
           "GROUP BY u.id, u.nickname " +
           "ORDER BY (COALESCE(SUM(n.likeCount), 0L) * 2 + COALESCE(SUM(n.bookmarkCount), 0L) * 3 + COUNT(n.id) * 10) DESC")
    List<TrendingCreatorDto> findTrendingCreators(Pageable pageable);

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
