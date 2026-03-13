'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as s from './NotebookEditorSidebar.css';
import { SideBar } from '@/shared/ui/sidebar/SideBar';
import { Input } from '@/shared/ui/input/input/Input';
import { Textarea } from '@/shared/ui/input/textarea/Textarea';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import Button from '@/shared/ui/button/button/Button';
import Tag from '@/shared/ui/tag/Tag';
import AddIcon from '@/shared/assets/icons/common/add.svg';
import { useSidebarStore } from '@/shared/model/stores/useSidebarStore';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { createNote } from '@/entities/note/api/note.api';
import { CategoryType } from '@/shared/types/api.types';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'DEVELOPMENT', label: '개발' },
  { id: 'DESIGN', label: '디자인' },
  { id: 'PLANNING', label: '기획' },
  { id: 'MARKETING', label: '마케팅' },
  { id: 'LIFE', label: '일상' },
  { id: 'OTHER', label: '기타' },
];

const MOCK_STORIES = [
  { id: 1, title: '프론트엔드 공부집' },
  { id: 2, title: '리액트 마스터' },
  { id: 3, title: 'CS 기초 지식' },
];

export const NotebookEditorSidebar = () => {
  const router = useRouter();
  const [tagInput, setTagInput] = useState('');
  const { isSidebarOpen } = useSidebarStore();
  const { isLoggedIn } = useAuthStore();
  
  const { 
    title, 
    content, 
    category, 
    tag, 
    imageUrl, 
    storyId,
    setCategory,
    setTag,
    setStoryId,
    reset
  } = useNoteEditorStore();

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tag.includes(tagInput.trim())) {
        setTag([...tag, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTag(tag.filter((t) => t !== tagToRemove));
  };

  const handlePublish = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      await createNote({
        title,
        content,
        category,
        tag,
        imageUrl,
        storyId: storyId || undefined,
      });
      
      alert('노트가 게시되었습니다.');
      reset();
      router.push('/thread');
    } catch (error) {
      console.error('Failed to publish note:', error);
      alert('노트 게시 중 오류가 발생했습니다.');
    }
  };

  return (
    <SideBar 
      position="right" 
      isSidebarOpen={isSidebarOpen} 
      className={s.sidebarContainer}
    >
      <header>
        <h3>노트설정</h3>
      </header>

      {/* 노트 정보 (타이틀) */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>노트 정보</h3>
      </section>

      {/* 카테고리 및 스토리에 추가 */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>카테고리 및 스토리</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Dropdown onSelect={(id) => setCategory(id as CategoryType)}>
            <Dropdown.Trigger>
              <Dropdown.Value>
                {({ selectedOption }) => (
                  selectedOption 
                    ? CATEGORIES.find(c => c.id === (selectedOption as CategoryType))?.label 
                    : CATEGORIES.find(c => c.id === category)?.label || '카테고리 설정'
                )}
              </Dropdown.Value>
              <Dropdown.Icon />
            </Dropdown.Trigger>
            <Dropdown.Menu>
              {CATEGORIES.map((cat) => (
                <Dropdown.Option 
                  key={cat.id} 
                  optionId={cat.id}
                >
                  {cat.label}
                </Dropdown.Option>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown onSelect={(id) => setStoryId(Number(id))}>
            <Dropdown.Trigger size="3xl">
              <Dropdown.Value>
                {({ selectedOption }) => (
                  selectedOption 
                    ? MOCK_STORIES.find(s => s.id === Number(selectedOption))?.title 
                    : storyId 
                      ? MOCK_STORIES.find(s => s.id === storyId)?.title 
                      : '스토리를 선택해주세요'
                )}
              </Dropdown.Value>
              <Dropdown.Icon />
            </Dropdown.Trigger>
            <Dropdown.Menu size="2xl">
              {MOCK_STORIES.map((story) => (
                <Dropdown.Option 
                  key={story.id} 
                  optionId={story.id}
                >
                  {story.title}
                </Dropdown.Option>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </section>

      {/* 노트 소개 */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>노트 소개</h3>
        <Textarea 
          placeholder="노트에 대한 짧은 소개글을 작성해주세요 (현재는 본문 내용이 저장됩니다)" 
          variant="solid"
          size="md"
          disabled
        />
      </section>

      {/* 태그 추가 */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>태그 추가</h3>
        <Input 
          placeholder="태그를 입력하고 Enter를 누르세요" 
          variant="solid"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          size="sm"
        />
        <div className={s.tagList}>
          {tag.map((t) => (
            <Tag 
              key={t} 
              label={t} 
              onRemove={() => handleRemoveTag(t)} 
            />
          ))}
        </div>
      </section>

      {/* 이미지 첨부 */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>노트 커버 이미지</h3>
        <div className={s.imageUploadBox}>
          <AddIcon />
          <span>이미지 업로드</span>
        </div>
      </section>

      {/* 버튼 그룹 */}
      <div className={s.buttonGroup}>
        <Button 
          variants="neutral" 
          size="lg" 
        >
          임시저장
        </Button>
        <Button 
          variants="colored" 
          size="lg" 
          onClick={handlePublish}
        >
          게시하기
        </Button>
      </div>
    </SideBar>
  );
};
