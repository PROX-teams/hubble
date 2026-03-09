import React, { useState } from 'react';
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import { Accordion } from "@/shared/ui/accordion/Accordion";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import { Note } from "@/entities/note/note.types";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import * as S from "./MyNoteList.css";

// 임시 Mock 데이터
interface BookmarkCategory {
  id: number;
  title: string;
  notes: Note[];
}

const MOCK_BOOKMARKS: BookmarkCategory[] = [
  {
    id: 1,
    title: "기술 아티클",
    notes: [
      { id: 301, title: "FSD 아키텍처 가이드", description: "프론트엔드 레이어 설계하기", author: "FSD-Teams", date: "2024-03-01", likeCount: 45, imageUrl: "" },
    ],
  },
  {
    id: 2,
    title: "디자인 영감",
    notes: [
      { id: 302, title: "애플 웹사이트 분석", description: "스크롤 애니메이션 기법", author: "Design-Labs", date: "2024-02-28", likeCount: 82, imageUrl: "" },
    ],
  },
];

const BookmarkList = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const filteredBookmarks = selectedCategoryId
    ? MOCK_BOOKMARKS.filter(c => c.id === selectedCategoryId)
    : MOCK_BOOKMARKS;

  return (
    <div className={S.container}>
      {/* 상단 드롭다운: 카테고리 선택 */}
      <div className={S.dropdownWrapper}>
        <Dropdown>
          <Dropdown.Trigger size="2xl" variant="muted">
            <Dropdown.Value>
              {({ selectedOption }) => selectedOption || "카테고리 선택"}
            </Dropdown.Value>
            <Dropdown.Icon />
          </Dropdown.Trigger>
          <Dropdown.Menu size="xl">
            <Dropdown.Option optionId={0} onClick={() => setSelectedCategoryId(null)}>
              전체 카테고리
            </Dropdown.Option>
            {MOCK_BOOKMARKS.map((category) => (
              <Dropdown.Option 
                key={category.id} 
                optionId={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                {category.title}
              </Dropdown.Option>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 하단 아코디언 리스트 */}
      <div className={S.accordionListWrapper}>
        {filteredBookmarks.map((category) => (
          <Accordion key={category.id}>
            <Accordion.Header>
              <Accordion.Trigger rotatable={true}>
                <AccordionArrow width={16} height={16} />
              </Accordion.Trigger>
              <span className={S.storyTitle}>{category.title}</span>
              <span className={S.noteCount}>{category.notes.length}</span>
            </Accordion.Header>
            <Accordion.Content>
              <div className={S.noteListWrapper}>
                {category.notes.map((note) => (
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

export default BookmarkList;
