package com.hubble.story.repository;

import com.hubble.common.entity.Category;
import com.hubble.story.entity.Story;
import com.hubble.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    // 좋아요가 많은 순 Top 10
    List<Story> findTop10ByOrderByLikeCountDesc();

    // 기본 폴더(Default Story) 조회용
    Optional<Story> findByTitleAndUser(String title, User user);

    // 카테고리별 필터링 + 무한 스크롤
    Page<Story> findAllByCategory(Category category, Pageable pageable);

    // 검색 (제목 또는 설명) + 무한 스크롤
    Page<Story> findByTitleContainingOrDescriptionContaining(String title, String description, Pageable pageable);

    // 전체 조회 (무한 스크롤용)
    Page<Story> findAll(Pageable pageable);
}
