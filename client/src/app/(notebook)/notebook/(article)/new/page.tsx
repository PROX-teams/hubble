'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { AuthGuard } from '@/features/auth/AuthGuard';
import * as s from '../../page.css';

const Editor = dynamic(() => import('@/features/note/write-note/ui/Editor'), {
  ssr: false,
  loading: () => <p>에디터를 불러오는 중...</p>,
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
