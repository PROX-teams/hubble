import { useQuery } from '@tanstack/react-query';
import { getMyStories } from '../api/story.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore'; 

export const useMyStories = (page = 0, size = 100) => {
  const { isLoggedIn } = useAuthStore()

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
