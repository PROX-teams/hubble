import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/model/hooks/useDebounce";
import { getIntegratedSearch } from "@/entities/search/api/search.api";

/**
 * 통합 검색 (태그, 스토리, 노트) 무한 스크롤 및 디바운싱 조회를 담당하는 커스텀 훅
 * @param keyword 검색 키워드
 * @returns 통합 검색 결과 데이터 (태그, 스토리 목록, 노트 목록) 및 무한 스크롤 상태
 */
export function useSearchQuery(keyword: string) {
  const queryClient = useQueryClient();
  const debouncedKeyword = useDebounce(keyword, 300);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["integratedSearch", debouncedKeyword],
    queryFn: ({ pageParam = 0 }) =>
      getIntegratedSearch({
        keyword: debouncedKeyword,
        page: pageParam,
        size: 10,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // 노트나 스토리 둘 중 하나라도 다음 페이지가 있으면 다음 페이지 번호 반환
      const hasMoreNotes = !lastPage.notes.last;
      const hasMoreStories = !lastPage.stories.last;
      return hasMoreNotes || hasMoreStories ? lastPage.notes.number + 1 : undefined;
    },
    staleTime: 1000 * 60 * 3, // 3분 캐시
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });

  // 태그 목록 (첫 번째 페이지 응답의 태그 목록 사용)
  const tags = data?.pages[0]?.tags ?? [];

  // 누적된 스토리 및 노트 목록 (무한 스크롤 flatten)
  const storyData = data?.pages.flatMap((page) => page.stories.content) ?? [];
  const noteData = data?.pages.flatMap((page) => page.notes.content) ?? [];

  // 실제 검색 모드 여부 (서버 판별 결과 우선, fallback으로 디바운스 키워드 길이 확인)
  const isSearching =
    data?.pages[0]?.isSearching ?? debouncedKeyword.trim().length > 0;

  /**
   * 엔터키 입력 등으로 즉시 검색을 갱신하는 함수
   */
  const refetchSearch = () => {
    queryClient.invalidateQueries({
      queryKey: ["integratedSearch", debouncedKeyword],
    });
  };

  return {
    tags,
    storyData,
    noteData,
    isLoading,
    isError,
    isSearching,
    debouncedKeyword,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchSearch,
  };
}

