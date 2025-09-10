import React, { ComponentPropsWithoutRef } from "react";
import * as S from "./StoryCard.css";
import type { StoryEntity } from "@/shared/types/story.types";
import CountIcon from "@/shared/assets/icons/story/count.svg"
import { mockStoryIconMap } from "./storyIcon.mock";

export interface StoryCardProps extends ComponentPropsWithoutRef<"div"> {
    data: StoryEntity;
}

const StoryCard = ({data, onClick}: StoryCardProps) => {
  return (
      <div className={S.storyCard} onClick={onClick}>
        <div className={S.header}>
          <div className={S.titleContainer}>
            {data.icon && <span className={S.titleIcon}>{ mockStoryIconMap[data.icon]}</span>}
            <span className={S.title}>{data.title}</span>
          </div>
          <div className={S.countContainer}>
            <span className={S.countIcon}><CountIcon/></span>
            {typeof data.articleIds?.length === "number" && <span className={S.count}>{data.articleIds.length}</span>}
          </div>
        </div>
      {data.description && <div className={S.description}>{data.description}</div>}
      </div>
  );
};

StoryCard.displayName = "StoryCard";

export default StoryCard;
