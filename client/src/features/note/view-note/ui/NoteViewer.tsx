'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import { useEffect } from 'react';

interface NoteViewerProps {
  content: string;
  className?: string;
}

export const NoteViewer = ({ content, className }: NoteViewerProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
    ],
    content,
    editable: false, // 읽기 전용 설정
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: className || '',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};
