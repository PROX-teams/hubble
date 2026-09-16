'use client';

import React, { useRef, ReactNode } from 'react';
import { Carousel, type CarouselRef } from '@/shared/ui/carousel/Carousel';
import { CarouselButton } from '@/shared/ui/carousel/CarouselButton';
import * as s from './RecommendCarouselSection.css';

export interface RenderItemMeta {
  index: number;
  isPriority: boolean;
}

interface RecommendCarouselSectionProps<T> {
  title: string;
  isLoading: boolean;
  items: T[];
  visibleCount?: number;
  interval?: number;
  emptyMessage: string;
  keyExtractor?: (item: T, index: number) => string | number;
  renderItem: (item: T, meta: RenderItemMeta) => ReactNode;
  renderSkeleton?: (index: number) => ReactNode;
  skeletonCount?: number;
  skeletonVariant?: 'normal' | 'wide';
}

/**
 * 메인 및 추천 영역에서 캐러셀 섹션을 일관되게 구성하는 위젯 컴포넌트
 * - FSD 아키텍처에 따라 컴포넌트 전용 스타일을 격리
 * - LCP 최적화를 위해 visibleCount 범위 내의 아이템에 isPriority 메타데이터 제공
 * - keyExtractor를 통한 안전한 리액트 Key 관리
 * - skeletonCount 및 skeletonVariant를 통한 유연한 스켈레톤 렌더링
 */
export function RecommendCarouselSection<T>({
  title,
  isLoading,
  items,
  visibleCount = 4,
  interval = 4000,
  emptyMessage,
  keyExtractor,
  renderItem,
  renderSkeleton,
  skeletonCount,
  skeletonVariant = 'normal',
}: RecommendCarouselSectionProps<T>) {
  const carouselRef = useRef<CarouselRef>(null);

  const isButtonDisabled = isLoading || items.length <= visibleCount;
  const count = skeletonCount ?? visibleCount;

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
          renderSkeleton && (
            <div className={skeletonVariant === 'wide' ? s.skeletonRowWide : s.skeletonRow}>
              {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={`skeleton-${index}`}>
                  {renderSkeleton(index)}
                </React.Fragment>
              ))}
            </div>
          )
        ) : items.length === 0 ? (
          <div className={s.emptyMessage}>{emptyMessage}</div>
        ) : (
          <Carousel ref={carouselRef} visibleCount={visibleCount} interval={interval}>
            {items.map((item, index) => {
              const key = keyExtractor
                ? keyExtractor(item, index)
                : ((item as Record<string, unknown>)?.id as string | number) ?? index;

              return (
                <React.Fragment key={key}>
                  {renderItem(item, {
                    index,
                    isPriority: index < visibleCount,
                  })}
                </React.Fragment>
              );
            })}
          </Carousel>
        )}
      </div>
    </section>
  );
}
