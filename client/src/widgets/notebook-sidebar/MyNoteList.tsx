'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyNotes } from '@/entities/note/api/note.api';
import { getMyStories } from '@/entities/story/api/story.api';
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import { Accordion } from "@/shared/ui/accordion/Accordion";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import * as S from "./MyNoteList.css";

const MyNoteList = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  // 내 스토리 목록 조회
  const { data: storiesData, isLoading: isStoriesLoading } = useQuery({
    queryKey: ['myStories'],
    queryFn: () => getMyStories(0, 100),
  });

  // 내 노트 목록 조회
  const { data: notesData, isLoading: isNotesLoading } = useQuery({
    queryKey: ['myNotes'],
    queryFn: () => getMyNotes(0, 100),
  });

  // 스토리별로 노트 그룹화
  const groupedNotes = useMemo(() => {
    const stories = storiesData?.content || [];
    const notes = notesData?.content || [];
    
    const groups: Record<number, typeof notes> = {};
    const unclassifiedNotes: typeof notes = [];

    notes.forEach(note => {
      if (note.storyId) {
        if (!groups[note.storyId]) {
          groups[note.storyId] = [];
        }
        groups[note.storyId].push(note);
      } else {
        unclassifiedNotes.push(note);
      }
    });

    // 스토리 데이터와 노트를 결합
    const results = stories.map(story => ({
      id: story.id,
      title: story.title,
      notes: groups[story.id] || [],
    })).filter(group => group.notes.length > 0 || !selectedStoryId);

    // 미분류 노트가 있다면 추가
    if (unclassifiedNotes.length > 0) {
      results.push({
        id: -1, // 임시 ID
        title: "미분류",
        notes: unclassifiedNotes,
      });
    }

    return results;
  }, [storiesData, notesData, selectedStoryId]);

  const filteredGroups = selectedStoryId 
    ? groupedNotes.filter(g => g.id === selectedStoryId)
    : groupedNotes;

  if (isStoriesLoading || isNotesLoading) {
    return <div className={S.container}>불러오는 중...</div>;
  }

  const stories = storiesData?.content || [];
  const notes = notesData?.content || [];

  return (
    <div className={S.container}>
      {/* 상단 드롭다운: 스토리 선택 */}
      <div className={S.dropdownWrapper}>
        <Dropdown>
          <Dropdown.Trigger size="2xl" variant="muted">
            <Dropdown.Value>
              {({ selectedOption }) => {
                if (selectedOption === null || selectedOption === undefined) return "스토리 선택";
                if (selectedStoryId === null) return "전체 스토리";
                const story = stories.find(s => s.id === selectedStoryId);
                return story ? story.title : (selectedStoryId === -1 ? "미분류" : "스토리 선택");
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
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
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
