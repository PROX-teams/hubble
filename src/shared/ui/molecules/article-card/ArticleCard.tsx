import clsx from "clsx";
import Link from "next/link";
import { Article } from "@/shared/types/post.types";
import {
  container,
  contentContainer,
  hoverContainer,
  titleStyle,
  content,
} from "./ArticleCard.css";
import CoverImage from "./CoverImage";
import Meta from "./Meta";

export type Variant = "large" | "small" | "wide" | "compact";
interface ArticleCardProps {
  data: Omit<Article, "imageUrl">;
  imageUrl?: string;
  /**
   * large -   305 X 304 / Thread Page
   * small -   202 X 198 / Main Page
   * wide -    382 X 96 / Node Graph Page
   * compact - 236 X 55 / Sidebar Bookmark
   */
  variant?: Variant;
}

/**
 * 게시글의 커버 이미지, 제목, 내용 등 핵심 정보를 요약하여 보여주는 카드 컴포넌트입니다.
 * variant prop을 통해 메인 페이지, 사이드바, 쓰레드 등 다양한 컨텍스트에 맞는 네 가지(large, small, wide, compact) 형태로 사용할 수 있습니다.
 */

export default function ArticleCard({
  data,
  imageUrl,
  variant = "small",
}: ArticleCardProps) {
  const withImg = !!imageUrl;

  return (
    <Link href={`/notebook/${data.id}`}>
      <div className={clsx(container({ variant }), hoverContainer)}>
        {/* 커버 이미지 */}
        {imageUrl && <CoverImage imageUrl={imageUrl} variant={variant} />}

        <div className={contentContainer({ variant, withImg })}>
          {/* 제목 */}
          <strong className={titleStyle({ variant, withImg })}>
            {data.title}
          </strong>

          {/* 메타 데이터 */}
          {variant === "large" && (
            <Meta
              author={data.author}
              date={data.date}
              likeCount={data.likeCount}
            />
          )}

          {/* 본문 */}
          <div className={content({ variant, withImg })}>
            {data.description}
          </div>
        </div>
      </div>
    </Link>
  );
}
