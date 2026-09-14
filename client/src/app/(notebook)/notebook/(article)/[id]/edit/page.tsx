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
  const initNote = useNoteEditorStore((state) => state.initNote);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!note || !user) return;

    if (note.author && user.nickname && note.author !== user.nickname) {
      alert('본인이 작성한 글만 수정할 수 있습니다.');
      router.replace(`/notebook/${noteId}`);
    }
  }, [note, user, noteId, router]);

  useEffect(() => {
    if (note) {
      initNote(note);
    }
  }, [note, initNote]);

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
          <Editor 
            initialContent={note.description} 
            initialTitle={note.title} 
          />
        </main>
      </div>
    </AuthGuard>
  );
}
