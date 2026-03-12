import { create } from 'zustand';
import { CategoryType } from '@/shared/types/api.types';

interface NoteEditorState {
  title: string;
  content: string;
  category: CategoryType;
  tag: string[];
  imageUrl: string;
  storyId: number | null;

  // Actions
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setCategory: (category: CategoryType) => void;
  setTag: (tag: string[]) => void;
  setImageUrl: (imageUrl: string) => void;
  setStoryId: (storyId: number | null) => void;
  reset: () => void;
}

const initialState = {
  title: '',
  content: '',
  category: 'DEVELOPMENT' as CategoryType,
  tag: [],
  imageUrl: '',
  storyId: null,
};

export const useNoteEditorStore = create<NoteEditorState>((set) => ({
  ...initialState,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setCategory: (category) => set({ category }),
  setTag: (tag) => set({ tag }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setStoryId: (storyId) => set({ storyId }),
  reset: () => set(initialState),
}));
