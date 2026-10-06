import { useMemo } from 'react';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useMyNotes } from '@/entities/note/model/useMyNotes';
import { useMyStories } from '@/entities/story/model/useMyStories';

export const useGroupedNotes = (selectedStoryId: number | null) => {
  const { isLoggedIn } = useAuthStore();
  
  // 로그인 상태일 때만 데이터를 가져옵니다.
  const { stories, isLoading: isStoriesLoading } = useMyStories();
  const { notes, isLoading: isNotesLoading } = useMyNotes();

  // 선택된 스토리 ID에 따라 노트 필터링
  // - null: 전체 노트북 (모든 노트)
  // - -1: 미분류 노트
  // - id: 해당 스토리북에 속한 노트
  const filteredNotes = useMemo(() => {
    if (!isLoggedIn || !notes.length) return [];
    if (selectedStoryId === null) return notes;
    if (selectedStoryId === -1) return notes.filter((n) => !n.storyId);
    return notes.filter((n) => n.storyId === selectedStoryId);
  }, [isLoggedIn, notes, selectedStoryId]);

  return {
    isLoggedIn,
    stories,
    notes,
    filteredNotes,
    isLoading: isStoriesLoading || isNotesLoading,
  };
};
