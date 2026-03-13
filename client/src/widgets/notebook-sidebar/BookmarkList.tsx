'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBookmarkedNotes } from '@/entities/note/api/note.api';
import { Accordion } from "@/shared/ui/accordion/Accordion";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import * as S from "./MyNoteList.css";

const BookmarkList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['bookmarkedNotes'],
    queryFn: () => getBookmarkedNotes(0, 50), // 일단 상위 50개만 가져옴
  });

  if (isLoading) {
    return <div className={S.container}>불러오는 중...</div>;
  }

  const notes = data?.content || [];

  return (
    <div className={S.container}>
      {/* 하단 아코디언 리스트 */}
      <div className={S.accordionListWrapper}>
        <Accordion defaultOpen={true}>
          <Accordion.Header>
            <Accordion.Trigger rotatable={true}>
              <AccordionArrow width={16} height={16} />
            </Accordion.Trigger>
            <span className={S.storyTitle}>모든 북마크</span>
            <span className={S.noteCount}>{notes.length}</span>
          </Accordion.Header>
          <Accordion.Content>
            <div className={S.noteListWrapper}>
              {notes.length > 0 ? (
                notes.map((note) => (
                  <NoteCard 
                    key={note.id} 
                    data={note} 
                    variant="compact" 
                  />
                ))
              ) : (
                <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
                  북마크한 노트가 없습니다.
                </div>
              )}
            </div>
          </Accordion.Content>
        </Accordion>
      </div>
    </div>
  );
};

export default BookmarkList;
