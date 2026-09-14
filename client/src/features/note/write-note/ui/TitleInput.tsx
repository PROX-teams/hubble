'use client';

import React, { useRef, useEffect, memo } from 'react';
import { useNoteEditorStore } from '../model/useNoteEditorStore';
import * as s from './Editor.css';

interface TitleInputProps {
  initialTitle?: string;
  onEnter?: () => void;
}

export const TitleInput = memo(({ initialTitle, onEnter }: TitleInputProps) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const setTitleGetter = useNoteEditorStore((state) => state.setTitleGetter);

  useEffect(() => {
    if (initialTitle && inputRef.current) {
      inputRef.current.value = initialTitle;
    }
  }, [initialTitle]);

  useEffect(() => {
    setTitleGetter(() => inputRef.current?.value || '');
    return () => {
      setTitleGetter(() => '');
    };
  }, [setTitleGetter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <input
      ref={inputRef}
      defaultValue={initialTitle || ''}
      type="text"
      className={s.titleInput}
      placeholder="제목을 입력하세요"
      onKeyDown={handleKeyDown}
      maxLength={100}
    />
  );
});

TitleInput.displayName = 'TitleInput';
