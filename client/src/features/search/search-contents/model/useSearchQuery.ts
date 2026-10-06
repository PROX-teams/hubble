import { useInfiniteQuery } from "@tanstack/react-query";
import { getIntegratedSearch } from "@/entities/search/api/search.api";

function uniqueById<T extends { id: number }>(items: T[]): T[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

/**
 * 통합 검색 (태그, 스토리, 노트) 무한 스크롤 조회를 담당하는 커스텀 훅
 * 확정된 검색 키워드(appliedKeyword)를 기준으로 즉시 데이터를 조회합니다.
 * @param keyword 확정된 검색 키워드
 * @returns 통합 검색 결과 데이터 (태그, 스토리 목록, 노트 목록) 및 무한 스크롤 상태
 */
export function useSearchQuery(keyword: string) {
  const trimmedKeyword = keyword.trim();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["integratedSearch", trimmedKeyword],
    queryFn: ({ pageParam }) =>
      getIntegratedSearch({
        keyword: trimmedKeyword,
        page: pageParam.page,
        size: 10,
        includeStories: pageParam.includeStories,
        includeNotes: pageParam.includeNotes,
      }),
    initialPageParam: { page: 0, includeStories: true, includeNotes: true },
    getNextPageParam: (lastPage, allPages) => {
      // 노트나 스토리 둘 중 하나라도 다음 데이터가 남아있으면 누적 페이지 수를 다음 요청 페이지 번호로 사용
      const hasMoreNotes = !lastPage.notes.last;
      const hasMoreStories = !lastPage.stories.last;
      return hasMoreNotes || hasMoreStories
        ? { page: allPages.length, includeStories: hasMoreStories, includeNotes: hasMoreNotes }
        : undefined;
    },
    staleTime: 1000 * 60 * 3, // 3분 캐시
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });

  // 태그 목록 (첫 번째 페이지 응답의 태그 목록 사용)
  const tags = data?.pages[0]?.tags ?? [];

  // 누적된 스토리 및 노트 목록 (무한 스크롤 flatten)
  const storyData = uniqueById(data?.pages.flatMap((page) => page.stories.content) ?? []);
  const noteData = uniqueById(data?.pages.flatMap((page) => page.notes.content) ?? []);

  // 실제 검색 모드 여부 (서버 판별 결과 우선, fallback으로 키워드 길이 확인)
  const isSearching =
    data?.pages[0]?.isSearching ?? trimmedKeyword.length > 0;

  return {
    tags,
    storyData,
    noteData,
    isLoading,
    isError,
    isSearching,
    appliedKeyword: trimmedKeyword,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
