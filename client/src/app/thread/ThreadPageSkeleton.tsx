'use client';

import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import * as S from './page.css';

/**
 * 쓰레드 페이지의 Suspense fallback 스켈레톤 UI
 */
export function ThreadPageSkeleton() {
  return (
    <div className={S.container}>
      {/* 헤더 섹션 스켈레톤 */}
      <div className={S.headerSection}>
        <Skeleton width="160px" height="36px" borderRadius="8px" />
        <Skeleton width="280px" height="20px" borderRadius="6px" />
      </div>

      {/* 상단 탭 스켈레톤 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width="90px" height="40px" borderRadius="10px" />
        <Skeleton width="90px" height="40px" borderRadius="10px" />
      </div>

      {/* 필터 바 스켈레톤 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="60px" height="32px" borderRadius="16px" />
          ))}
        </div>
        <Skeleton width="110px" height="36px" borderRadius="8px" />
      </div>

      {/* 카드 리스트 그리드 스켈레톤 */}
      <div className={S.listSection}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            width="100%"
            height="304px"
            borderRadius="16px"
          />
        ))}
      </div>
    </div>
  );
}
