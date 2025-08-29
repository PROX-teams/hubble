import React, { forwardRef, ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import * as S from "./Tag.css";
import TagRemoveIcon from "@/shared/assets/icons/common/remove-tag.svg";

export interface TagProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  icon?: ReactNode;
  count?: number;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Tag 컴포넌트
 *
 * 라벨(label), 아이콘(icon), 카운트(count) 표시가 가능하며,
 * 필요 시 제거 버튼(onRemove)도 지원합니다.
 *
 * @param {string} label - 태그에 표시할 텍스트
 * @param {ReactNode} [icon] - 좌측에 표시할 아이콘
 * @param {number} [count] - 우측에 표시할 카운트
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => void} [onRemove] - 제거 버튼 클릭 시 호출되는 핸들러
 */


const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ className, label, icon, count, onRemove, ...props }, ref) => {
    return (
      <div ref={ref}className={clsx(S.tagBox, className)} {...props}>
        {icon && <span className={S.tagIcon}>{icon}</span>}
        <span className={S.tagLabel}>{label}</span>
        {count && <span className={S.tagCount}>{count}</span>}
        {onRemove && (
          <button
            type="button"
            className={S.removeIcon}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove?.(e);
            }}
          >
            <TagRemoveIcon/>
          </button>
        )}
      </div>
    );
  }
);

Tag.displayName = "Tag";

export default Tag;