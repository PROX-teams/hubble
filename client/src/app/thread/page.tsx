'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getNotes } from '@/entities/note/api/note.api';
import { getStories } from '@/entities/story/api/story.api';
import { InfiniteScrollTrigger } from '@/features/infinite-scroll/ui/InfiniteScrollTrigger';
import { CategoryType, SortType } from '@/shared/types/api.types';
import NoteCard from '@/entities/note/ui/note-card/NoteCard';
import StoryCard from '@/entities/story/ui/story-card/StoryCard';
import type { Note } from '@/entities/note/note.types';
import type { Story } from '@/entities/story/story.types';
import { AppToggleGroup } from '@/shared/ui/toggle/app-toggle-group/AppToggleGroup';
import { ThreadFilterBar } from '@/widgets/thread-filter-bar/ThreadFilterBar';
import * as S from './page.css';

type ThreadItem = Note | Story;

export default function ThreadPage() {
  // 탭 상태를 한글 문자열로 관리 (AppToggleGroup 설계에 맞춤)
  const [activeTab, setActiveTab] = useState<'노트' | '스토리'>('노트');
  const [category, setCategory] = useState<CategoryType>();
  const [tagName, setTagName] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('latest');

  // 무한 스크롤 데이터 페칭
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['thread', activeTab, category, tagName, sortType],
    queryFn: ({ pageParam = 0 }) => 
      activeTab === '노트' 
        ? getNotes({ category, tagName, sortType, page: pageParam, size: 10 })
        : getStories({ category, sortType, page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.number + 1,
  });

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
        {data?.pages.map((page) => 
          page.content.map((item: ThreadItem) => (
            activeTab === '노트' 
              ? (
                <NoteCard 
                  key={item.id} 
                  data={item as Note} 
                  imageUrl={(item as Note).imageUrl} 
                  variant="large" 
                />
              )
              : <StoryCard key={item.id} data={item as Story} />
          ))
        )}
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
