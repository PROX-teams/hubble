'use client';

import { Suspense, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotes } from '@/entities/note/api/note.api';
import { getStories } from '@/entities/story/api/story.api';
import { InfiniteScrollTrigger } from '@/features/infinite-scroll/ui/InfiniteScrollTrigger';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import StoryCard from '@/entities/story/ui/story-card/StoryCard';
import { StoryCardModal } from '@/widgets/storycard-modal/StoryCardModal';
import { AppToggleGroup } from '@/shared/ui/toggle/app-toggle-group/AppToggleGroup';
import { ThreadFilterBar } from '@/widgets/thread-filter-bar/ThreadFilterBar';
import { useThreadFilters } from '@/features/thread/model/useThreadFilters';
import { ThreadPageSkeleton } from './ThreadPageSkeleton';
import * as S from './page.css';

/**
 * 쓰레드 페이지 본문 (URL 쿼리 파라미터 기반 상태 동기화)
 */
function ThreadPageContent() {
  const {
    activeTab,
    category,
    tagName,
    sortType,
    storyId,
    setTab,
    setCategory,
    setTagName,
    setSortType,
    setStoryId,
  } = useThreadFilters();

  // 한글 탭 레이블 변환 (AppToggleGroup 호환)
  const tabLabel = activeTab === 'story' ? '스토리' : '노트';

  // 1. 노트 무한 스크롤 쿼리 (URL 상태 직결)
  const noteQuery = useInfiniteQuery({
    queryKey: ['thread-notes', category, tagName, sortType],
    queryFn: ({ pageParam = 0 }) =>
      getNotes({ category, tagName, sortType, page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: activeTab === 'note',
  });

  // 2. 스토리 무한 스크롤 쿼리 (URL 상태 직결)
  const storyQuery = useInfiniteQuery({
    queryKey: ['thread-stories', category, sortType],
    queryFn: ({ pageParam = 0 }) =>
      getStories({ category, sortType, page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    enabled: activeTab === 'story',
  });

  // 현재 활성화된 탭의 쿼리 데이터와 페이징 함수
  const currentQuery = activeTab === 'note' ? noteQuery : storyQuery;
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = currentQuery;

  // URL의 storyId에 해당하는 스토리 객체 캐시 탐색 (존재 시 0ms 즉시 렌더링용)
  const cachedSelectedStory = useMemo(() => {
    if (!storyId || !storyQuery.data) return undefined;
    for (const page of storyQuery.data.pages) {
      const found = page.content.find((s) => s.id === storyId);
      if (found) return found;
    }
    return undefined;
  }, [storyId, storyQuery.data]);

  return (
    <div className={S.container}>
      {/* 상단 페이지 타이틀 영역 */}
      <div className={S.headerSection}>
        <h1 className={S.pageTitle}>Threads</h1>
        <p className={S.pageSubtitle}>지금 주목받는 콘텐츠를 만나보세요.</p>
      </div>

      {/* 상단 탭 메뉴 (AppToggleGroup 적용) */}
      <AppToggleGroup
        type="page"
        value={tabLabel}
        onValueChange={(value) => {
          if (value === '스토리') setTab('story');
          else if (value === '노트') setTab('note');
        }}
        className={S.tabMenu}
      >
        <AppToggleGroup.Item value="노트" />
        <AppToggleGroup.Item value="스토리" />
      </AppToggleGroup>

      {/* 필터 바 */}
      <ThreadFilterBar
        category={category}
        onCategoryChange={setCategory}
        selectedTag={tagName}
        onTagChange={setTagName}
        sortType={sortType}
        onSortChange={setSortType}
      />

      {/* 리스트 영역 */}
      <div className={S.listSection}>
        {activeTab === 'note'
          ? noteQuery.data?.pages.map((page) =>
              page.content.map((note, index) => (
                <NoteCard
                  key={note.id}
                  data={note}
                  imageUrl={note.imageUrl}
                  variant="large"
                  priority={index < 8}
                />
              ))
            )
          : storyQuery.data?.pages.map((page) =>
              page.content.map((story) => (
                <StoryCard
                  key={story.id}
                  data={story}
                  onClick={() => setStoryId(story.id)}
                />
              ))
            )}
      </div>

      {/* 무한 스크롤 트리거 */}
      <InfiniteScrollTrigger
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetchingNextPage}
      />

      {/* 스토리 상세 모달 (URL storyId 기반 동기화) */}
      {storyId && (
        <StoryCardModal
          storyId={storyId}
          story={cachedSelectedStory}
          onClose={() => setStoryId(null)}
        />
      )}
    </div>
  );
}

/**
 * Next.js 15 Suspense 경계로 감싸진 쓰레드 페이지
 */
export default function ThreadPage() {
  return (
    <Suspense fallback={<ThreadPageSkeleton />}>
      <ThreadPageContent />
    </Suspense>
  );
}
