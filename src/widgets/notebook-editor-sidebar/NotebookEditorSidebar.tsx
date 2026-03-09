'use client';

import React, { useState } from 'react';
import * as s from './NotebookEditorSidebar.css';
import { SideBar } from '@/shared/ui/sidebar/SideBar';
import { Input } from '@/shared/ui/input/input/Input';
import { Textarea } from '@/shared/ui/input/textarea/Textarea';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import Button from '@/shared/ui/button/button/Button';
import Tag from '@/shared/ui/tag/Tag';
import AddIcon from '@/shared/assets/icons/common/add.svg';
import { useSidebarStore } from '@/shared/model/stores/useSidebarStore';

const MOCK_STORIES = [
  { id: 1, title: '프론트엔드 공부집' },
  { id: 2, title: '리액트 마스터' },
  { id: 3, title: 'CS 기초 지식' },
];

export const NotebookEditorSidebar = () => {
  const [tags, setTags] = useState<string[]>(['프론트엔드', 'React']);
  const [tagInput, setTagInput] = useState('');
  const { isSidebarOpen }= useSidebarStore()

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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

      {/* 스토리에 추가 (드롭다운) */}
      <section className={s.section}>
        <h3 className={s.sectionTitle}>스토리에 추가</h3>
        <div>
          <Dropdown>
            <Dropdown.Trigger>
              <Dropdown.Value>
                {({ selectedOption }) => (selectedOption ? selectedOption : '카테고리 설정')}
              </Dropdown.Value>
              <Dropdown.Icon />
            </Dropdown.Trigger>
            <Dropdown.Menu>
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
          <Dropdown>
            <Dropdown.Trigger size="3xl">
              <Dropdown.Value>
                {({ selectedOption }) => (selectedOption ? selectedOption : '스토리를 선택해주세요')}
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
          placeholder="노트에 대한 짧은 소개글을 작성해주세요" 
          variant="solid"
          size="md"
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
          {tags.map((tag) => (
            <Tag 
              key={tag} 
              label={tag} 
              onRemove={() => handleRemoveTag(tag)} 
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
        >
          게시하기
        </Button>
      </div>
    </SideBar>
  );
};
