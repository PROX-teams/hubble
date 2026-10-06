import React from 'react';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import * as metaS from './NoteMeta.css';
import * as pageS from '@/app/(notebook)/notebook/(article)/[id]/page.css';

/**
 * 노트북 상세 페이지([id])의 레이아웃과 1:1로 매칭되는 합성(Composition) 스켈레톤
 * - NoteMeta 영역: 카테고리 + 제목(h1) + 작성자 + 태그 목록
 * - NoteViewer 영역: 실제 본문 텍스트 단락들의 shimmer 플레이스홀더
 */
export const NotebookDetailSkeleton = () => {
  return (
    <div className={pageS.container} aria-label="노트 상세 로딩 중">
      {/* 1. NoteMeta 스켈레톤 */}
      <header className={metaS.header} style={{ pointerEvents: 'none' }}>
        {/* 카테고리 뱃지 */}
        <Skeleton width="64px" height="22px" borderRadius="12px" />

        {/* 제목 h1 */}
        <div style={{ marginTop: '8px', marginBottom: '8px' }}>
          <Skeleton width="75%" height="38px" borderRadius="6px" />
        </div>

        {/* 작성자 메타 */}
        <div className={metaS.meta}>
          <Skeleton width="90px" height="18px" borderRadius="4px" />
        </div>

        {/* 태그 목록 */}
        <div className={metaS.tagList}>
          <Skeleton width="56px" height="24px" borderRadius="14px" />
          <Skeleton width="72px" height="24px" borderRadius="14px" />
          <Skeleton width="60px" height="24px" borderRadius="14px" />
        </div>
      </header>

      {/* 2. NoteViewer (본문 단락) 스켈레톤 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px', width: '100%' }}>
        <Skeleton width="100%" height="20px" borderRadius="4px" />
        <Skeleton width="94%" height="20px" borderRadius="4px" />
        <Skeleton width="88%" height="20px" borderRadius="4px" />
        <Skeleton width="60%" height="20px" borderRadius="4px" />

        <div style={{ height: '24px' }} />

        <Skeleton width="98%" height="20px" borderRadius="4px" />
        <Skeleton width="90%" height="20px" borderRadius="4px" />
        <Skeleton width="70%" height="20px" borderRadius="4px" />

        <div style={{ height: '20px' }} />

        {/* 코드블록 또는 이미지 플레이스홀더 느낌의 큰 블록 */}
        <Skeleton width="100%" height="160px" borderRadius="8px" />

        <div style={{ height: '16px' }} />

        <Skeleton width="92%" height="20px" borderRadius="4px" />
        <Skeleton width="80%" height="20px" borderRadius="4px" />
      </div>
    </div>
  );
};

export default NotebookDetailSkeleton;
