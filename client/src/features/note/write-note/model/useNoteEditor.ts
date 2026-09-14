import { useEffect, useRef } from 'react';
import { useEditor, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Suggestion from '@tiptap/suggestion';
import { suggestion } from '../lib/suggestion';
import { useNoteEditorStore } from '../model/useNoteEditorStore';

interface UseNoteEditorProps {
  className: string;
}

export const useNoteEditor = ({ className }: UseNoteEditorProps) => {
  const { content, noteId, setEditor } = useNoteEditorStore();
  const loadedNoteIdRef = useRef<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Placeholder.configure({
        placeholder: '/ 명령어로 기록을 남겨보세요',
      }),
      Extension.create({
        name: 'slash-menu',
        addProseMirrorPlugins() {
          return [
            Suggestion({
              editor: this.editor,
              char: '/',
              ...suggestion,
            }),
          ];
        },
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: className,
      },
    },
    // 대안 A: 매 타이핑마다 거대한 HTML을 직렬화하여 Zustand를 업데이트하지 않음 (입력 렉 및 불필요한 리렌더링 제거)
  });

  // Zustand 스토어에 에디터 인스턴스 등록 및 언마운트 시 클린업
  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
    return () => {
      setEditor(null);
    };
  }, [editor, setEditor]);

  // 외부(글 수정 페이지의 initNote 등)에서 데이터가 주입될 때만 에디터 본문 초기화
  useEffect(() => {
    if (!editor) return;

    const isNewNoteLoaded = loadedNoteIdRef.current !== noteId;
    const isInitialLoad = !editor.isFocused && editor.isEmpty && Boolean(content);

    if (isNewNoteLoaded || isInitialLoad) {
      editor.commands.setContent(content || '', { emitUpdate: false });
      loadedNoteIdRef.current = noteId;
    }
  }, [editor, content, noteId]);

  return editor;
};