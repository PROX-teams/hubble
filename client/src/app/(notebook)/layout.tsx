'use client';

import React from 'react';
import { NotebookSidebar } from '@/widgets/notebook-sidebar/NotebookSidebar';
import { AsyncBoundary } from '@/shared/ui/error-boundary';

export default function NotebookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* 1. 사이드바 에러 격리: 사이드바 장애가 발생해도 본문 에디터는 정상 동작 */}
      <AsyncBoundary>
        <NotebookSidebar />
      </AsyncBoundary>

      {/* 2. 본문 영역 에러 격리: 본문 렌더링 에러 발생 시에도 좌측 탐색 사이드바 유지 */}
      <main>
        <AsyncBoundary>
          {children}
        </AsyncBoundary>
      </main>
    </div>
  );
}
