import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import * as S from "@/shared/ui/accordion/Accordion.css";
/**
 * 아코디언 헤더 컴포넌트
 * 섹션의 제목 영역을 감싸는 역할을 하며,
 * 내부에 `Accordion.Trigger`를 배치하는 것이 일반적입니다.
 *
 * @param {"compact" | "spread"} variant - 헤더 아이템의 정렬 방식
 * - "compact": 좌측 정렬 (flex-start)
 * - "spread": 양 끝으로 분배 (space-between)
 * @default "compact"
 */

export interface AccordionHeaderProps extends ComponentPropsWithoutRef<"div"> {
  variant?: "compact" | "spread";
}

export const AccordionHeader = ({
  className,
  children,
  variant = "compact",
  ...props
}: AccordionHeaderProps) => {
  return (
    <div
      className={clsx(S.header({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

AccordionHeader.displayName = "AccordionHeader";