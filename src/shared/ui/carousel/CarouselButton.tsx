'use client';

import * as s from './CarouselButton.css';
import NextIcon from '@/shared/assets/icons/common/next.svg';
import PrevIcon from '@/shared/assets/icons/common/prev.svg';

interface CarouselButtonProps {
  direction: 'prev' | 'next';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const CarouselButton = ({ 
  direction, 
  onClick, 
  disabled, 
  className 
}: CarouselButtonProps) => {
  return (
    <button 
      className={`${s.button} ${className ?? ''}`} 
      onClick={onClick} 
      disabled={disabled}
      aria-label={direction === 'prev' ? '이전 슬라이드' : '다음 슬라이드'}
    >
      {direction === 'prev' ? (
          <PrevIcon />
        ) : (
          <NextIcon />
      )}
    </button>
  );
};
