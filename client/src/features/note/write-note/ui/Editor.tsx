'use client';

import React, { useState, useRef, useEffect } from 'react';
import { EditorContent } from '@tiptap/react';
import * as s from './Editor.css';
import { useNoteEditorStore } from '../model/useNoteEditorStore';
import { useNoteEditor } from '../model/useNoteEditor';

interface EditorProps {
  initialContent?: string;
  initialTitle?: string;
}

const Editor = ({ initialContent, initialTitle }: EditorProps) => {
  // 제목을 전역 스토어가 아닌 에디터 순수 로컬 상태로 격리 (타이핑 시 전역 상태 오염 및 리렌더링 차단)
  const [title, setTitle] = useState(initialTitle || '');
  const titleRef = useRef(title);
  titleRef.current = title;

  const setTitleGetter = useNoteEditorStore((state) => state.setTitleGetter);
  const editor = useNoteEditor({ className: s.editorContent, initialContent });

  // initialTitle이 변경될 경우(글 수정 페이지 데이터 로드 시) 동기화
  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  // 스토어에 제목 추출 게터 등록 (게시 시점에만 1회 호출)
  useEffect(() => {
    setTitleGetter(() => titleRef.current);
    return () => {
      setTitleGetter(() => '');
    };
  }, [setTitleGetter]);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

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
        maxLength={100}
      />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
