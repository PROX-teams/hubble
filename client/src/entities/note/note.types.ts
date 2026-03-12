import { CategoryType } from '@/shared/types/api.types';

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
  viewCount?: number;
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

export type { NoteMeta, Note, NoteCreateRequest };
