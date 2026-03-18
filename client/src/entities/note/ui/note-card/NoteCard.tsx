import clsx from "clsx";
import Link from "next/link";
import { formatDate } from "@/shared/lib/utils/date";
import { Note } from "@/entities/note/note.types";
import { stripHtml } from "@/shared/lib/utils/string";
import {
  container,
  contentContainer,
  hoverContainer,
  titleStyle,
  content,
} from "./NoteCard.css";
import CoverImage from "./CoverImage";
import Meta from "./Meta";

export type Variant = "large" | "small" | "wide" | "compact";
interface NoteCardProps {
  data: Omit<Note, "imageUrl">;
  imageUrl?: string;
  /**
   * large -   305 X 304 / Thread Page
   * small -   202 X 198 / Main Page
   * wide -    382 X 96 / Node Graph Page
   * compact - 236 X 55 / Sidebar Bookmark
   */
  variant?: Variant;
  priority?: boolean;
}

/**
 * 게시글의 커버 이미지, 제목, 내용 등 핵심 정보를 요약하여 보여주는 Note 카드 컴포넌트입니다. <br>
 * variant prop을 통해 메인 페이지, 사이드바, 쓰레드 등 다양한 컨텍스트에 맞는 네 가지(large, small, wide, compact) 형태로 사용할 수 있습니다.
 */

export default function NoteCard({
  data,
  imageUrl,
  variant = "small",
  priority = false,
}: NoteCardProps) {
  const withImg = !!imageUrl;
  const maxLength = variant === "large" ? 150 : 80;

  return (
    <Link
      href={`/notebook/${data.id}`}
      className={clsx(container({ variant }), hoverContainer)}
    >
      {/* 커버 이미지 */}
      <CoverImage imageUrl={imageUrl} variant={variant} priority={priority} />

      <div className={contentContainer({ variant, withImg })}>
        {/* 제목 */}
        <strong className={titleStyle({ variant, withImg })}>
          {data.title}
        </strong>

        {/* 메타 데이터 */}
        {variant === "large" && (
          <Meta
            author={data.author}
            date={formatDate(data.date)}
            likeCount={data.likeCount}
          />
        )}

        {/* 본문 */}
        <div className={content({ variant, withImg })}>
          {stripHtml(data.description, maxLength)}
        </div>
      </div>
    </Link>
  );
}
