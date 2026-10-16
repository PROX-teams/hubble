'use client';

import React, { Suspense, useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import * as s from './Editor.css';
import { useNoteEditor } from '../model/useNoteEditor';
import { useAutoSaveDraft } from '../model/useAutoSaveDraft';
import { usePreventNavigation } from '../model/usePreventNavigation';
import { useNoteEditorStore } from '../model/useNoteEditorStore';
import { useDraftRecovery } from '../model/useDraftRecovery';
import { EditorSkeleton } from './EditorSkeleton';
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


function DraftRecoveryGate(props: EditorProps) {
  const { isRestoring, error, retry } = useDraftRecovery();
  if (error) {
    return <div role="alert">{error} <button type="button" onClick={retry}>다시 불러오기</button></div>;
  }
  if (isRestoring) return <EditorSkeleton />;
  const state = useNoteEditorStore.getState();
  return <Editor {...props}
    initialContent={state.activeDraftId ? state.content : props.initialContent}
    initialTitle={state.activeDraftId ? state.title : props.initialTitle}
  />;
}

export default function RecoverableEditor(props: EditorProps) {
  return <Suspense fallback={<EditorSkeleton />}><DraftRecoveryGate {...props} /></Suspense>;
}
