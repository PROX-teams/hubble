'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from "@/shared/ui/breadcrumb/Breadcrumb";
import { getNoteDetail } from '@/entities/note/api/note.api';
import { getStoryDetail } from '@/entities/story/api/story.api';

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
    // 1. 노트 상세 페이지일 경우: [스토리 제목] / [노트 제목]
    if (noteId) {
      const storyTitle = story?.title || (note?.storyId ? 'Loading...' : '기본 노트북');
      const noteTitle = note?.title || 'Loading...';
      return [storyTitle, noteTitle];
    }
    
    // 2. 노트 작성 페이지일 경우: [기본 노트북] / [새 노트 작성]
    if (isWritePage) {
      return ['기본 노트북', '새 노트 작성'];
    }

    // 3. 기타 기본값
    return ['Home', 'Notebook'];
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <header
      style={{
        position: 'fixed',
        top: "48px",
        left: "312px",
        width: 'calc(100% - 312px)',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.25rem',
        zIndex: 5,
        backgroundColor: 'transparent',
      }}
    >
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
    </header>
  );
};
