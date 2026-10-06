'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { NoteMeta } from "@/entities/note/note.types";
import * as S from "./NoteCard.css";
import HeartIcon from "@/shared/assets/icons/common/heart.svg";

export default function Meta({ author, authorId, date, likeCount }: NoteMeta) {
  const router = useRouter();

  const handleAuthorClick = (e: React.MouseEvent) => {
    if (authorId) {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/storybook/${authorId}`);
    }
  };

  return (
    <div className={S.metaContainer}>
      <span
        onClick={handleAuthorClick}
        className={authorId ? S.authorLink : undefined}
      >
        {author}
      </span>
      <span>{date}</span>
      <div className={S.metaIconWrapper}>
        <HeartIcon width='16px' height='16px'/>
        <span>{likeCount}</span>
      </div>
    </div>
  );
}
