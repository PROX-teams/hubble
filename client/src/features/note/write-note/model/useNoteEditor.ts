import { useEffect } from 'react';
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
  initialContent?: string;
}

export const useNoteEditor = ({ className, initialContent }: UseNoteEditorProps) => {
  const { content, setEditor } = useNoteEditorStore();

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
    // Props로 전달된 initialContent가 우선하며, 첫 마운트 시 완벽한 본문을 품고 생성됨
    content: initialContent ?? content ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: className,
      },
    },
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

  return editor;
};