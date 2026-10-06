'use client';

import React, { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { useNoteDetail } from '@/features/note/view-note/model/useNoteDetail';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { EditorSkeleton } from '@/features/note/write-note/ui/EditorSkeleton';
import * as s from '../../new/page.css';

const Editor = dynamic(() => import('@/features/note/write-note/ui/Editor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});


export default function NotebookEditPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = Number(params.id);
  const { note, isLoading, isError } = useNoteDetail(noteId);
  const initNote = useNoteEditorStore((state) => state.initNote);
  const { user } = useAuthStore();

  // 1. 단 1회만 에디터 스토어를 초기화하기 위한 ref 가드 (백그라운드 리페치 덮어쓰기 방지)
  const initializedNoteIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (note && initializedNoteIdRef.current !== note.id) {
      const state = useNoteEditorStore.getState();
      if (!(state.noteId === note.id && state.activeDraftId)) initNote(note);
      initializedNoteIdRef.current = note.id;
    }
  }, [note, initNote]);

  // 2. 작성 중 브라우저 탭 닫기/새로고침 시 데이터 유실 방지 (beforeunload 가드)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // 최신 브라우저 표준: 빈 문자열 설정으로 기본 확인 대화상자 트리거
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 3. 로딩 및 에러 처리
  if (isLoading) {
    return (
      <div className={s.container}>
        <EditorSkeleton />
      </div>
    );
  }


  if (isError || !note) {
    return <div className={s.container}>노트를 찾을 수 없습니다.</div>;
  }

  // 4. 권한 검사 (FOUC 방지: 에디터를 렌더링하기 전에 권한을 체크하여 깜빡임 및 alert 제거)
  const isAuthor = !note.author || !user?.nickname || note.author === user.nickname;

  if (!isAuthor) {
    return (
      <div className={s.container} style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          수정 권한이 없습니다
        </h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
          본인이 작성한 글만 수정할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={() => router.replace(`/notebook/${noteId}`)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          해당 노트로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className={s.container}>
        <main className={s.editorWrapper}>
          <Editor
            initialContent={useNoteEditorStore.getState().content}
            initialTitle={useNoteEditorStore.getState().title}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
