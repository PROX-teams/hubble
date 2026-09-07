import type { SliceResponse } from '@/shared/types';
import type { Story } from '@/entities/story/story.types';
import type { Note } from '@/entities/note/note.types';

/**
 * 통합 검색 API 응답 인터페이스 (태그 리스트, 스토리 Slice, 노트 Slice)
 */
export interface SearchResponse {
  isSearching: boolean;
  tags: string[];
  stories: SliceResponse<Story>;
  notes: SliceResponse<Note>;
}

export interface GetSearchParams {
  keyword?: string;
  page?: number;
  size?: number;
}
