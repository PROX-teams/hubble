'use client';

import dynamic from 'next/dynamic';

// Tiptap 에디터는 브라우저 API를 사용하므로 dynamic import를 사용하여 SSR을 비활성화합니다.
const Editor = dynamic(() => import('@/features/note/write-note/ui/Editor'), {
  ssr: false,
  loading: () => <p>에디터를 불러오는 중...</p>,
});

export default function NotebookPage() {
  return (
    <div style={{ maxWidth: '800px'}}>
      {/* 구현한 에디터 컴포넌트 */}
      <Editor />
    </div>
  );
}
