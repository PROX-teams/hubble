import { CategoryType, SortType } from '@/shared/types';

interface NoteMeta {
  author?: string;
  date?: string;
  likeCount?: number;
}

interface Note extends NoteMeta {
  id: number;
  title: string;
  description?: string; // 백엔드의 content 필드 (Tiptap HTML)
  imageUrl?: string;
  category?: CategoryType;
  tag?: string[];
  storyId?: number;
  storyTitle?: string;
  viewCount?: number;
  likeCount?: number;
  bookmarkCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface NoteCreateRequest {
  title: string;
  content: string; // Tiptap HTML content
  category: CategoryType;
  imageUrl?: string;
  tag: string[];
  storyId?: number;
}

interface GetNotebookNotesParams {
  userId?: number;
  tagName?: string;
  sortType?: SortType;
  page?: number;
  size?: number;
}

type GetMyNotesParams = GetNotebookNotesParams;

interface NoteHistoryItem {
  id: number;
  title: string;
  storyTitle?: string;
  date: string;
}

interface GetRecentUpdatesParams {
  page?: number;
  size?: number;
}

export type {
  NoteMeta,
  Note,
  NoteCreateRequest,
  GetNotebookNotesParams,
  GetMyNotesParams,
  NoteHistoryItem,
  GetRecentUpdatesParams,
};
