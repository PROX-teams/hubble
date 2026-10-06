import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import * as s from './CreatorCard.css';

interface CreatorCardSkeletonProps {
  /** 렌더링할 스켈레톤 카드 개수 (기본값: 1) */
  count?: number;
}

const SingleSkeleton = () => (
  <div className={s.container} style={{ pointerEvents: 'none', cursor: 'default' }}>
    {/* 아바타 원형 스켈레톤 */}
    <Skeleton width="40px" height="40px" borderRadius="50%" style={{ flexShrink: 0 }} />

    {/* 텍스트 영역 스켈레톤 */}
    <div className={s.contentWrapper}>
      <Skeleton width="50%" height="15px" borderRadius="4px" />
      <Skeleton width="80%" height="12px" borderRadius="4px" style={{ marginTop: '4px' }} />
    </div>
  </div>
);

/**
 * CreatorCard 로딩 상태를 나타내는 스켈레톤 컴포넌트입니다.
 * - count prop을 지정하면 복수 개의 스켈레톤을 스스로 캡슐화하여 렌더링합니다. (기본값: 1)
 * - 호출부에서 Array.from이나 map을 직접 다룰 필요 없이 선언적으로 사용할 수 있습니다.
 */
export const CreatorCardSkeleton = ({ count = 1 }: CreatorCardSkeletonProps = {}) => {
  if (count <= 1) {
    return <SingleSkeleton />;
  }

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SingleSkeleton key={`creator-skeleton-${i}`} />
      ))}
    </>
  );
};
