import React from 'react';
import { Accordion } from "@/shared/ui/accordion/Accordion";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import { Note } from "@/entities/note/note.types";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import * as S from "./MyNoteList.css";

// 임시 Mock 데이터
const MOCK_DRAFTS: Note[] = [
  { id: 201, title: "[초안] 넥스트 JS 14 정리", description: "서버 컴포넌트와 클라이언트 컴포넌트...", author: "JJJ-un", date: "2024-03-07", likeCount: 0, imageUrl: "" },
  { id: 202, title: "[초안] 테일윈드 vs 바닐라 익스트랙트", description: "스타일 라이브러리 비교 분석", author: "JJJ-un", date: "2024-03-05", likeCount: 0, imageUrl: "" },
];

const DraftNoteList = () => {
  return (
    <div className={S.container}>
      <div className={S.accordionListWrapper}>
        <Accordion>
          <Accordion.Header>
            <Accordion.Trigger rotatable={true}>
              <AccordionArrow width={16} height={16} />
            </Accordion.Trigger>
            <span className={S.storyTitle}>작성 중인 노트</span>
            <span className={S.noteCount}>{MOCK_DRAFTS.length}</span>
          </Accordion.Header>
          <Accordion.Content>
            <div className={S.noteListWrapper}>
              {MOCK_DRAFTS.map((note) => (
                <NoteCard 
                  key={note.id} 
                  data={note} 
                  variant="compact" 
                />
              ))}
            </div>
          </Accordion.Content>
        </Accordion>
      </div>
    </div>
  );
};

export default DraftNoteList;
