'use client';

import React from 'react';
import { SideBar } from "@/shared/ui/sidebar/SideBar";
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
      <SideBar isSidebarOpen={true} position="left">
        <NotebookSidebar />
      </SideBar>
      <main>
        {children}
      </main>
      <NotebookMetaSidebar/>
      <SidebarButton/>
    </div>
  );
}
