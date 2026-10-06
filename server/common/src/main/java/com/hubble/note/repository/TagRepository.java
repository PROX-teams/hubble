package com.hubble.note.repository;

import com.hubble.note.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true)
    @org.springframework.data.jpa.repository.Query(value =
            "INSERT INTO tags(name) VALUES (:name) ON DUPLICATE KEY UPDATE id = id", nativeQuery = true)
    void insertIfAbsent(@org.springframework.data.repository.query.Param("name") String name);

    // A locking/current read observes a concurrently committed insertion under MySQL REPEATABLE READ.
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("SELECT t FROM Tag t WHERE t.name = :name")
    Optional<Tag> findResolvedForUpdate(@org.springframework.data.repository.query.Param("name") String name);

    Optional<Tag> findByName(String name);
    List<Tag> findAllByNameIn(List<String> names);
}
