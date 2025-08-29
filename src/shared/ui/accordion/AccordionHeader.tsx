import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import * as S from "@/shared/ui/accordion/Accordion.css";
/**
 * 아코디언 헤더 컴포넌트
 * 섹션의 제목 영역을 감싸는 역할을 하며,
 * 내부에 `Accordion.Trigger`를 배치하는 것이 일반적입니다.
 *
 * @param {"inline" | "spread"} justify - 헤더 아이템의 정렬 방식
 * - "inline": 좌측 정렬 (flex-start)
 * - "spread": 양 끝으로 분배 (space-between)
 * @default "inline"
 */

export interface AccordionHeaderProps extends ComponentPropsWithoutRef<"div"> {
  justify?: "inline" | "spread";
}

export const AccordionHeader = ({
  className,
  children,
  justify = "inline",
  ...props
}: AccordionHeaderProps) => {
  return (
    <div
      className={clsx(S.header({ justify }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

AccordionHeader.displayName = "AccordionHeader";