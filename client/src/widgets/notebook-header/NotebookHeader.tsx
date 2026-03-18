'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Breadcrumb } from "@/shared/ui/breadcrumb/Breadcrumb";
import { useNoteInteraction } from '@/features/note/toggle-interaction/model/useNoteInteraction';
import { formatDate } from '@/shared/lib/utils/date';
import { useNoteDetail } from '@/features/note/view-note/model/useNoteDetail';
import { useStoryDetail } from '@/entities/story/model/useStoryDetail';
import LikeIcon from '@/shared/assets/icons/common/heart.svg'
import BookmarkIcon from '@/shared/assets/icons/common/bookmark.svg'
import * as s from './NotebookHeader.css';
import { clsx } from 'clsx';

export const NotebookHeader = () => {
  const params = useParams();
  const pathname = usePathname();
  const noteId = params.id ? Number(params.id) : null;
  const { note } = useNoteDetail(noteId)
  const { story } = useStoryDetail(note?.storyId)
  const { toggleLike, toggleBookmark, isLikePending, isBookmarkPending } = useNoteInteraction(noteId || 0); 

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
      {noteId && note && (
        <div className={s.metaInfo}>
          <div className={s.metaItem}>
            <span>{formattedDate}</span>
          </div>
          <div className={s.metaItem}>
            <span>조회수 {note.viewCount || 0}</span>
          </div>
          <button 
            className={clsx(s.metaIcon, note.isLiked && s.activeLike)}
            onClick={() => toggleLike()}
            disabled={isLikePending}
          >
            <LikeIcon width='16' height='16'/>
            {note.likeCount || 0}
          </button>
          <button 
            className={clsx(s.metaIcon, note.isBookmarked && s.activeBookmark)}
            onClick={() => toggleBookmark()}
            disabled={isBookmarkPending}
          >
            <BookmarkIcon width='16' height='16'/>
            {note.bookmarkCount || 0}
          </button>
        </div>
      )}
    </header>
  );
};
