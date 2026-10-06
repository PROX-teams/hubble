import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getMyStories } from '../api/story.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore'; 

export const useMyStories = (page = 0, size = 100) => {
  const { isLoggedIn } = useAuthStore();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myStories', page, size],
    queryFn: () => getMyStories(page, size),
    enabled: isLoggedIn,
  });

  return {
    stories: data?.content || [],
    totalElements: data?.totalElements || 0,
    isLoading,
    isError,
    error,
  };
};

export const useInfiniteMyStories = (size = 12) => {
  const { isLoggedIn } = useAuthStore();

  const query = useInfiniteQuery({
    queryKey: ['myStories', 'infinite', size],
    queryFn: ({ pageParam = 0 }) => getMyStories(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: isLoggedIn,
  });

  const stories = query.data?.pages.flatMap((page) => page.content) || [];
  const totalElements = query.data?.pages[0]?.totalElements || 0;

  return {
    ...query,
    stories,
    totalElements,
  };
};
