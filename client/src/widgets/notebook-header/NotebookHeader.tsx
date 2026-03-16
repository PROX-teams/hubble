'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from "@/shared/ui/breadcrumb/Breadcrumb";
import { getNoteDetail } from '@/entities/note/api/note.api';
import { getStoryDetail } from '@/entities/story/api/story.api';
import { formatDate } from '@/shared/lib/utils/date';
import * as s from './NotebookHeader.css';

export const NotebookHeader = () => {
  const params = useParams();
  const pathname = usePathname();
  const noteId = params.id ? Number(params.id) : null;

  // 1. 노트 상세 정보 조회
  const { data: note } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNoteDetail(noteId!),
    enabled: !!noteId,
  });

  // 2. 노트가 속한 스토리 정보 조회
  const { data: story } = useQuery({
    queryKey: ['story', note?.storyId],
    queryFn: () => getStoryDetail(note!.storyId!),
    enabled: !!note?.storyId,
  });

  // 경로 및 데이터에 따른 브레드크럼 아이템 구성
  const isWritePage = pathname === '/notebook';
  
  const getBreadcrumbItems = () => {
    if (noteId) {
      const storyTitle = story?.title || (note?.storyId ? 'Loading...' : '기본 노트북');
      const noteTitle = note?.title || 'Loading...';
      return [storyTitle, noteTitle];
    }
    if (isWritePage) {
      return ['기본 노트북', '새 노트 작성'];
    }
    return ['Home', 'Notebook'];
  };

  const breadcrumbItems = getBreadcrumbItems();
  const formattedDate = formatDate(note?.date);

  return (
    <header className={s.header}>
      <Breadcrumb>
        <Breadcrumb.List>
          {breadcrumbItems.map((item, index) => (
            <Breadcrumb.Item 
              key={index} 
              active={index === breadcrumbItems.length - 1}
            >
              {item}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb.List>
      </Breadcrumb>

      {/* 노트 상세 정보 표시 (노트 조회 중일 때만) */}
      {noteId && note && (
        <div className={s.metaInfo}>
          <div className={s.metaItem}>
            <span>{formattedDate}</span>
          </div>
          <div className={s.divider} />
          <div className={s.metaItem}>
            <span>좋아요 {note.likeCount || 0}</span>
          </div>
          <div className={s.divider} />
          <div className={s.metaItem}>
            <span>북마크 {note.bookmarkCount || 0}</span>
          </div>
        </div>
      )}
    </header>
  );
};
