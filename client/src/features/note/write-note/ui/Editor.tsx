'use client';

import { EditorContent } from '@tiptap/react';
import * as s from './Editor.css';
import { useNoteEditorStore } from '../model/useNoteEditorStore';
import { useNoteEditor } from '../model/useNoteEditor';

const Editor = () => {
  const { title, setTitle } = useNoteEditorStore();
  const editor = useNoteEditor({className: s.editorContent})

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={s.editorContainer}>
      <input
        type="text"
        className={s.titleInput}
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleTitleKeyDown}
        maxLength={10}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
