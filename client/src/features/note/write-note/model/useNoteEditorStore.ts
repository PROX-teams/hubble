import { create } from 'zustand';
import type { Editor } from '@tiptap/react';
import { CategoryType } from '@/shared/types';
import type { Note } from '@/entities/note/note.types';

interface NoteEditorState {
  noteId: number | null;
  title: string;
  content: string; // 초기 데이터 주입용 본문
  description: string;
  category: CategoryType;
  tag: string[];
  imageUrl: string;
  storyId: number | null;
  editor: Editor | null;

  // Actions
  setNoteId: (noteId: number | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: CategoryType) => void;
  setTag: (tag: string[]) => void;
  setImageUrl: (imageUrl: string) => void;
  setStoryId: (storyId: number | null) => void;
  setEditor: (editor: Editor | null) => void;
  getContent: () => string;
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
  editor: null,
};

export const useNoteEditorStore = create<NoteEditorState>((set, get) => ({
  ...initialState,

  setNoteId: (noteId) => set({ noteId }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content, description: content }),
  setDescription: (description) => set({ description, content: description }),
  setCategory: (category) => set({ category }),
  setTag: (tag) => set({ tag }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setStoryId: (storyId) => set({ storyId }),
  setEditor: (editor) => set({ editor }),
  getContent: () => {
    const { editor, content } = get();
    return editor ? editor.getHTML() : content;
  },
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
