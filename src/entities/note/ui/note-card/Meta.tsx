import { NoteMeta } from "@/entities/note/note.types";
import * as S from "./NoteCard.css";
import HeartIcon from "@/shared/assets/icons/common/heart.svg";

export default function Meta({ author, date, likeCount }: NoteMeta) {
  return (
    <div className={S.metaContainer}>
      <span>{author}</span>
      <span>{date}</span>
      <div className={S.metaIconWrapper}>
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    </div>
  );
}
