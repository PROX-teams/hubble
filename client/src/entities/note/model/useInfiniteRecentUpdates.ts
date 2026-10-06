import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecentUpdates } from '../api/note.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

/**
 * 로그인한 사용자 또는 특정 사용자의 최근 수정 노트 이력을 무한 스크롤로 조회하는 커스텀 훅
 */
export const useInfiniteRecentUpdates = (size = 10, userId?: number) => {
  const { isLoggedIn } = useAuthStore();
  const isTargetUser = typeof userId === 'number' && !isNaN(userId) && userId > 0;

  return useInfiniteQuery({
    queryKey: ['recentUpdatesInfinite', userId, size],
    queryFn: ({ pageParam = 0 }) => getRecentUpdates({ userId, page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: isTargetUser ? true : isLoggedIn,
  });
};
