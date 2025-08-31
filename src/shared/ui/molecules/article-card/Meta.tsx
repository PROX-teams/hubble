import { ArticleMeta } from "@/shared/types/post.types";
import * as S from "./ArticleCard.css";
import HeartIcon from "@/shared/assets/icons/common/heart.svg";

export default function Meta({ author, date, likeCount }: ArticleMeta) {
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
