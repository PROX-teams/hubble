package com.hubble.story.repository;

import com.hubble.story.entity.Story;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface StoryRepositoryCustom {

    Slice<Story> searchStoriesSlice(String keyword, Pageable pageable);
}
