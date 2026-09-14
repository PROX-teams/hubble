'use client';

import React, { useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import * as s from './Editor.css';
import { useNoteEditor } from '../model/useNoteEditor';
import { TitleInput } from './TitleInput';

interface EditorProps {
  initialContent?: string;
  initialTitle?: string;
}

const Editor = ({ initialContent, initialTitle }: EditorProps) => {
  const editor = useNoteEditor({ className: s.editorContent, initialContent });

  const handleTitleEnter = useCallback(() => {
    editor?.commands.focus();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={s.editorContainer}>
      <TitleInput initialTitle={initialTitle} onEnter={handleTitleEnter} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
