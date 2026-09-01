'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotebookNotes } from '@/entities/note/model/useMyNotes';
import { useNotebookFilter } from '@/entities/note/model/useNotebookFilter';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import useModal from '@/shared/model/hooks/useModal';
import { NotebookHeader } from '@/widgets/notebook-header/NotebookHeader';
import { NotebookTagBar } from '@/widgets/notebook-tag-bar/NotebookTagBar';
import { NotebookNoteGrid } from '@/widgets/notebook-note-grid/NotebookNoteGrid';
import AuthRequiredModal from '@/shared/ui/modal/auth-modal/AuthRequiredModal';
import { PATHS } from '@/shared/constants/paths';
import * as s from './page.css';

function NotebookContent() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { targetUserId, selectedTag, sortType } = useNotebookFilter('mostViewed');
  
  // 기존 공통 useModal 훅 사용
  const { isOpen: isAuthModalOpen, openModal: openAuthModal, closeModal: closeAuthModal } = useModal();

  // 비로그인 상태에서 내 노트북(/notebook)에 접근했을 때 로그인 모달 오픈
  useEffect(() => {
    if (!isLoggedIn && !targetUserId) {
      openAuthModal();
    }
  }, [isLoggedIn, targetUserId, openAuthModal]);

  const { notes, totalElements, isLoading } = useNotebookNotes({
    userId: targetUserId,
    tagName: selectedTag || undefined,
    sortType,
  });

  return (
    <div className={s.container}>
      {/* 1층: 타이틀(닉네임 자동), 전체 글 카운트, 우측 버튼(새글/팔로우) & 정렬 드롭다운 */}
      <NotebookHeader totalCount={totalElements} />

      {/* 2층: 태그 칩 필터 바 (Props 0개 자율형) */}
      <NotebookTagBar />

      {/* 3층: 3열 카드 그리드 */}
      <NotebookNoteGrid
        notes={notes}
        isLoading={isLoading}
      />

      {/* 비로그인 안내 모달 (기존 useModal 훅으로 제어) */}
      {isAuthModalOpen && (
        <AuthRequiredModal
          hide={closeAuthModal}
          onCancel={() => router.push(PATHS.HOME)}
        />
      )}
    </div>
  );
}

export default function NotebookPage() {
  return (
    <Suspense fallback={<div className={s.container}>노트를 불러오는 중입니다...</div>}>
      <NotebookContent />
    </Suspense>
  );
}
