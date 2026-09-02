'use client';

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import HeartIcon from '@/shared/assets/icons/common/heart.svg';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useToggleLike } from '../model/useToggleLike';
import * as S from './LikeButton.css';

export interface LikeButtonProps {
  noteId: number;
  isLiked?: boolean;
  likeCount?: number;
  className?: string;
}

export const LikeButton = ({
  noteId,
  isLiked: propLiked = false,
  likeCount: propCount = 0,
  className,
}: LikeButtonProps) => {
  const { isLoggedIn } = useAuthStore();
  const [localLiked, setLocalLiked] = useState(propLiked);
  const [localCount, setLocalCount] = useState(propCount);

  useEffect(() => {
    setLocalLiked(propLiked);
    setLocalCount(propCount);
  }, [propLiked, propCount]);

  const { mutate: handleToggle, isPending } = useToggleLike(noteId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (isPending) return;

    // 즉시 시각적 반응 (낙관적 UI)
    const nextState = !localLiked;
    setLocalLiked(nextState);
    setLocalCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    handleToggle(undefined, {
      onError: () => {
        setLocalLiked(propLiked);
        setLocalCount(propCount);
      },
    });
  };

  return (
    <button
      type="button"
      className={clsx(
        S.button,
        localLiked && S.liked,
        className
      )}
      onClick={handleClick}
      disabled={isPending}
      aria-label="좋아요 토글"
      title={localLiked ? '좋아요 취소' : '좋아요'}
    >
      <HeartIcon
        width={14}
        height={14}
        fill={localLiked ? 'currentColor' : 'none'}
      />
      <span className={S.count}>{localCount}</span>
    </button>
  );
};

export default LikeButton;
