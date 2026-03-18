import { useMemo } from 'react';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useMyNotes } from '@/entities/note/model/useMyNotes';
import { useMyStories } from '@/entities/story/model/useMyStories';

export const useGroupedNotes = (selectedStoryId: number | null) => {
  const { isLoggedIn } = useAuthStore();
  
  // 로그인 상태일 때만 데이터를 가져옵니다.
  const { stories, isLoading: isStoriesLoading } = useMyStories();
  const { notes, isLoading: isNotesLoading } = useMyNotes();

  const groupedNotes = useMemo(() => {
    // 로그인하지 않았거나 데이터가 없는 경우 빈 배열 반환
    if (!isLoggedIn || (!stories.length && !notes.length)) return [];

    // 1. 스토리 ID별로 노트 분류 (groups 객체 생성)
    const groups: Record<number, typeof notes> = {};
    const unclassifiedNotes: typeof notes = [];

    notes.forEach((note) => {
      if (note.storyId) {
        if (!groups[note.storyId]) {
          groups[note.storyId] = [];
        }
        groups[note.storyId].push(note);
      } else {
        unclassifiedNotes.push(note);
      }
    });

    // 2. 스토리 정보와 노트를 결합 (results 배열 생성)
    const results = stories
      .map((story) => ({
        id: story.id,
        title: story.title,
        notes: groups[story.id] || [],
      }))
      // 노트를 가지고 있거나, 전체 보기 모드(!selectedStoryId)일 때만 포함
      .filter((group) => group.notes.length > 0 || !selectedStoryId);

    // 3. 미분류 그룹 추가 (미분류 노트가 있는 경우만)
    if (unclassifiedNotes.length > 0) {
      results.push({
        id: -1,
        title: '미분류',
        notes: unclassifiedNotes,
      });
    }

    // 4. 선택된 스토리가 있다면 해당 스토리만 필터링해서 반환
    return selectedStoryId 
      ? results.filter((g) => g.id === selectedStoryId) 
      : results;

  }, [isLoggedIn, stories, notes, selectedStoryId]);

  return {
    isLoggedIn,
    stories,
    notes, // 미분류 체크 등을 위해 원본 노트도 반환
    groupedNotes,
    isLoading: isStoriesLoading || isNotesLoading,
  };
};
