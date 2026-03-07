'use client';

import dynamic from 'next/dynamic';
import { NotebookEditorSidebar } from '@/widgets/notebook-editor-sidebar/NotebookEditorSidebar';
import { useSidebarStore } from '@/shared/model/stores/useSidebarStore';

// Tiptap 에디터는 브라우저 API를 사용하므로 dynamic import를 사용하여 SSR을 비활성화합니다.
const Editor = dynamic(() => import('@/features/note/write-note/ui/Editor'), {
  ssr: false,
  loading: () => <p>에디터를 불러오는 중...</p>,
});

export default function NotebookPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  return (
    <div style={{ position: 'relative' }}>
      {/* 
        [고정 버튼] 
        - position: fixed 로 화면에 박음
        - z-index: 999 로 사이드바(50)보다 무조건 위에 오게 함
      */}
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 999, 
          padding: '10px 20px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {isSidebarOpen ? '설정 닫기' : '설정 열기'}
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Editor />
      </div>
      
      <aside>
        <NotebookEditorSidebar/>
      </aside>
    </div>
  );
}
