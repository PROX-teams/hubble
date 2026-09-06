'use client';

import { useEffect, useRef } from 'react';
import * as S from './InfiniteScrollTrigger.css';

interface InfiniteScrollTriggerProps {
  /** 다음 페이지를 불러올 수 있는지 여부 */
  hasNextPage: boolean;
  /** 다음 페이지를 불러오는 함수 */
  fetchNextPage: () => void;
  /** 현재 데이터를 불러오는 중인지 여부 */
  isFetching: boolean;
  /** 로딩 중 보여줄 UI (Optional) */
  loadingComponent?: React.ReactNode;
  /** 마지막 페이지일 때 보여줄 UI (Optional) */
  endComponent?: React.ReactNode;
}

export const InfiniteScrollTrigger = ({
  hasNextPage,
  fetchNextPage,
  isFetching,
  loadingComponent,
  endComponent,
}: InfiniteScrollTriggerProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 관찰 대상을 정합니다. (리스트 아래의 div)
    const observer = new IntersectionObserver(
      (entries) => {
        // 2. 요소가 화면에 보이고, 더 불러올 데이터가 있다면 fetchNextPage 실행
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetching]);

  return (
    <div
      ref={observerRef}
      className={hasNextPage ? S.trigger : S.hiddenTrigger}
    >
      {isFetching && (loadingComponent || null)}
      {!hasNextPage && (endComponent || null)}
    </div>
  );
};
