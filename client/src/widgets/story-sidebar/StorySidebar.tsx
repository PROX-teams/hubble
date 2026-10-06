"use client";

import React from "react";
import Link from "next/link";
import { SideBar } from "@/shared/ui/sidebar/SideBar";
import { Accordion } from "@/shared/ui/accordion/Accordion";
import { AccordionContext } from "@/shared/model/contexts/AccordionContextProvider";
import CountIcon from "@/shared/assets/icons/story/count.svg";
import FolderIcon from "@/shared/assets/icons/story/folder.svg";
import SortListIcon from "@/shared/assets/icons/story/sort.svg";
import AddFolderIcon from "@/shared/assets/icons/story/add-folder.svg";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import type { Story } from "@/entities/story/story.types";
import type { Note } from "@/entities/note/note.types";
import * as S from "./StorySidebar.css";

// 아코디언 트리 아이템 헤더 (화살표 아이콘뿐 아니라 글씨/행 전체 클릭 시 토글 지원)
const StoryTreeItemHeader = ({ title }: { title: string }) => {
  const { toggle } = React.useContext(AccordionContext);

  return (
    <Accordion.Header className={S.treeItem} onClick={toggle}>
      <Accordion.Trigger
        rotatable={true}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AccordionArrow width={12} height={12} />
      </Accordion.Trigger>
      <span className={S.treeItemLabel}>{title}</span>
    </Accordion.Header>
  );
};

interface StorySidebarProps {
  stories?: Story[];
  notes?: Note[];
  onAddStory?: () => void;
  title?: string;
}

/**
 * StorySidebar 컴포넌트
 *
 * 사진 속 UI와 동일하게 상단 My Story 뱃지, 툴바, 아코디언 트리 가이드라인 및 구분선을 포함합니다.
 */
export const StorySidebar = ({
  stories = [],
  notes = [],
  onAddStory,
  title = "My Story",
}: StorySidebarProps) => {
  const recentStories = stories.slice(0, 2);
  const otherStories = stories.slice(2);

  return (
    <SideBar isSidebarOpen={true} position="left">
      <div className={S.container}>
        {/* 상단 헤더: My Story 뱃지 + 메타 카운트 */}
        <div className={S.header}>
          <span className={S.myStoryBadge}>{title}</span>
          <div className={S.metaBadgeGroup}>
            <span className={S.metaItem} title="스토리 개수">
              <FolderIcon width={14} height={14} />
              <span>{stories.length}</span>
            </span>
            <span className={S.metaItem} title="노트 개수">
              <CountIcon width={13} height={13} />
              <span>{notes.length}</span>
            </span>
          </div>
        </div>

        {/* 2번째 툴바: 초록색 새 폴더 아이콘 + 정렬 아이콘 */}
        <div className={S.subToolbar}>
          {onAddStory && (
            <button
              type="button"
              className={S.addFolderButton}
              aria-label="새 폴더 추가"
              onClick={onAddStory}
            >
              <AddFolderIcon width={16} height={16} />
            </button>
          )}
          <button type="button" className={S.sortButton} aria-label="목록 정렬">
            <SortListIcon width={16} height={16} />
          </button>
        </div>

        {/* 트리 목록 컨텐츠 */}
        <div className={S.content}>
          {/* 최근 업데이트 섹션 */}
          {recentStories.length > 0 && (
            <div>
              <div className={S.sectionTitle}>최근 업데이트</div>
              <div className={S.treeList}>
                {recentStories.map((story, index) => {
                  const storyNotes = notes.filter((n) =>
                    story.articleIds?.includes(n.id)
                  );

                  return (
                    <Accordion key={story.id} defaultOpen={index === 0}>
                      <StoryTreeItemHeader title={story.title} />

                      <Accordion.Content>
                        <div className={S.subNoteList}>
                          {storyNotes.length > 0 ? (
                            storyNotes.map((note) => (
                              <Link
                                key={note.id}
                                href={`/notebook/${note.id}`}
                                className={S.subNoteItem}
                              >
                                <span className={S.subNoteTitle}>{note.title}</span>
                              </Link>
                            ))
                          ) : (
                            <div className={S.emptySubNote}>노트가 없습니다.</div>
                          )}
                        </div>
                      </Accordion.Content>
                    </Accordion>
                  );
                })}
              </div>
            </div>
          )}

          {/* 가로 구분선 */}
          <div className={S.divider} />

          {/* 일반 카테고리/스토리 섹션 */}
          <div className={S.treeList}>
            {otherStories.map((story) => {
              const storyNotes = notes.filter((n) =>
                story.articleIds?.includes(n.id)
              );

              return (
                <Accordion key={story.id} defaultOpen={false}>
                  <StoryTreeItemHeader title={story.title} />

                  <Accordion.Content>
                    <div className={S.subNoteList}>
                      {storyNotes.length > 0 ? (
                        storyNotes.map((note) => (
                          <Link
                            key={note.id}
                            href={`/notebook/${note.id}`}
                            className={S.subNoteItem}
                          >
                            <span className={S.subNoteTitle}>{note.title}</span>
                          </Link>
                        ))
                      ) : (
                        <div className={S.emptySubNote}>노트가 없습니다.</div>
                      )}
                    </div>
                  </Accordion.Content>
                </Accordion>
              );
            })}
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default StorySidebar;
