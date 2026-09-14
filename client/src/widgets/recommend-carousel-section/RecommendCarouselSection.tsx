'use client';

import React, { useRef, ReactNode } from 'react';
import { Carousel, type CarouselRef } from '@/shared/ui/carousel/Carousel';
import { CarouselButton } from '@/shared/ui/carousel/CarouselButton';
import * as s from '@/app/page.css';

interface RecommendCarouselSectionProps<T> {
  title: string;
  isLoading: boolean;
  items: T[];
  visibleCount?: number;
  interval?: number;
  emptyMessage: string;
  skeleton: ReactNode;
  renderItem: (item: T, index: number) => ReactNode;
}

export function RecommendCarouselSection<T>({
  title,
  isLoading,
  items,
  visibleCount = 4,
  interval = 4000,
  emptyMessage,
  skeleton,
  renderItem,
}: RecommendCarouselSectionProps<T>) {
  const carouselRef = useRef<CarouselRef>(null);

  // 버튼 비활성화 상태를 visibleCount와 연동하여 매직 넘버 하드코딩 완전 제거
  const isButtonDisabled = isLoading || items.length <= visibleCount;

  return (
    <section className={s.contentSection}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>{title}</h2>
        <div className={s.buttonGroup}>
          <CarouselButton
            direction="prev"
            onClick={() => carouselRef.current?.prev()}
            disabled={isButtonDisabled}
          />
          <CarouselButton
            direction="next"
            onClick={() => carouselRef.current?.next()}
            disabled={isButtonDisabled}
          />
        </div>
      </div>

      <div className={s.carouselWrapper}>
        {isLoading ? (
          skeleton
        ) : items.length === 0 ? (
          <div>{emptyMessage}</div>
        ) : (
          <Carousel ref={carouselRef} visibleCount={visibleCount} interval={interval}>
            {items.map((item, index) => renderItem(item, index))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
