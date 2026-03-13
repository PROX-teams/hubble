package com.hubble.story.service;

import com.hubble.common.entity.Category;
import com.hubble.story.dto.response.StoryResponse;
import com.hubble.story.entity.Story;
import com.hubble.story.repository.StoryBookmarkRepository;
import com.hubble.story.repository.StoryLikeRepository;
import com.hubble.story.repository.StoryRepository;
import com.hubble.user.entity.User;
import com.hubble.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StoryServiceTest {

    @InjectMocks
    private StoryService storyService;

    @Mock
    private StoryRepository storyRepository;
    @Mock
    private StoryLikeRepository storyLikeRepository;
    @Mock
    private StoryBookmarkRepository storyBookmarkRepository;
    @Mock
    private UserRepository userRepository;

    @Test
    @DisplayName("내가 작성한 스토리 목록을 조회할 수 있어야 한다.")
    void getMyStories() {
        // given
        Long userId = 1L;
        User user = User.builder().id(userId).email("test@test.com").build();
        Story story = Story.builder().id(1L).title("스토리 제목").user(user).category(Category.DEVELOPMENT).build();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Story> storyPage = new PageImpl<>(List.of(story), pageable, 1);

        given(userRepository.findById(userId)).willReturn(Optional.of(user));
        given(storyRepository.findAllByUserIdWithFetch(eq(userId), any(Pageable.class))).willReturn(storyPage);

        // when
        Page<StoryResponse> response = storyService.getMyStories(userId, pageable);

        // then
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).title()).isEqualTo("스토리 제목");
        verify(storyRepository, times(1)).findAllByUserIdWithFetch(eq(userId), any(Pageable.class));
    }
}
