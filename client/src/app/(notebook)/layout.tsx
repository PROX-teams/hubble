'use client';

import React from 'react';
import { NotebookSidebar } from "@/widgets/notebook-sidebar/NotebookSidebar";
import { NotebookMetaSidebar } from '@/widgets/notebook-meta-sidebar/NotebookMetaSidebar';
import { NotebookHeader } from "@/widgets/notebook-header/NotebookHeader";
import { SidebarButton } from '@/features/sidebar/SidebarButton';

export default function NotebookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NotebookHeader />
      <NotebookSidebar />
      <main>
        {children}
      </main>
      <NotebookMetaSidebar/>
      <SidebarButton/>
    </div>
  );
}
