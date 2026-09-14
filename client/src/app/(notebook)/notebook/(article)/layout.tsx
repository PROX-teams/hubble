'use client';

import React, { useEffect } from 'react';
import { ArticleHeader } from '@/widgets/article-header/ArticleHeader';
import { NotebookMetaSidebar } from '@/widgets/notebook-meta-sidebar/NotebookMetaSidebar';
import { SidebarButton } from '@/features/sidebar/SidebarButton';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';

export default function ArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reset = useNoteEditorStore((state) => state.reset);

  // 글쓰기/수정 영역을 벗어날 때 에디터 전역 스토어 자동 청소
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <>
      <ArticleHeader />
      {children}
      <NotebookMetaSidebar />
      <SidebarButton />
    </>
  );
}
