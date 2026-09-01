'use client';

import React from 'react';
import Link from 'next/link';
import { useNotebookFilter } from '@/entities/note/model/useNotebookFilter';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useUserProfile } from '@/entities/user/model/useUserProfile';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import Button from '@/shared/ui/button/button/Button';
import { PATHS } from '@/shared/constants/paths';
import type { SortType } from '@/shared/types/api.types';
import * as S from './NotebookHeader.css';

interface NotebookHeaderProps {
  title?: string;
  totalCount?: number;
}

const SORT_LABEL_MAP: Record<SortType, string> = {
  mostViewed: 'Most Viewed',
  latest: 'Latest',
  mostLiked: 'Most Liked',
};

/**
 * 노트북 상단 헤더 (타이틀, 글 개수 카운트, 소유권별 액션 버튼, 정렬 드롭다운)
 */
export const NotebookHeader = ({
  title,
  totalCount = 0,
}: NotebookHeaderProps) => {
  const { targetUserId, sortType, setSortType } = useNotebookFilter('mostViewed');
  const { user: currentUser } = useAuthStore();

  // 소유권(내 노트북인지 여부) 판별: targetUserId가 없거나 로그인 유저와 ID가 일치할 때
  const isOwner = targetUserId === undefined || (currentUser !== null && currentUser.id === targetUserId);

  // 타인 노트북일 때만 상대방 프로필 정보 조회
  const { userProfile: targetUser } = useUserProfile(isOwner ? undefined : targetUserId);

  // 타이틀이 별도로 주어지지 않으면 닉네임 기반으로 동적 생성
  const displayTitle =
    title ||
    (isOwner
      ? `${currentUser?.nickname || '내'}의 Notebook`
      : `${targetUser?.nickname || '사용자'}의 Notebook`);

  return (
    <header className={S.header}>
      <div className={S.titleGroup}>
        <h1 className={S.pageTitle}>{displayTitle}</h1>
        <p className={S.noteCount}>{totalCount}개의 노트</p>
      </div>

      <div className={S.actionsSection}>
        {/* 소유권(내 노트북 vs 타인 노트북)에 따른 액션 버튼 분기 */}
        {isOwner ? (
          <Button
            as={Link}
            href={PATHS.NOTEBOOK_NEW}
            variants="colored"
            size="sm"
            className={S.actionButton}
          >
            + 새 노트 작성
          </Button>
        ) : (
          <Button
            variants="neutral"
            size="sm"
            className={S.actionButton}
            onClick={() => alert('팔로우 기능이 곧 추가됩니다.')}
          >
            + 팔로우
          </Button>
        )}

        {/* 정렬 드롭다운 */}
        <Dropdown>
          <Dropdown.Trigger size="xl" variant="surface">
            <Dropdown.Value>{() => SORT_LABEL_MAP[sortType]}</Dropdown.Value>
            <Dropdown.Icon />
          </Dropdown.Trigger>
          <Dropdown.Menu>
            {Object.entries(SORT_LABEL_MAP).map(([key, label]) => (
              <Dropdown.Option
                key={key}
                optionId={key}
                onClick={() => setSortType(key as SortType)}
              >
                {label}
              </Dropdown.Option>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default NotebookHeader;
