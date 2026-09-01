import React from "react";
import HistoryCard, { type HistoryCardData } from "@/entities/note/ui/history-card/HistoryCard";
import * as S from "./UpdateHistory.css";

export interface UpdateHistoryProps {
  items?: HistoryCardData[];
}

/**
 * 최근 노트 업데이트 이력 섹션 위젯
 */
export const UpdateHistory = ({ items = [] }: UpdateHistoryProps) => {
  return (
    <section className={S.container}>
      <h2 className={S.title}>Update History</h2>

      <div className={S.listContainer}>
        {items.length > 0 ? (
          items.map((item) => (
            <HistoryCard key={item.id} data={item} />
          ))
        ) : (
          <p className={S.emptyText}>최근 업데이트된 노트가 없습니다.</p>
        )}
      </div>
    </section>
  );
};

export default UpdateHistory;
