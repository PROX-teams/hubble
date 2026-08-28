'use client';

import React from 'react';
import { NotebookHeader } from '@/widgets/notebook-header/NotebookHeader';
import { NotebookMetaSidebar } from '@/widgets/notebook-meta-sidebar/NotebookMetaSidebar';
import { SidebarButton } from '@/features/sidebar/SidebarButton';

export default function ArticleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NotebookHeader />
      {children}
      <NotebookMetaSidebar />
      <SidebarButton />
    </>
  );
}
