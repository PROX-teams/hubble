import React, { useState } from 'react';
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import { Accordion } from "@/shared/ui/accordion/Accordion";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import { Note } from "@/entities/note/note.types";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import * as S from "./MyNoteList.css";

// 임시 Mock 데이터
interface StoryWithNotes {
  id: number;
  title: string;
  notes: Note[];
}

const MOCK_STORIES_WITH_NOTES: StoryWithNotes[] = [
  {
    id: 1,
    title: "알고리즘 공부",
    notes: [
      { id: 101, title: "BFS 탐색 기법", description: "너비 우선 탐색에 대하여...", author: "JJJ-un", date: "2024-03-07", likeCount: 5, imageUrl: "" },
      { id: 103, title: "DP 기초", description: "다이나믹 프로그래밍의 원리", author: "JJJ-un", date: "2024-03-05", likeCount: 8, imageUrl: "" },
    ],
  },
  {
    id: 2,
    title: "React Deep Dive",
    notes: [
      { id: 102, title: "useEffect 완벽 가이드", description: "의존성 배열의 모든 것", author: "JJJ-un", date: "2024-03-06", likeCount: 12, imageUrl: "" },
    ],
  },
];

const MyNoteList = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

  const filteredStories = selectedStoryId 
    ? MOCK_STORIES_WITH_NOTES.filter(s => s.id === selectedStoryId)
    : MOCK_STORIES_WITH_NOTES;

  return (
    <div className={S.container}>
      {/* 상단 드롭다운: 스토리 선택 */}
      <div className={S.dropdownWrapper}>
        <Dropdown>
          <Dropdown.Trigger size="2xl" variant="muted">
            <Dropdown.Value>
              {({ selectedOption }) => selectedOption || "스토리 선택"}
            </Dropdown.Value>
            <Dropdown.Icon />
          </Dropdown.Trigger>
          <Dropdown.Menu size="xl">
            <Dropdown.Option optionId={0} onClick={() => setSelectedStoryId(null)} >
              전체 스토리
            </Dropdown.Option>
            {MOCK_STORIES_WITH_NOTES.map((story) => (
              <Dropdown.Option 
                key={story.id} 
                optionId={story.id}
                onClick={() => setSelectedStoryId(story.id)}
              >
                {story.title}
              </Dropdown.Option>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 하단 아코디언 리스트 */}
      <div className={S.accordionListWrapper}>
        {filteredStories.map((story) => (
          <Accordion key={story.id}>
            <Accordion.Header>
              <span className={S.storyTitle}>최신</span>
              <Accordion.Trigger rotatable={true}>
                <AccordionArrow width={16} height={16} />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div className={S.noteListWrapper}>
                {story.notes.map((note) => (
                  <NoteCard 
                    key={note.id} 
                    data={note} 
                    variant="compact"
                  />
                ))}
              </div>
            </Accordion.Content>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default MyNoteList;
