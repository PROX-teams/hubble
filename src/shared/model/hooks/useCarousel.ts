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
    // newIndex는 버튼으로 이동된값 => 현재 인덱스 첫 시간은 4 => 아마 보여주는 끝의 수를 나타내는듯  5 6 7 8 1 2 3 4
    // 현재 인덱스의 변화 4,5,6,7,8,9,10,11,12 ,4,5,6,7,8,9,10,11,12 반복된다. => 여기 값들중에 해당 되기 전에 배열 재배치 할듯
    async (newIndex: number) => {
      if (!isLoop) return;
      //새로운 인덱스 값이 라는게 있고, 전체 30, 4 라고 하면 8 보다 크거나 같으면   123456781234
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

      // 누르면 현재 인덱스에서 값증가. 1씩 증가하고, 현재 인덱스관리 어떻게 하나? 
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
