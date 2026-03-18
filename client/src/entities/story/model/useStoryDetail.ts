import { useQuery } from '@tanstack/react-query';
import { getStoryDetail } from '../api/story.api';

/**
 * 특정 스토리의 상세 정보를 조회하는 커스텀 훅
 * @param storyId 조회할 스토리의 ID
 * @returns 스토리 상세 정보 및 쿼리 상태
 */

// 추후 스토리 상세 개발시 위치 이동 필요 - feature이동 예상
export const useStoryDetail = (storyId?: number) => {
  const { data: story, isLoading, isError, error } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => getStoryDetail(storyId!),
    enabled: !!storyId,
  });

  return {
    story,
    isLoading,
    isError,
    error,
  }
};
