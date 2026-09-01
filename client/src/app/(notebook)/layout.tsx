'use client';

import React from 'react';
import { NotebookSidebar } from '@/widgets/notebook-sidebar/NotebookSidebar';

export default function NotebookLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NotebookSidebar />
      <main>
        {children}
      </main>
    </div>
  );
}
