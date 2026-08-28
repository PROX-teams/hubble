'use client';

import React from 'react';
import { useMyNotes } from '@/entities/note/model/useMyNotes';
import { NotebookNoteGrid } from '@/widgets/notebook-note-grid/NotebookNoteGrid';
import type { Note } from '@/entities/note/note.types';
import articleMock from '@/shared/mock/article.json';
import * as s from './page.css';

// 시안 프리뷰 및 기본 데이터용 목업 노트 목록
const MOCK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
];

const DEFAULT_MOCK_NOTES: Note[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: '토스 PM 출신의 IA 및 화면설계서 실무 파일',
  author: 'PROX 팀블로그',
  date: '2025.06.29',
  likeCount: 32 + i * 3,
  viewCount: 120 + i * 15,
  description:
    '네이버 CTO 출신 프론트엔드의 Next.js를 구현하는 방법에 대해 작성하였습니다. 네이버 CTO 출신 프론트엔드의 Next.js를 구현하는',
  imageUrl: MOCK_THUMBNAILS[i % MOCK_THUMBNAILS.length] || articleMock.imageUrl,
  tag: ['Frontend', 'SEO', 'Code Review'],
  category: 'DEVELOPMENT',
}));

export default function NotebookPage() {
  const { notes: apiNotes } = useMyNotes();

  // 실제 API 데이터가 있으면 우선 사용하고, 없으면 시안 목업 데이터를 렌더링
  const notesToDisplay = apiNotes.length > 0 ? apiNotes : DEFAULT_MOCK_NOTES;

  return (
    <div className={s.container}>
      <NotebookNoteGrid
        title="FrontEnd 공부집"
        notes={notesToDisplay}
      />
    </div>
  );
}
