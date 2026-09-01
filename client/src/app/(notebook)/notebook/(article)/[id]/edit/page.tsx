'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { useNoteDetail } from '@/features/note/view-note/model/useNoteDetail';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import * as s from '../../new/page.css';

const Editor = dynamic(() => import('@/features/note/write-note/ui/Editor'), {
  ssr: false,
  loading: () => <p>에디터를 불러오는 중...</p>,
});

export default function NotebookEditPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = Number(params.id);
  const { note, isLoading, isError } = useNoteDetail(noteId);
  const { initNote, reset } = useNoteEditorStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (note) {
      // 본인 글이 아닐 경우 일반 조회 화면으로 이동
      if (note.author && user?.nickname && note.author !== user.nickname) {
        alert('본인이 작성한 글만 수정할 수 있습니다.');
        router.replace(`/notebook/${noteId}`);
        return;
      }
      initNote(note);
    }
    return () => {
      reset();
    };
  }, [note, user, noteId, router, initNote, reset]);

  if (isLoading) {
    return <div className={s.container}>노트를 불러오는 중입니다...</div>;
  }

  if (isError || !note) {
    return <div className={s.container}>노트를 찾을 수 없습니다.</div>;
  }

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
