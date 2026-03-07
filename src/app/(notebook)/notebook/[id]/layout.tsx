'use client';

import React from 'react';
import { SideBar } from "@/shared/ui/sidebar/SideBar";

export default function InnerNotebookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 실제 서비스 구현 시 우측 사이드바용 별도 상태가 필요할 수 있습니다.
  const isRightSidebarOpen = true; 

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* 샌드위치 구조: 좌측 사이드바는 상위 layout에 이미 존재 */}
      
      {/* 중앙 메인 콘텐츠 영역 */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* 우측 사이드바 위치 (디자인 없이 위치만 선점) */}
      <SideBar isSidebarOpen={isRightSidebarOpen} position="right">
        <div>
           이거는 ㄷ디텡ㄹ
        </div>
      </SideBar>
    </div>
  );
}