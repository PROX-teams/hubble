'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/shared/ui/modal/modal/Modal';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import ChartIcon from '@/shared/assets/icons/common/chart.svg';
import { createStory, updateStory } from '@/entities/story/api/story.api';
import type { CategoryType } from '@/shared/types';
import type { Story } from '@/entities/story/story.types';
import * as S from './CreateStoryModal.css';

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'DEVELOPMENT', label: '개발' },
  { id: 'DESIGN', label: '디자인' },
  { id: 'PLANNING', label: '기획' },
  { id: 'MARKETING', label: '마케팅' },
  { id: 'LIFE', label: '일상' },
  { id: 'OTHER', label: '기타' },
];

export interface CreateStoryModalProps {
  isOpen: boolean;
  initialStory?: Story | null;
  onClose: () => void;
}

export const CreateStoryModal = ({
  isOpen,
  initialStory,
  onClose,
}: CreateStoryModalProps) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialStory);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('DEVELOPMENT');
  const [icon, setIcon] = useState('chart');

  // 수정 모드일 때 기존 스토리 데이터 채우기
  useEffect(() => {
    if (initialStory) {
      setTitle(initialStory.title || '');
      setDescription(initialStory.description || '');
      setCategory(initialStory.category || 'DEVELOPMENT');
      setIcon(initialStory.icon || 'chart');
    } else {
      setTitle('');
      setDescription('');
      setCategory('DEVELOPMENT');
      setIcon('chart');
    }
  }, [initialStory, isOpen]);

  const { mutate: handleSaveStory, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        title,
        description: description.trim() ? description : undefined,
        category,
        icon,
      };

      if (isEdit && initialStory) {
        return updateStory(initialStory.id, payload);
      }
      return createStory(payload);
    },
    onSuccess: () => {
      // 내 스토리 목록 및 상세 캐시 즉시 갱신
      queryClient.invalidateQueries({ queryKey: ['myStories'] });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      onClose();
    },
    onError: (error) => {
      alert(isEdit ? '스토리 수정에 실패했습니다.' : '스토리 생성에 실패했습니다.');
      console.error(error);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('스토리 명을 입력해 주세요.');
      return;
    }
    handleSaveStory();
  };

  return (
    <Modal hide={onClose} hideOnClickOutside className={S.modal}>
      <h2 className={S.title}>{isEdit ? 'Edit Story' : 'New Story'}</h2>

      <form onSubmit={handleSubmit}>
        <div className={S.formBody}>
          {/* 좌측: 스토리 정보 */}
          <div className={S.column}>
            <span className={S.sectionTitle}>스토리 정보</span>

            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>스토리 명</label>
              <input
                type="text"
                className={S.input}
                placeholder="내용을 입력해 주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>스토리 소개</label>
              <textarea
                className={S.textarea}
                placeholder="내용을 입력해 주세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* 우측: 스토리 설정 */}
          <div className={S.column}>
            <span className={S.sectionTitle}>스토리 설정</span>

            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>카테고리</label>
              <Dropdown onSelect={(id) => setCategory(id as CategoryType)}>
                <Dropdown.Trigger>
                  <Dropdown.Value>
                    {({ selectedOption }) =>
                      selectedOption
                        ? CATEGORIES.find((c) => c.id === (selectedOption as CategoryType))?.label
                        : CATEGORIES.find((c) => c.id === category)?.label || '카테고리 선택'
                    }
                  </Dropdown.Value>
                  <Dropdown.Icon />
                </Dropdown.Trigger>
                <Dropdown.Menu>
                  {CATEGORIES.map((cat) => (
                    <Dropdown.Option key={cat.id} optionId={cat.id}>
                      {cat.label}
                    </Dropdown.Option>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className={S.fieldGroup}>
              <label className={S.fieldLabel}>아이콘</label>
              <div className={S.iconPickerBox} title="스토리 아이콘">
                <ChartIcon width={24} height={24} />
              </div>
            </div>
          </div>
        </div>

        {/* 하단 푸터 버튼 */}
        <div className={S.footer}>
          <button type="button" className={S.cancelButton} onClick={onClose} disabled={isPending}>
            취소
          </button>
          <button type="submit" className={S.submitButton} disabled={isPending || !title.trim()}>
            {isPending ? '저장 중...' : '완료'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStoryModal;
