'use client';

import React from 'react';
import { Accordion } from "@/shared/ui/accordion/Accordion";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import * as S from "./MyNoteList.css";
import { useBookmarkList } from '@/entities/note/model/useBookmarkList';

const BookmarkList = () => {
  const { bookmarkList, isLoading, isLoggedIn } = useBookmarkList()

    if (isLoading) {
      return <div className={S.container}>불러오는 중...</div>;
    }
  
    if (!isLoggedIn) {
      return (
        <div className={S.container}>
          <div style={{ padding: '40px 20px', color: '#888', textAlign: 'center' }}>
            로그인이 필요한 서비스입니다.
          </div>
        </div>
      );
    }

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
            <span className={S.noteCount}>{bookmarkList.length}</span>
          </Accordion.Header>
          <Accordion.Content>
            <div className={S.noteListWrapper}>
              {bookmarkList.length > 0 ? (
                bookmarkList.map((note) => (
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
