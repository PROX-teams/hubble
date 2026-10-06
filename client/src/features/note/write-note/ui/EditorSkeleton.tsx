import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';

/**
 * 에디터 Dynamic Import 로딩 시 노출되는 스켈레톤 컴포넌트
 * - 실제 Editor(제목 입력창 + 툴바 + 에디터 본문 영역)의 높이와 규격을 1:1로 모사하여 CLS 방지
 */
export const EditorSkeleton = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '840px',
        margin: '0 auto',
        padding: '40px 20px',
        gap: '24px',
        boxSizing: 'border-box',
      }}
      aria-label="에디터 로딩 중"
    >
      {/* 제목 입력창 스켈레톤 */}
      <Skeleton width="65%" height="44px" borderRadius="6px" />

      {/* 툴바 플레이스홀더 */}
      <div style={{ display: 'flex', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
        <Skeleton width="32px" height="32px" borderRadius="4px" />
        <Skeleton width="32px" height="32px" borderRadius="4px" />
        <Skeleton width="32px" height="32px" borderRadius="4px" />
        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '4px 4px' }} />
        <Skeleton width="32px" height="32px" borderRadius="4px" />
        <Skeleton width="32px" height="32px" borderRadius="4px" />
        <Skeleton width="80px" height="32px" borderRadius="4px" />
      </div>

      {/* 본문 콘텐츠 스켈레톤 라인들 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
        <Skeleton width="100%" height="20px" borderRadius="4px" />
        <Skeleton width="92%" height="20px" borderRadius="4px" />
        <Skeleton width="85%" height="20px" borderRadius="4px" />
        <Skeleton width="60%" height="20px" borderRadius="4px" />
        <div style={{ height: '16px' }} />
        <Skeleton width="96%" height="20px" borderRadius="4px" />
        <Skeleton width="75%" height="20px" borderRadius="4px" />
      </div>
    </div>
  );
};

export default EditorSkeleton;
