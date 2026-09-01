import { useQuery } from '@tanstack/react-query';
import { getTags } from '../api/tag.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

/**
 * 태그 통계 조회 React Query 훅 (userId 전달 시 특정 유저, 미전달 시 본인 태그 조회)
 */
export const useTags = (userId?: number) => {
  const { isLoggedIn } = useAuthStore();

  const { data: tags = [], isLoading, isError, error } = useQuery({
    queryKey: ['tags', userId ?? 'me'],
    queryFn: () => getTags(userId),
    // 특정 유저 조회는 비로그인도 가능(true), 본인 조회는 로그인 시에만 실행
    enabled: userId !== undefined ? true : isLoggedIn,
  });

  return {
    tags,
    isLoading,
    isError,
    error,
  };
};

export const useMyTags = useTags;
