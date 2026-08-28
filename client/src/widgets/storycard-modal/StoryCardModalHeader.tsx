"use client";

import React from "react";
import CountIcon from "@/shared/assets/icons/story/count.svg";
import RoutingIcon from "@/shared/assets/icons/main/routing.svg";
import { storyIconMap } from "@/entities/story/lib/icons/storyIconMap";
import * as S from "./StoryCardModal.css";

export interface StoryCardModalHeaderProps {
  title: string;
  icon?: string;
  noteCount?: number;
  latestDate?: string;
  actionSlot?: React.ReactNode;
}

/**
 * 스토리 모달 상단 헤더 컴포넌트
 * 제목, 아이콘, 개수, 최신 수정일 등 필요한 최소 데이터만 받아 렌더링합니다.
 */
export const StoryCardModalHeader = ({
  title,
  icon,
  noteCount = 0,
  latestDate,
  actionSlot,
}: StoryCardModalHeaderProps) => {
  return (
    <div className={S.header}>
      <div className={S.titleContainer}>
        {icon && storyIconMap[icon] && (
          <span className={S.titleIcon}>{storyIconMap[icon]}</span>
        )}
        <h2 className={S.title}>{title}</h2>
      </div>

      <div className={S.metaContainer}>
        <span className={S.metaItem}>
          <CountIcon width={16} height={16} />
          {noteCount}
        </span>
        {latestDate && (
          <span className={S.metaItem}>
            <RoutingIcon width={16} height={16} />
            {latestDate}
          </span>
        )}
        {actionSlot}
      </div>
    </div>
  );
};

export default StoryCardModalHeader;
