import { fetcher } from '@/shared/api/base';
import type { CategoryType } from '@/shared/types';

export interface DraftResponseDto {
  id: number;
  version: number;
  noteId?: number | null;
  baseNoteVersion?: number | null;
  title: string;
  content: string;
  category?: CategoryType;
  storyId?: number | null;
  tags?: string[];
  imageUrl?: string;
  savedAt: string;
}

export interface DraftSaveRequestDto {
  id?: number | null;
  version?: number | null;
  noteId?: number | null;
  baseNoteVersion?: number | null;
  title: string;
  content: string;
  category?: CategoryType;
  storyId?: number | null;
  tags?: string[];
  imageUrl?: string;
}

export const draftApi = {
  getDrafts: () => fetcher<DraftResponseDto[]>('/api/draft'),

  getDraft: (draftId: number) => fetcher<DraftResponseDto>(`/api/draft/${draftId}`),

  saveDraft: (data: DraftSaveRequestDto) =>
    fetcher<DraftResponseDto>('/api/draft', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteDraft: (draftId: number) =>
    fetcher<void>(`/api/draft/${draftId}`, {
      method: 'DELETE',
    }),

  clearAllDrafts: () =>
    fetcher<void>('/api/draft', {
      method: 'DELETE',
    }),
};
