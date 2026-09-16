import { useQuery } from '@tanstack/react-query';
import {
  getMostLovedNotes,
  getDiscoverNotes,
  getTrendingCreators,
  getPopularStories,
} from '../api/recommend.api';

const EMPTY_ARRAY: never[] = [];

/**
 * 1. Most Loved (전체 누적 인기 노트 12개) 독립 조회 훅
 */
export const useMostLovedNotes = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['mostLovedNotes'],
    queryFn: getMostLovedNotes,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    notes: data ?? EMPTY_ARRAY,
    isLoading,
    isError,
    refetch,
  };
};

/**
 * 2. Discover (최근 14일 트렌딩 탐색 노트 16개) 독립 조회 훅
 */
export const useDiscoverNotes = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['discoverNotes'],
    queryFn: getDiscoverNotes,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    notes: data ?? EMPTY_ARRAY,
    isLoading,
    isError,
    refetch,
  };
};

/**
 * 3. Trending Creators (인기 크리에이터 5명) 독립 조회 훅
 */
export const useTrendingCreators = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trendingCreators'],
    queryFn: getTrendingCreators,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    creators: data ?? EMPTY_ARRAY,
    isLoading,
    isError,
    refetch,
  };
};

/**
 * 4. Trending Stories (인기 스토리 12개) 독립 조회 훅
 */
export const usePopularStories = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['popularStories'],
    queryFn: getPopularStories,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    stories: data ?? EMPTY_ARRAY,
    isLoading,
    isError,
    refetch,
  };
};

/**
 * 메인페이지 추천 데이터를 결합하여 제공하는 파사드 훅
 * 각각의 독립 쿼리를 병렬 실행하여 각 섹션별 독립 로딩(점진적 렌더링)을 지원합니다.
 */
export const useMainRecommendations = () => {
  const mostLoved = useMostLovedNotes();
  const discover = useDiscoverNotes();
  const creators = useTrendingCreators();
  const stories = usePopularStories();

  return {
    mostLovedNotes: mostLoved.notes,
    isMostLovedLoading: mostLoved.isLoading,
    discoverNotes: discover.notes,
    isDiscoverLoading: discover.isLoading,
    creators: creators.creators,
    isCreatorsLoading: creators.isLoading,
    popularStories: stories.stories,
    isStoriesLoading: stories.isLoading,
    isLoading:
      mostLoved.isLoading ||
      discover.isLoading ||
      creators.isLoading ||
      stories.isLoading,
  };
};
