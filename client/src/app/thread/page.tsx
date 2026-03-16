'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotes } from '@/entities/note/api/note.api';
import { getStories } from '@/entities/story/api/story.api';
import { InfiniteScrollTrigger } from '@/features/infinite-scroll/ui/InfiniteScrollTrigger';
import { CategoryType, SortType } from '@/shared/types/api.types';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import StoryCard from '@/entities/story/ui/story-card/StoryCard';
import { AppToggleGroup } from '@/shared/ui/toggle/app-toggle-group/AppToggleGroup';
import { ThreadFilterBar } from '@/widgets/thread-filter-bar/ThreadFilterBar';
import * as S from './page.css';

export default function ThreadPage() {
  // 탭 상태를 한글 문자열로 관리 (AppToggleGroup 설계에 맞춤)
  const [activeTab, setActiveTab] = useState<'노트' | '스토리'>('노트');
  const [category, setCategory] = useState<CategoryType>();
  const [tagName, setTagName] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('latest');

  // 노트 무한 스크롤 쿼리
  const noteQuery = useInfiniteQuery({
    queryKey: ['thread-notes', category, tagName, sortType],
    queryFn: ({ pageParam = 0 }) => 
      getNotes({ category, tagName, sortType, page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.number + 1,
    enabled: activeTab === '노트',
  });

  // 스토리 무한 스크롤 쿼리
  const storyQuery = useInfiniteQuery({
    queryKey: ['thread-stories', category, sortType],
    queryFn: ({ pageParam = 0 }) => 
      getStories({ category, sortType, page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.number + 1,
    enabled: activeTab === '스토리',
  });

  // 현재 활성화된 탭의 쿼리 데이터와 함수 선택
  const currentQuery = activeTab === '노트' ? noteQuery : storyQuery;
  const { fetchNextPage, hasNextPage, isFetchingNextPage } = currentQuery;

  return (
    <div className={S.container}>
      {/* 상단 탭 메뉴 (AppToggleGroup 적용) */}
      <AppToggleGroup 
        type="page"
        value={activeTab}
        onValueChange={(value) => value && setActiveTab(value as '노트' | '스토리')}
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
        {activeTab === '노트' 
          ? (noteQuery.data?.pages.map((page) => 
              page.content.map((note, index) => (
                <NoteCard 
                  key={note.id} 
                  data={note} 
                  imageUrl={note.imageUrl} 
                  variant="large"
                  priority={index < 8} // 상위 8개 이미지 우선 로딩
                />
              ))
            ))
          : (storyQuery.data?.pages.map((page) => 
              page.content.map((story) => (
                <StoryCard 
                  key={story.id} 
                  data={story} 
                />
              ))
            ))
        }
      </div>
      {/* 무한 스크롤 트리거 */}
      <InfiniteScrollTrigger 
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetchingNextPage}
      />
    </div>
  );
}
