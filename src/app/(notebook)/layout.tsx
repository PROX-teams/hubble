'use client';

import React from 'react';
import { SideBar } from "@/shared/ui/sidebar/SideBar";
import { useSidebarStore } from "@/shared/model/stores/useSidebarStore";
import { NotebookSidebar } from "@/widgets/notebook-sidebar/NotebookSidebar";

export default function NotebookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  return (
    <div style={{ }}>
      {/* 사이드바 영역 */}
      <SideBar isSidebarOpen={isSidebarOpen} position="left">
        <NotebookSidebar />
      </SideBar>

      {/* 메인 콘텐츠 및 토글 버튼 영역 */}
      <div >
        <header>
          <button 
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? '사이드바 닫기' : '사이드바 열기'}
          </button>
        </header>
        <main>
          {children}
        </main>
      </div>
      <SideBar isSidebarOpen={isSidebarOpen} position="right">
        <div style={{ padding: '20px', color: 'white' }}>
          <h3>노트북</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #333' }}>전체 노트</li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #333' }}>최근 수정</li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid #333' }}>중요 노트</li>
          </ul>
        </div>
      </SideBar>
    </div>
  );
}
