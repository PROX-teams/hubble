"use client";

import React from "react";
import HistoryCard from "@/entities/note/ui/history-card/HistoryCard";
import { useInfiniteRecentUpdates } from "@/entities/note/model/useInfiniteRecentUpdates";
import { InfiniteScrollTrigger } from "@/features/infinite-scroll/ui/InfiniteScrollTrigger";
import clsx from "clsx";
import * as S from "./UpdateHistory.css";

interface UpdateHistoryProps {
  userId?: number;
  className?: string;
}

/**
 * 최근 노트 업데이트 이력 섹션 위젯 (무한 스크롤 지원)
 */
export const UpdateHistory = ({ userId, className }: UpdateHistoryProps = {}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteRecentUpdates(10, userId);

  const items = data?.pages.flatMap((page) => page.content) || [];

  return (
    <section className={clsx(S.container, className)}>
      <h2 className={S.title}>Update</h2>

      <div className={S.listContainer}>
        {isLoading && <p className={S.emptyText}>히스토리를 불러오는 중입니다...</p>}

        {!isLoading && items.length > 0 && (
          <>
            {items.map((item) => (
              <HistoryCard
                key={item.id}
                data={{
                  id: item.id,
                  title: item.title,
                  storyTitle: item.storyTitle ?? "스토리 미지정",
                  date: item.date,
                }}
              />
            ))}
            <InfiniteScrollTrigger
              hasNextPage={Boolean(hasNextPage)}
              fetchNextPage={fetchNextPage}
              isFetching={isFetchingNextPage}
            />
          </>
        )}

        {!isLoading && items.length === 0 && (
          <p className={S.emptyText}>최근 업데이트된 노트가 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default UpdateHistory;
