'use client';

import React from 'react';
import { ArticleHeader } from '@/widgets/article-header/ArticleHeader';
import { NotebookMetaSidebar } from '@/widgets/notebook-meta-sidebar/NotebookMetaSidebar';
import { SidebarButton } from '@/features/sidebar/SidebarButton';

export default function ArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ArticleHeader />
      {children}
      <NotebookMetaSidebar />
      <SidebarButton />
    </>
  );
}
