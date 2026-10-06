'use client';

import React, { useState } from 'react';
import { Input } from '@/shared/ui/input/input/Input';
import Tag from '@/shared/ui/tag/Tag';
import { useShallow } from 'zustand/react/shallow';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import * as s from '../../NotebookMetaEditor.css';

export const TagEditorSection = () => {
  const [tagInput, setTagInput] = useState('');

  const { tag, setTag } = useNoteEditorStore(
    useShallow((state) => ({
      tag: state.tag,
      setTag: state.setTag,
    }))
  );

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글(IME) 조합 중일 때 엔터 키 중복 트리거 방지
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed) {
        if (!tag.includes(trimmed)) {
          setTag([...tag, trimmed]);
        }
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTag(tag.filter((t) => t !== tagToRemove));
  };

  return (
    <section className={s.section}>
      <h3 className={s.sectionTitle}>태그 추가</h3>
      <Input
        placeholder="태그를 입력하고 Enter를 누르세요"
        variant="solid"
        size="md"
        className={s.fullWidthInput}
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleAddTag}
      />
      <div className={s.tagList}>
        {tag.map((t) => (
          <Tag key={t} label={t} onRemove={() => handleRemoveTag(t)} />
        ))}
      </div>
    </section>
  );
};
