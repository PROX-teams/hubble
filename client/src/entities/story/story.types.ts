import { CategoryType } from '@/shared/types';
import { NoteMeta } from '../note/note.types';

interface Story extends NoteMeta {
  id: number;
  title: string;
  description?: string;
  category?: CategoryType;
  icon?: string;
  articleIds: number[];
  authorId?: number;
}

interface StoryCreateRequest {
  title: string;
  description?: string;
  category: CategoryType;
  icon?: string;
}

export type { Story, StoryCreateRequest };