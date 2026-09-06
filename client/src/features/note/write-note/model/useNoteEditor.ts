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
}

export const useNoteEditor = ({ className }: UseNoteEditorProps) => {
  const { content, setContent } = useNoteEditorStore();

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
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // 기존 글 데이터가 스토어에 세팅되면 Tiptap 에디터 본문 동기화
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return editor;
};