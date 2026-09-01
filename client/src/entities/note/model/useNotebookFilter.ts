'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { SortType } from '@/shared/types/api.types';

const VALID_SORT_TYPES: SortType[] = ['mostViewed', 'latest', 'mostLiked'];

/**
 * 노트북 아카이브 페이지의 URL 쿼리 파라미터(?userId=...&tag=...&sort=...) 동기화 전담 커스텀 훅 (SRP 준수)
 */
export const useNotebookFilter = (defaultSort: SortType = 'mostViewed') => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. URL 쿼리스트링에서 상태 추출
  const userIdParam = searchParams.get('userId');
  const targetUserId = userIdParam ? Number(userIdParam) : undefined;

  const tagFromUrl = searchParams.get('tag') || '';
  const sortParam = searchParams.get('sort') as SortType | null;
  const sortFromUrl = sortParam && VALID_SORT_TYPES.includes(sortParam) ? sortParam : defaultSort;

  // 2. URL 업데이트 헬퍼
  const updateQuery = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value === null || value === '' || (key === 'sort' && value === defaultSort)) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const queryString = current.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams, defaultSort]
  );

  // 3. 태그 변경 액션
  const setSelectedTag = useCallback(
    (tag: string) => {
      updateQuery({ tag: tag || null });
    },
    [updateQuery]
  );

  // 4. 정렬 변경 액션
  const setSortType = useCallback(
    (sort: SortType) => {
      updateQuery({ sort });
    },
    [updateQuery]
  );

  // 5. 필터 초기화 액션
  const resetFilters = useCallback(() => {
    updateQuery({ tag: null, sort: null });
  }, [updateQuery]);

  return {
    targetUserId,
    selectedTag: tagFromUrl,
    sortType: sortFromUrl,
    setSelectedTag,
    setSortType,
    resetFilters,
    isFiltered: Boolean(tagFromUrl || (sortFromUrl && sortFromUrl !== defaultSort)),
  };
};
