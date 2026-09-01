import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../api/user.api';

/**
 * 특정 사용자 프로필 정보 조회 React Query 훅
 */
export const useUserProfile = (userId?: number) => {
  const { data: userProfile, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });

  return {
    userProfile,
    isLoading,
    isError,
    error,
  };
};
