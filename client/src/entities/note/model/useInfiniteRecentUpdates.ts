import { useInfiniteQuery } from '@tanstack/react-query';
import { getRecentUpdates } from '../api/note.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

/**
 * 로그인한 사용자의 최근 수정 노트 이력을 무한 스크롤로 조회하는 커스텀 훅
 */
export const useInfiniteRecentUpdates = (size = 10) => {
  const { isLoggedIn } = useAuthStore();

  return useInfiniteQuery({
    queryKey: ['recentUpdatesInfinite', size],
    queryFn: ({ pageParam = 0 }) => getRecentUpdates({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: isLoggedIn,
  });
};
