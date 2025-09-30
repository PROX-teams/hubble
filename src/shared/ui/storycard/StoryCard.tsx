import React, { ComponentPropsWithoutRef } from "react";
import * as S from "./StoryCard.css";
import type { StoryEntity } from "@/shared/types/story.types";
import CountIcon from "@/shared/assets/icons/story/count.svg"
import { mockStoryIconMap } from "./storyIcon.mock";

export interface StoryCardProps extends ComponentPropsWithoutRef<"div"> {
  data: StoryEntity;
  size?: "small" | "large";
}

const StoryCard = ({ data, size = "large",...props }: StoryCardProps) => {
  return (
    <div className={S.storyCard({size})} {...props}>
      <div className={S.header}>
        <div className={S.titleContainer({ size })}>
          {data.icon && (
            <span className={S.titleIcon}>{mockStoryIconMap[data.icon]}</span>
          )}
          <span className={S.title}>{data.title}</span>
        </div>
        <div className={S.countContainer({ size })}>
          <span className={S.countIcon}>
            <CountIcon />
          </span>
          {typeof data.articleIds?.length === "number" && (
            <span className={S.count}>{data.articleIds.length}</span>
          )}
        </div>
      </div>
      {data.description && (
        <div className={S.description({ size })}>{data.description}</div>
      )}
    </div>
  );
};

StoryCard.displayName = "StoryCard";

export default StoryCard;
