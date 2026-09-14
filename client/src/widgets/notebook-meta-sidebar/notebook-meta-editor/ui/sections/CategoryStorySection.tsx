'use client';

import React from 'react';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import { useShallow } from 'zustand/react/shallow';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { CategoryType } from '@/shared/types';
import { CATEGORIES, MOCK_STORIES } from '../../constants/notebookMeta.constants';
import * as s from '../../NotebookMetaEditor.css';

export const CategoryStorySection = () => {
  const { category, storyId, setCategory, setStoryId } = useNoteEditorStore(
    useShallow((state) => ({
      category: state.category,
      storyId: state.storyId,
      setCategory: state.setCategory,
      setStoryId: state.setStoryId,
    }))
  );

  // 드롭다운 선택 라벨 가독성 헬퍼 함수
  const getCategoryLabel = (selectedOption?: React.ReactNode) => {
    const targetCategory = (typeof selectedOption === 'string' ? (selectedOption as CategoryType) : null) || category;
    const found = CATEGORIES.find((c) => c.id === targetCategory);
    return found ? found.label : '카테고리 설정';
  };

  const getStoryLabel = (selectedOption?: React.ReactNode) => {
    const targetId = selectedOption ? Number(selectedOption) : storyId;
    const found = MOCK_STORIES.find((s) => s.id === targetId);
    return found ? found.title : '스토리를 선택해주세요';
  };

  return (
    <>
      {/* 카테고리 설정 */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>카테고리</h3>
        <Dropdown
          onSelect={(val) => val && setCategory(val as CategoryType)}
        >
          <Dropdown.Trigger>
            <Dropdown.Value>
              {({ selectedOption }) => getCategoryLabel(selectedOption)}
            </Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            {CATEGORIES.map((cat) => (
              <Dropdown.Option key={cat.id} optionId={cat.id}>
                {cat.label}
              </Dropdown.Option>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </section>

      {/* 스토리 선택 */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>스토리 연결</h3>
        <Dropdown
          onSelect={(val) => setStoryId(val ? Number(val) : null)}
        >
          <Dropdown.Trigger size="3xl">
            <Dropdown.Value>
              {({ selectedOption }) => getStoryLabel(selectedOption)}
            </Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Menu size="2xl">
            {MOCK_STORIES.map((story) => (
              <Dropdown.Option key={story.id} optionId={story.id}>
                {story.title}
              </Dropdown.Option>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </section>
    </>
  );
};
