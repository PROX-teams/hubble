import { create } from 'zustand';
import type { Editor } from '@tiptap/react';
import { CategoryType } from '@/shared/types';
import type { Note } from '@/entities/note/note.types';

interface NoteEditorState {
  noteId: number | null;
  noteVersion: number | null;
  isPublishing: boolean;
  setIsPublishing: (value: boolean) => void;
  activeDraftId: string | null;
  draftVersion: number | null;
  draftConflict: boolean;
  setDraftConflict: (value: boolean) => void;
  setDraftVersion: (value: number) => void;
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
  setActiveDraftId: (activeDraftId: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: CategoryType) => void;
  setTag: (tag: string[]) => void;
  setImageUrl: (imageUrl: string) => void;
  setStoryId: (storyId: number | null) => void;
  setEditor: (editor: Editor | null) => void;
  getContent: () => string;
  getTitle: () => string;
  setTitleGetter: (getter: () => string) => void;
  initNote: (note: Note) => void;
  initDraft: (draft: {
    id?: string;
    version?: number;
    noteId?: number | null;
    baseNoteVersion?: number | null;
    title?: string;
    content?: string;
    category?: CategoryType;
    tag?: string[];
    imageUrl?: string;
    storyId?: number | null;
  }) => void;
  reset: () => void;
}

const initialState = {
  noteId: null,
  noteVersion: null,
  isPublishing: false,
  activeDraftId: null,
  draftVersion: null,
  draftConflict: false,
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

  setIsPublishing: (isPublishing) => set({ isPublishing }),
  setDraftConflict: (draftConflict) => set({ draftConflict }),
  setDraftVersion: (draftVersion) => set({ draftVersion }),
  setNoteId: (noteId) => set({ noteId }),
  setActiveDraftId: (activeDraftId) => set({ activeDraftId }),
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
  getTitle: () => get().title,
  setTitleGetter: (getter) => set({ getTitle: getter }),
  initNote: (note) =>
    set({
      noteId: note.id,
      noteVersion: note.version ?? null,
      activeDraftId: null,
      draftVersion: null,
      draftConflict: false,
      title: note.title || '',
      content: note.description || '',
      description: note.description || '',
      category: note.category || 'DEVELOPMENT',
      tag: note.tag || [],
      imageUrl: note.imageUrl || '',
      storyId: note.storyId || null,
    }),
  initDraft: (draft) => {
    const { editor } = get();
    const content = draft.content || '';
    if (editor) {
      editor.commands.setContent(content);
    }
    set({
      noteId: draft.noteId ?? null,
      noteVersion: draft.baseNoteVersion ?? null,
      draftVersion: draft.version ?? null,
      draftConflict: false,
      activeDraftId: draft.id || null, // 현재 작업 중인 초안 ID 유지 (새 초안 생성 방지)
      title: draft.title || '',
      content,
      description: content,
      category: draft.category || 'DEVELOPMENT',
      tag: draft.tag || [],
      imageUrl: draft.imageUrl || '',
      storyId: draft.storyId || null,
    });
  },
  reset: () => set(initialState),
}));
