'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import BookmarkIcon from '@/shared/assets/icons/common/bookmark.svg';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useBookmarkList } from '@/entities/note/model/useBookmarkList';
import { useToggleBookmark } from '../model/useToggleBookmark';
import * as S from './BookmarkButton.css';

export interface BookmarkButtonProps {
  noteId: number;
  isBookmarked?: boolean;
  bookmarkCount?: number;
  className?: string;
}

export const BookmarkButton = ({
  noteId,
  isBookmarked: propBookmarked = false,
  bookmarkCount: propCount = 0,
  className,
}: BookmarkButtonProps) => {
  const { isLoggedIn } = useAuthStore();
  const { bookmarkList } = useBookmarkList();

  const isBookmarkedInList = isLoggedIn && bookmarkList.some((n) => n.id === noteId);
  const isBookmarked = isBookmarkedInList || propBookmarked;

  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);
  const [localCount, setLocalCount] = useState(propCount);

  useEffect(() => {
    setLocalBookmarked(isBookmarked);
    setLocalCount(propCount);
  }, [isBookmarked, propCount]);

  const { mutate: handleToggle, isPending } = useToggleBookmark(noteId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (isPending) return;

    // 즉각적인 시각적 피드백 (0.01초 만에 +1 / -1)
    const nextState = !localBookmarked;
    setLocalBookmarked(nextState);
    setLocalCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    handleToggle();
  };

  return (
    <button
      type="button"
      className={clsx(
        S.button,
        localBookmarked && S.bookmarked,
        className
      )}
      onClick={handleClick}
      disabled={isPending}
      aria-label="북마크 토글"
      title={localBookmarked ? '북마크 해제' : '북마크 추가'}
    >
      <BookmarkIcon
        width={16}
        height={16}
        fill={localBookmarked ? 'currentColor' : 'none'}
      />
      <span className={S.count}>{localCount}</span>
    </button>
  );
};

export default BookmarkButton;
