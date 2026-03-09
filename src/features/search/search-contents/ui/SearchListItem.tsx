import React from "react";
import StoryBookIcon from "@/shared/assets/icons/gnb-nav/storybook.svg"
import * as S from "./SearchListItem.css";

interface SearchListItemProps {
  title: string;
  author?: string;
  meta?: string | number[];
  isMetaHighlighted?: boolean;
  onClick?: () => void;
}

export function SearchListItem({
  title,
  author = "익명",
  meta,
  isMetaHighlighted = false,
  onClick,
}: SearchListItemProps) {
  return (
    <div className={S.listItem} onClick={onClick}>
      <div className={S.itemContent}>
        <span className={S.itemIcon}>
          <StoryBookIcon/>
        </span>
        <span className={S.itemTitle}>{title}</span>
      </div>
        <div className={S.itemMeta}>
          <span>{author}</span>
          <span className={isMetaHighlighted ? S.count : ""}>{meta}</span>
        </div>
    </div>
  );
}
