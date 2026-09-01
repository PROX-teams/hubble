"use client";

import React from "react";
import Link from "next/link";
import { SideBar } from "@/shared/ui/sidebar/SideBar";
import { Accordion } from "@/shared/ui/accordion/Accordion";
import CountIcon from "@/shared/assets/icons/story/count.svg";
import AccordionArrow from "@/shared/assets/icons/common/accordionArrow.svg";
import type { Story } from "@/entities/story/story.types";
import type { Note } from "@/entities/note/note.types";
import * as S from "./StorySidebar.css";

// 폴더 추가 SVG 아이콘
const AddFolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 10V16M9 13H15M3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V8C21 6.89543 20.1046 6 19 6H12L10 4H5C3.89543 4 3 4.89543 3 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 목록/정렬 SVG 아이콘
const SortListIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 폴더 개수 SVG 아이콘
const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V8C21 6.89543 20.1046 6 19 6H12L10 4H5C3.89543 4 3 4.89543 3 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface StorySidebarProps {
  stories?: Story[];
  notes?: Note[];
}

/**
 * StorySidebar 컴포넌트
 *
 * 사진 속 UI와 동일하게 상단 My Story 뱃지, 툴바, 아코디언 트리 가이드라인 및 구분선을 포함합니다.
 */
export const StorySidebar = ({
  stories = [],
  notes = [],
}: StorySidebarProps) => {
  const recentStories = stories.slice(0, 2);
  const otherStories = stories.slice(2);

  return (
    <SideBar isSidebarOpen={true} position="left">
      <div className={S.container}>
        {/* 상단 헤더: My Story 뱃지 + 메타 카운트 */}
        <div className={S.header}>
          <span className={S.myStoryBadge}>My Story</span>
          <div className={S.metaBadgeGroup}>
            <span className={S.metaItem} title="스토리 개수">
              <FolderIcon width={13} height={13} />
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
          <button type="button" className={S.addFolderButton} aria-label="새 폴더 추가">
            <AddFolderIcon width={18} height={18} />
          </button>
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
                      <Accordion.Header className={S.treeItem}>
                        <Accordion.Trigger rotatable={true}>
                          <AccordionArrow width={12} height={12} />
                        </Accordion.Trigger>
                        <span className={S.treeItemLabel}>{story.title}</span>
                      </Accordion.Header>

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
                  <Accordion.Header className={S.treeItem}>
                    <Accordion.Trigger rotatable={true}>
                      <AccordionArrow width={12} height={12} />
                    </Accordion.Trigger>
                    <span className={S.treeItemLabel}>{story.title}</span>
                  </Accordion.Header>

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
