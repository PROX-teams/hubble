'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { EditorSkeleton } from '@/features/note/write-note/ui/EditorSkeleton';
import * as s from './page.css';

const Editor = dynamic(() => import('@/features/note/write-note/ui/Editor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});


export default function NewNotebookPage() {
  return (
    <AuthGuard>
      <div className={s.container}>
        <main className={s.editorWrapper}>
          <Editor />
        </main>
      </div>
    </AuthGuard>
  );
}
