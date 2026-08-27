import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import NextIcon from "@/shared/assets/icons/common/next.svg";
import RoutingIcon from "@/shared/assets/icons/main/routing.svg";
import * as S from "./HistoryCard.css";

export interface HistoryCardData {
  id: number;
  title: string;
  storyTitle: string;
  date: string;
}

export interface HistoryCardProps extends ComponentPropsWithoutRef<"a"> {
  data: HistoryCardData;
}

/**
 * 최근 업데이트된 노트 이력을 표시하는 행 형태의 카드 컴포넌트
 */
const HistoryCard = ({ data, className, ...props }: HistoryCardProps) => {
  return (
    <Link
      href={`/notebook/${data.id}`}
      className={clsx(S.container, className)}
      {...props}
    >
      <div className={S.leftContent}>
        <span className={S.iconWrapper}>
          <RoutingIcon width={16} height={16} />
        </span>
        <div className={S.textContent}>
          <strong className={S.title}>{data.title}</strong>
          <span className={S.meta}>
            {data.storyTitle} | {data.date}
          </span>
        </div>
      </div>

      <span className={S.arrowIcon}>
        <NextIcon width={16} height={16} />
      </span>
    </Link>
  );
};

HistoryCard.displayName = "HistoryCard";

export default HistoryCard;
