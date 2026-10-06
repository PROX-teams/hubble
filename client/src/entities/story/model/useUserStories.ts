import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getUserStories } from '../api/story.api';

export const useUserStories = (userId?: number, page = 0, size = 100) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userStories', userId, page, size],
    queryFn: () => getUserStories(userId!, page, size),
    enabled: typeof userId === 'number' && !isNaN(userId) && userId > 0,
  });

  return {
    stories: data?.content || [],
    totalElements: data?.totalElements || 0,
    isLoading,
    isError,
    error,
  };
};

export const useInfiniteUserStories = (userId?: number, size = 12) => {
  const isEnabled = typeof userId === 'number' && !isNaN(userId) && userId > 0;

  const query = useInfiniteQuery({
    queryKey: ['userStories', 'infinite', userId, size],
    queryFn: ({ pageParam = 0 }) => getUserStories(userId!, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: isEnabled,
  });

  const stories = query.data?.pages.flatMap((page) => page.content) || [];
  const totalElements = query.data?.pages[0]?.totalElements || 0;

  return {
    ...query,
    stories,
    totalElements,
  };
};
