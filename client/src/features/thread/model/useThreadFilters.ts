'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CategoryType, SortType } from '@/shared/types';

export type ThreadTab = 'note' | 'story';

const VALID_CATEGORIES: CategoryType[] = [
  'DEVELOPMENT',
  'DESIGN',
  'PLANNING',
  'MARKETING',
  'LIFE',
  'OTHER',
];

const VALID_SORTS: SortType[] = ['latest', 'mostLiked', 'mostViewed'];

/**
 * 쓰레드 페이지의 URL 쿼리 파라미터(tab, category, tag, sort, storyId)를 파싱하고
 * 변경 사항을 브라우저 URL에 실시간 반영(Deep Linking)하는 전용 커스텀 훅
 */
export function useThreadFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. URL 쿼리 스트링 파싱
  const activeTab: ThreadTab = useMemo(() => {
    const tabParam = searchParams.get('tab');
    return tabParam === 'story' ? 'story' : 'note';
  }, [searchParams]);

  const category: CategoryType | undefined = useMemo(() => {
    const catParam = searchParams.get('category') as CategoryType;
    return VALID_CATEGORIES.includes(catParam) ? catParam : undefined;
  }, [searchParams]);

  const tagName: string = useMemo(() => {
    return searchParams.get('tag')?.trim() || '';
  }, [searchParams]);

  const sortType: SortType = useMemo(() => {
    const sortParam = searchParams.get('sort') as SortType;
    return VALID_SORTS.includes(sortParam) ? sortParam : 'latest';
  }, [searchParams]);

  const storyId: number | null = useMemo(() => {
    const idParam = searchParams.get('storyId');
    if (!idParam) return null;
    const num = Number(idParam);
    return Number.isInteger(num) && num > 0 ? num : null;
  }, [searchParams]);

  // 2. URL 파라미터 일괄 업데이트 유틸리티 (scroll: false로 스크롤 튐 방지)
  const updateQueryParams = useCallback(
    (updates: {
      tab?: ThreadTab;
      category?: CategoryType | undefined;
      tag?: string | undefined;
      sort?: SortType;
      storyId?: number | null;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      // Tab 업데이트 (기본값 'note'이면 깔끔한 URL을 위해 제거)
      if (updates.tab !== undefined) {
        if (updates.tab === 'story') {
          params.set('tab', 'story');
        } else {
          params.delete('tab');
        }
      }

      // Category 업데이트
      if ('category' in updates) {
        if (updates.category && VALID_CATEGORIES.includes(updates.category)) {
          params.set('category', updates.category);
        } else {
          params.delete('category');
        }
      }

      // Tag 업데이트
      if ('tag' in updates) {
        if (updates.tag && updates.tag.trim()) {
          params.set('tag', updates.tag.trim());
        } else {
          params.delete('tag');
        }
      }

      // Sort 업데이트 (기본값 'latest'이면 파라미터 제거)
      if (updates.sort !== undefined) {
        if (updates.sort && updates.sort !== 'latest' && VALID_SORTS.includes(updates.sort)) {
          params.set('sort', updates.sort);
        } else {
          params.delete('sort');
        }
      }

      // StoryId 업데이트 (모달 열림 상태)
      if ('storyId' in updates) {
        if (updates.storyId) {
          params.set('storyId', String(updates.storyId));
        } else {
          params.delete('storyId');
        }
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // 브라우저 주소창만 변경하고 불필요한 페이지 스크롤 리셋 방지
      router.replace(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // 개별 변경 헬퍼 메서드
  const setTab = useCallback(
    (tab: ThreadTab) => {
      updateQueryParams({ tab });
    },
    [updateQueryParams]
  );

  const setCategory = useCallback(
    (cat: CategoryType | undefined) => {
      updateQueryParams({ category: cat });
    },
    [updateQueryParams]
  );

  const setTagName = useCallback(
    (tag: string) => {
      updateQueryParams({ tag });
    },
    [updateQueryParams]
  );

  const setSortType = useCallback(
    (sort: SortType) => {
      updateQueryParams({ sort });
    },
    [updateQueryParams]
  );

  const setStoryId = useCallback(
    (id: number | null) => {
      updateQueryParams({ storyId: id });
    },
    [updateQueryParams]
  );

  const resetFilters = useCallback(() => {
    updateQueryParams({
      category: undefined,
      tag: undefined,
      sort: 'latest',
    });
  }, [updateQueryParams]);

  return {
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
    resetFilters,
  };
}
