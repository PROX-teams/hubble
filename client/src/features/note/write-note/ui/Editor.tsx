'use client';

import React, { useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import * as s from './Editor.css';
import { useNoteEditor } from '../model/useNoteEditor';
import { useAutoSaveDraft } from '../model/useAutoSaveDraft';
import { usePreventNavigation } from '../model/usePreventNavigation';
import { TitleInput } from './TitleInput';

interface EditorProps {
  initialContent?: string;
  initialTitle?: string;
}

const Editor = ({ initialContent, initialTitle }: EditorProps) => {
  const editor = useNoteEditor({ className: s.editorContent, initialContent });

  // [A-1] Next.js 클라이언트 내부 링크 클릭 및 탭 닫기 이탈 방지 가드
  usePreventNavigation();

  // [A-2] 타이핑 멈춤 감지 3초 디바운스 자동 임시저장
  useAutoSaveDraft({ delay: 3000 });

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
