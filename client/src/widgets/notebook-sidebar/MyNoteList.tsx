'use client';

import React, { useState } from 'react';
import { useGroupedNotes } from '@/features/note/story-note-list/model/useGroupedNotes';
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import { Accordion } from "@/shared/ui/accordion/Accordion";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import * as S from "./MyNoteList.css";

const MyNoteList = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  
  const { 
    isLoggedIn, 
    stories, 
    notes, 
    groupedNotes, 
    isLoading 
  } = useGroupedNotes(selectedStoryId);

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
      {/* 상단 드롭다운: 스토리 선택 */}
      <div className={S.dropdownWrapper}>
        <Dropdown>
          <Dropdown.Trigger size="2xl" variant="muted">
            <Dropdown.Value>
              {({ selectedOption }) => {
                if (selectedOption === null || selectedOption === undefined) return "전체 스토리";
                if (selectedStoryId === -1) return "미분류";
                return stories.find(s => s.id === selectedStoryId)?.title || "스토리 선택";
              }}
            </Dropdown.Value>
            <Dropdown.Icon />
          </Dropdown.Trigger>

          <Dropdown.Menu size="xl">
            <Dropdown.Option optionId={null} onClick={() => setSelectedStoryId(null)} >
              전체 스토리
            </Dropdown.Option>
            {stories.map((story) => (
              <Dropdown.Option 
                key={story.id} 
                optionId={story.id}
                onClick={() => setSelectedStoryId(story.id)}
              >
                {story.title}
              </Dropdown.Option>
            ))}
            {/* 미분류 노트가 있다면 메뉴에 추가 */}
            {notes.some(n => !n.storyId) && (
              <Dropdown.Option 
                optionId={-1}
                onClick={() => setSelectedStoryId(-1)}
              >
                미분류
              </Dropdown.Option>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 하단 아코디언 리스트 */}
      <div className={S.accordionListWrapper}>
        {groupedNotes.length > 0 ? (
          groupedNotes.map((group) => (
            <Accordion key={group.id} defaultOpen={true}>
              <Accordion.Header>
                <Accordion.Trigger rotatable={true}>
                  <AccordionArrow width={16} height={16} />
                </Accordion.Trigger>
                <span className={S.storyTitle}>{group.title}</span>
                <span className={S.noteCount}>{group.notes.length}</span>
              </Accordion.Header>
              <Accordion.Content>
                <div className={S.noteListWrapper}>
                  {group.notes.map((note) => (
                    <NoteCard 
                      key={note.id} 
                      data={note} 
                      variant="compact"
                      href={`/notebook/${note.id}/edit`}
                    />
                  ))}
                </div>
              </Accordion.Content>
            </Accordion>
          ))
        ) : (
          <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
            작성한 노트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNoteList;
