'use client';

import React from 'react';
import { SideBar } from "@/shared/ui/sidebar/SideBar";
import { NotebookSidebar } from "@/widgets/notebook-sidebar/NotebookSidebar";
import { NotebookHeader } from "@/widgets/notebook-header/NotebookHeader";

export default function NotebookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingTop: '3rem' }}>
      {/* 상단 GNB (상태창) - 요청하신 GNB 영역만 추가 */}
      <NotebookHeader />

      {/* 사이드바 영역 - 제공해주신 스니펫대로 원복 */}
      <SideBar isSidebarOpen={true} position="left">
        <NotebookSidebar />
      </SideBar>

      {/* 메인 콘텐츠 및 토글 버튼 영역 - 제공해주신 스니펫대로 원복 */}
      <div >
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
