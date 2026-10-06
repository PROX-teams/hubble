'use client';

import React, { useRef, ReactNode } from 'react';
import { Carousel, type CarouselRef } from '@/shared/ui/carousel/Carousel';
import { CarouselButton } from '@/shared/ui/carousel/CarouselButton';
import * as s from './RecommendCarouselSection.css';

export interface RenderItemMeta {
  index: number;
  isPriority: boolean;
}

export interface RecommendCarouselSectionProps<T extends { id?: string | number } = { id?: string | number }> {
  title: string;
  isLoading: boolean;
  items?: T[];
  visibleCount?: number;
  emptyMessage?: string;
  renderItem: (item: T, meta: RenderItemMeta) => ReactNode;
  renderSkeleton?: () => ReactNode;
  gap?: number;
  widthVariant?: 'compact' | 'full';
}

/**
 * 메인 및 추천 영역에서 캐러셀 섹션을 일관되게 구성하는 위젯 컴포넌트
 * - FSD 아키텍처에 따라 컴포넌트 전용 스타일을 격리
 * - LCP 최적화를 위해 visibleCount 범위 내의 아이템에 isPriority 메타데이터 제공
 */
export function RecommendCarouselSection<T extends { id?: string | number }>({
  title,
  isLoading,
  items = [],
  visibleCount = 3,
  emptyMessage = '등록된 데이터가 없습니다.',
  renderItem,
  renderSkeleton,
  gap = 16,
  widthVariant = 'full',
}: RecommendCarouselSectionProps<T>) {
  const carouselRef = useRef<CarouselRef>(null);

  const isButtonDisabled = isLoading || items.length <= visibleCount;

  return (
    <section className={s.contentSection[widthVariant]}>
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

      <div className={s.carouselWrapper[widthVariant]}>
        {isLoading ? (
          renderSkeleton && (
            <div className={s.skeletonRow} style={{ gap: `${gap}px` }}>
              {Array.from({ length: visibleCount }).map((_, index) => (
                <React.Fragment key={`skeleton-${index}`}>
                  {renderSkeleton()}
                </React.Fragment>
              ))}
            </div>
          )
        ) : items.length === 0 ? (
          <div className={s.emptyMessage}>{emptyMessage}</div>
        ) : (
          <Carousel
            ref={carouselRef}
            visibleCount={visibleCount}
            gap={gap}
          >
            {items.map((item, index) => (
              <React.Fragment key={item?.id ?? index}>
                {renderItem(item, {
                  index,
                  isPriority: index < visibleCount,
                })}
              </React.Fragment>
            ))}
          </Carousel>
        )}
      </div>
    </section>
  );
}
