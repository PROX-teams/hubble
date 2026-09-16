'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAnimation } from 'framer-motion';

interface UseCarouselProps {
  total: number;
  visibleCount: number;
  interval: number;
}

export const useCarousel = ({ total, visibleCount, interval }: UseCarouselProps) => {
  const isLoop = total > visibleCount;
  const [currentIndex, setCurrentIndex] = useState(isLoop ? visibleCount : 0);
  const controls = useAnimation();
  const isMoving = useRef(false);

  const handleJump = useCallback(
    async (newIndex: number) => {
      if (!isLoop) return;
      
      // 무한 루프 경계에 도달했을 때 위치를 순간 재배치하여 끊김 없는 순환 효과 제공
      if (newIndex >= total + visibleCount) {
        controls.set({ x: `-${(visibleCount / visibleCount) * 100}%` });
        setCurrentIndex(visibleCount);
      } else if (newIndex <= 0) {
        controls.set({ x: `-${(total / visibleCount) * 100}%` });
        setCurrentIndex(total);
      }
      isMoving.current = false;
    },
    [isLoop, total, visibleCount, controls]
  );

  const move = useCallback(
    async (step: number) => {
      if (isMoving.current) return;
      isMoving.current = true;

      const nextIndex = currentIndex + step;
      setCurrentIndex(nextIndex);

      await controls.start({
        x: `-${(nextIndex / visibleCount) * 100}%`,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });

      await handleJump(nextIndex);
    },
    [currentIndex, controls, visibleCount, handleJump]
  );

  useEffect(() => {
    if (total <= 1 || total <= visibleCount) return;

    const timer = setInterval(() => {
      move(1);
    }, interval);

    return () => clearInterval(timer);
  }, [move, interval, total, visibleCount]);

  return {
    currentIndex,
    controls,
    isLoop,
    move,
  };
};
