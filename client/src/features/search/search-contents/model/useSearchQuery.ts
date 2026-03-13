import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/shared/model/hooks/useDebounce";
import { getNotes, getTop10ViewedNotes } from "@/entities/note/api/note.api";
import { getStories, getTop10LikedStories } from "@/entities/story/api/story.api";

/**
 * 검색어 입력에 따른 디바운싱 및 데이터(스토리, 노트) 조회를 담당하는 커스텀 훅
 * @param keyword 검색 키워드
 * @returns 검색 결과 데이터 및 상태
 */

export function useSearchQuery(keyword: string) {
  const queryClient = useQueryClient();
  const debouncedKeyword = useDebounce(keyword, 300);
  const isSearching = debouncedKeyword.trim().length > 0;

  // 스토리 데이터 조회 (검색 혹은 인기 Top 10)
  const { data: storyData, isLoading: isStoryLoading, isError: isStoryError } = useQuery({
    queryKey: ["stories", debouncedKeyword],
    queryFn: () => 
      isSearching 
        ? getStories({ keyword: debouncedKeyword }).then(res => res.content)
        : getTop10LikedStories(),
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,   
    retry: 1,                
  });

  // 노트 데이터 조회 (검색 혹은 인기 Top 10)
  const { data: noteData, isLoading: isNoteLoading, isError: isNoteError } = useQuery({
    queryKey: ["notes", debouncedKeyword],
    queryFn: () => 
      isSearching 
        ? getNotes({ keyword: debouncedKeyword }).then(res => res.content)
        : getTop10ViewedNotes(),
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 30,   
    retry: 1,                 
  });

  /**
   * 명시적으로 검색 결과를 새로고침하는 함수
   */
  const refetchSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["stories", debouncedKeyword] });
    queryClient.invalidateQueries({ queryKey: ["notes", debouncedKeyword] });
  };

  return {
    storyData,
    noteData,
    isLoading: isStoryLoading || isNoteLoading,
    isError: isStoryError || isNoteError,
    isSearching,
    debouncedKeyword,
    refetchSearch
  };
}

