'use client';

import { useParams } from 'next/navigation';
import { useNoteDetail } from '@/features/note/view-note/model/useNoteDetail';
import { NoteViewer } from '@/features/note/view-note/ui/NoteViewer';
import { NoteMeta } from '@/widgets/notebook-meta/NoteMeta';
import * as s from './page.css';

export default function NotebookDetailPage() {
  const params = useParams();
  const noteId = Number(params.id);
  const { note, isLoading, isError } = useNoteDetail(noteId);

  if (isLoading) {
    return <div className={s.loadingContainer}>노트를 불러오는 중입니다...</div>;
  }

  if (isError || !note) {
    return <div className={s.loadingContainer}>노트를 찾을 수 없습니다.</div>;
  }

  return (
      <div className={s.container}>
        <NoteMeta note={note} />
        <NoteViewer content={note.description ?? ''} />
      </div>
    );
  }

