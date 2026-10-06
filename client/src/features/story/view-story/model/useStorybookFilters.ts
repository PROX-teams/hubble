'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * 스토리북 페이지(/storybook, /storybook/[userId])의
 * URL 쿼리 파라미터(tag, storyId)를 파싱하고 동기화하는 커스텀 훅
 */
export function useStorybookFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. URL 쿼리 스트링 파싱
  const selectedTag: string | null = useMemo(() => {
    return searchParams.get('tag')?.trim() || null;
  }, [searchParams]);

  const storyId: number | null = useMemo(() => {
    const idParam = searchParams.get('storyId');
    if (!idParam) return null;
    const num = Number(idParam);
    return Number.isInteger(num) && num > 0 ? num : null;
  }, [searchParams]);

  // 2. URL 쿼리 파라미터 업데이트 (scroll: false로 스크롤 튐 방지)
  const updateQueryParams = useCallback(
    (updates: { tag?: string | null; storyId?: number | null }) => {
      const params = new URLSearchParams(searchParams.toString());

      if ('tag' in updates) {
        if (updates.tag && updates.tag.trim()) {
          params.set('tag', updates.tag.trim());
        } else {
          params.delete('tag');
        }
      }

      if ('storyId' in updates) {
        if (updates.storyId) {
          params.set('storyId', String(updates.storyId));
        } else {
          params.delete('storyId');
        }
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const setSelectedTag = useCallback(
    (tag: string | null) => {
      updateQueryParams({ tag });
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
    updateQueryParams({ tag: null });
  }, [updateQueryParams]);

  return {
    selectedTag,
    storyId,
    setSelectedTag,
    setStoryId,
    resetFilters,
  };
}
