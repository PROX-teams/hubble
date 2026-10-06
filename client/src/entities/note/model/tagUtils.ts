import type { Note } from "../note.types";
import type { Story } from "@/entities/story/story.types";

export interface TagCountItem {
  label: string;
  count: number;
}

/**
 * 노트 목록으로부터 태그 빈도수를 집계하여 내림차순 정렬된 목록을 반환합니다.
 */
export const calculateTagCounts = (notes: Array<{ tag?: string[] }>): TagCountItem[] => {
  const tagCountMap: Record<string, number> = {};

  notes.forEach((note) => {
    if (Array.isArray(note.tag)) {
      note.tag.forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) {
          tagCountMap[trimmed] = (tagCountMap[trimmed] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(tagCountMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * 선택된 태그를 포함하는 노트를 가진 스토리 목록을 필터링합니다.
 */
export const filterStoriesByTag = (
  stories: Story[],
  notes: Note[],
  selectedTag: string | null
): Story[] => {
  if (!selectedTag) return stories;

  const targetTag = selectedTag.toLowerCase();
  const matchingNoteIds = new Set(
    notes
      .filter((note) =>
        Array.isArray(note.tag) &&
        note.tag.some((t) => t.trim().toLowerCase() === targetTag)
      )
      .map((note) => note.id)
  );

  return stories.filter((story) =>
    story.articleIds?.some((articleId) => matchingNoteIds.has(articleId))
  );
};
