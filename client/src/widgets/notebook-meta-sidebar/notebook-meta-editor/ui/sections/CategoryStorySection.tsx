'use client';

import React from 'react';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import { useShallow } from 'zustand/react/shallow';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { useMyStories } from '@/entities/story/model/useMyStories';
import { CategoryType } from '@/shared/types';
import { CATEGORIES } from '../../constants/notebookMeta.constants';
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

  // 실제 로그인한 사용자의 스토리 목록 조회 API 연동
  const { stories, isLoading: isStoriesLoading } = useMyStories(0, 100);

  // 스토어의 category 상태에 기반한 표시 라벨
  const currentCategoryLabel = React.useMemo(() => {
    if (!category) return '카테고리 설정';
    const found = CATEGORIES.find((c) => c.id === category);
    return found ? found.label : '카테고리 설정';
  }, [category]);

  // 스토어의 storyId 및 stories 목록에 기반한 표시 라벨
  const currentStoryLabel = React.useMemo(() => {
    if (storyId === 0) return '스토리 연결 안 함 (기본 노트북)';
    if (!storyId) return '스토리를 선택해주세요';
    const found = stories.find((s) => s.id === storyId);
    if (found) return found.title;
    if (isStoriesLoading) return '스토리 불러오는 중...';
    return '스토리를 선택해주세요';
  }, [storyId, stories, isStoriesLoading]);

  const handleSelectStory = (val: string | number | null) => {
    if (val === null || val === undefined) {
      setStoryId(null);
    } else {
      setStoryId(Number(val));
    }
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
              {() => currentCategoryLabel}
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
          onSelect={handleSelectStory}
        >
          <Dropdown.Trigger size="3xl">
            <Dropdown.Value>
              {() => currentStoryLabel}
            </Dropdown.Value>
          </Dropdown.Trigger>
          <Dropdown.Menu size="2xl">
            <Dropdown.Option optionId={0}>
              스토리 연결 안 함 (기본 노트북)
            </Dropdown.Option>
            {isStoriesLoading ? (
              <Dropdown.Option optionId={-1} style={{ pointerEvents: 'none', opacity: 0.6 }}>
                스토리 목록을 불러오는 중...
              </Dropdown.Option>
            ) : stories.length === 0 ? (
              <Dropdown.Option optionId={-2} style={{ pointerEvents: 'none', opacity: 0.6 }}>
                생성된 스토리가 없습니다
              </Dropdown.Option>
            ) : (
              stories.map((story) => (
                <Dropdown.Option key={story.id} optionId={story.id}>
                  {story.title}
                </Dropdown.Option>
              ))
            )}
          </Dropdown.Menu>
        </Dropdown>
      </section>
    </>
  );
};
