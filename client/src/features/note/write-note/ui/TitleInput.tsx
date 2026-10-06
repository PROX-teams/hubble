'use client';

import React, { useRef, useEffect, memo } from 'react';
import { useNoteEditorStore } from '../model/useNoteEditorStore';
import * as s from './Editor.css';

interface TitleInputProps {
  initialTitle?: string;
  onEnter?: () => void;
}

export const TitleInput = memo(({ initialTitle, onEnter }: TitleInputProps) => {
  const isPublishing = useNoteEditorStore((state) => state.isPublishing);
  const inputRef = useRef<HTMLInputElement>(null);
  const storeTitle = useNoteEditorStore((state) => state.title);
  const setTitle = useNoteEditorStore((state) => state.setTitle);
  const setTitleGetter = useNoteEditorStore((state) => state.setTitleGetter);

  // 1. 초기 prop 주입
  useEffect(() => {
    if (initialTitle && inputRef.current) {
      inputRef.current.value = initialTitle;
      setTitle(initialTitle);
    }
  }, [initialTitle, setTitle]);

  // 2. 초안 불러오기(initDraft) 등으로 스토어 title이 외부에서 변경되었을 때 input 값 즉시 동기화
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== storeTitle) {
      inputRef.current.value = storeTitle;
    }
  }, [storeTitle]);

  useEffect(() => {
    setTitleGetter(() => inputRef.current?.value || storeTitle);
    return () => {
      setTitleGetter(() => '');
    };
  }, [setTitleGetter, storeTitle]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      defaultValue={initialTitle || storeTitle || ''}
      type="text"
      disabled={isPublishing}
      className={s.titleInput}
      placeholder="제목을 입력하세요"
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={100}
    />
  );
});


TitleInput.displayName = 'TitleInput';
