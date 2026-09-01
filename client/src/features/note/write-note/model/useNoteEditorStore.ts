import { create } from 'zustand';
import { CategoryType } from '@/shared/types';
import type { Note } from '@/entities/note/note.types';

interface NoteEditorState {
  noteId: number | null;
  title: string;
  content: string;
  description: string;
  category: CategoryType;
  tag: string[];
  imageUrl: string;
  storyId: number | null;

  // Actions
  setNoteId: (noteId: number | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: CategoryType) => void;
  setTag: (tag: string[]) => void;
  setImageUrl: (imageUrl: string) => void;
  setStoryId: (storyId: number | null) => void;
  initNote: (note: Note) => void;
  reset: () => void;
}

const initialState = {
  noteId: null,
  title: '',
  content: '',
  description: '',
  category: 'DEVELOPMENT' as CategoryType,
  tag: [],
  imageUrl: '',
  storyId: null,
};

export const useNoteEditorStore = create<NoteEditorState>((set) => ({
  ...initialState,

  setNoteId: (noteId) => set({ noteId }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content, description: content }),
  setDescription: (description) => set({ description, content: description }),
  setCategory: (category) => set({ category }),
  setTag: (tag) => set({ tag }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setStoryId: (storyId) => set({ storyId }),
  initNote: (note) =>
    set({
      noteId: note.id,
      title: note.title || '',
      content: note.description || '',
      description: note.description || '',
      category: note.category || 'DEVELOPMENT',
      tag: note.tag || [],
      imageUrl: note.imageUrl || '',
      storyId: note.storyId || null,
    }),
  reset: () => set(initialState),
}));
