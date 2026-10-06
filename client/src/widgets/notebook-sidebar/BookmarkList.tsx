'use client';

import React, { useState, useMemo } from 'react';
import { useBookmarkList } from '@/entities/note/model/useBookmarkList';
import { useMyStories } from '@/entities/story/model/useMyStories';
import { Dropdown } from "@/shared/ui/dropdown/Dropdown";
import NoteCard from "@/entities/note/ui/note-card/NoteCard";
import { NoteCardSkeleton } from "@/entities/note/ui/note-card/NoteCardSkeleton";
import * as S from "./MyNoteList.css";

const BookmarkList = () => {
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const { bookmarkList, isLoading: isBookmarksLoading, isLoggedIn } = useBookmarkList();
  const { stories, isLoading: isStoriesLoading } = useMyStories();

  const isLoading = isBookmarksLoading || isStoriesLoading;

  // 1. 화면에 노출할 드롭다운 라벨을 상단(JSX 바깥)에서 직관적으로 계산
  const currentTitle = useMemo(() => {
    if (selectedStoryId === null || selectedStoryId === undefined) {
      return '전체 북마크';
    }
    if (selectedStoryId === -1) {
      return '미분류';
    }
    return stories.find((s) => s.id === selectedStoryId)?.title ?? '스토리북 선택';
  }, [selectedStoryId, stories]);

  // 2. 미분류 북마크 존재 여부 사전 계산
  const hasUncategorizedNotes = useMemo(
    () => bookmarkList.some((n) => !n.storyId),
    [bookmarkList]
  );

  // 3. 선택된 스토리 ID에 따른 북마크 필터링
  const filteredBookmarks = useMemo(() => {
    if (!bookmarkList.length) return [];
    if (selectedStoryId === null) return bookmarkList;
    if (selectedStoryId === -1) return bookmarkList.filter((n) => !n.storyId);
    return bookmarkList.filter((n) => n.storyId === selectedStoryId);
  }, [bookmarkList, selectedStoryId]);

  if (isLoading) {
    return (
      <div className={S.container}>
        <div className={S.noteListWrapper}>
          {Array.from({ length: 4 }).map((_, index) => (
            <NoteCardSkeleton key={index} variant="compact" />
          ))}
        </div>
      </div>
    );
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
      {/* 상단 드롭다운: 스토리북 선택 (기본값: 전체 북마크) */}
      <div className={S.dropdownWrapper}>
        <Dropdown className={S.fullWidthWrapper}>
          <Dropdown.Trigger variant="muted" className={S.fullWidthTrigger}>
            <Dropdown.Value>
              {() => currentTitle}
            </Dropdown.Value>
            <Dropdown.Icon />
          </Dropdown.Trigger>

          <Dropdown.Menu className={S.fullWidthMenu}>
            <Dropdown.Option optionId={null} onClick={() => setSelectedStoryId(null)}>
              전체 북마크
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
            {hasUncategorizedNotes && (
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

      {/* 하단 선택된 스토리북/전체북마크의 노트 목록 (플랫 리스트) */}
      <div className={S.noteListWrapper}>
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((note) => (
            <NoteCard
              key={note.id}
              data={note}
              variant="compact"
            />
          ))
        ) : (
          <div className={S.emptyText}>
            북마크한 노트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkList;
