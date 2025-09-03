import React, { ComponentPropsWithoutRef } from "react";
import * as S from "./StoryCard.css";
import type { StoryEntity } from "@/shared/types/story.types";
import CountIcon from "@/shared/assets/icons/story/count.svg"
import { mockStoryIconMap } from "./storyIcon.mock";

export interface StoryCardProps extends ComponentPropsWithoutRef<"div"> {
    data: StoryEntity;
}

const StoryCard = ({ data, onClick}: StoryCardProps) => {
  return (
    <div className={S.storyCard} onClick={onClick}>
      <div className={S.header}>
        {/* 타이틀 영역 */}
        <div className={S.titleContainer}>
          {data.icon && <span className={S.icon}>{ mockStoryIconMap[data.icon]}</span>}
          <span className={S.title}>{data.title}</span>
        </div>

        {/* 카운트/메타 영역 */}
        <div className={S.countContainer}>
          <span className={S.countIcon}><CountIcon/></span>
          {typeof data.articles?.length === "number" && <span>{data.articles.length}</span>}
        </div>
      </div>

      {/* 본문 */}
      {data.description && <div className={S.description}>{data.description}</div>}
    </div>
  );
};


StoryCard.displayName = "StoryCard";

export default StoryCard;