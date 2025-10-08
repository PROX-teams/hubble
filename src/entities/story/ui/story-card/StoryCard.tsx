import React, { ComponentPropsWithoutRef } from "react";
import * as S from "./StoryCard.css";
import type { Story } from "@/entities/story/story.types";
import CountIcon from "@/shared/assets/icons/story/count.svg"
import { storyIconMap } from "../../lib/icons/storyIconMap";

export interface StoryCardProps extends ComponentPropsWithoutRef<"div"> {
  data: Story;
  /**
   * 컴포넌트의 밀도(density) 설정 옵션입니다.
   *
   * - `"compact"` : 간격과 타이포그래피가 축소되어, 가로로 길고 밀집된 형태입니다.
   * - `"comfortable"` : 기본 간격과 타이포그래피로, 세로로 여유로운 형태입니다.
   *
   * 기본값은 `"comfortable"`입니다.
   */
  density?: "compact" | "comfortable";
}

const StoryCard = ({ data, density = "comfortable", ...props }: StoryCardProps) => {
  return (
    <div className={S.storyCard({ density })} {...props}>
      <div className={S.header}>
        <div className={S.titleContainer({ density })}>
          {data.icon && (
            <span className={S.titleIcon}>{storyIconMap[data.icon]}</span>
          )}
          <span className={S.title}>{data.title}</span>
        </div>
        <div className={S.countContainer({ density })}>
          <span className={S.countIcon}>
            <CountIcon />
          </span>
          {typeof data.articleIds?.length === "number" && (
            <span className={S.count}>{data.articleIds.length}</span>
          )}
        </div>
      </div>
      {data.description && (
        <div className={S.description({ density })}>{data.description}</div>
      )}
    </div>
  );
};

StoryCard.displayName = "StoryCard";

export default StoryCard;
