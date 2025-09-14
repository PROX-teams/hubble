"use client";

import { ComponentPropsWithoutRef, useContext } from "react";
import clsx from "clsx";
import { AccordionContext } from "@/shared/model/accordion/contexts/AccordionContextProvider";
import * as S from "@/shared/ui/accordion/Accordion.css";

/**
 * AccordionTrigger 컴포넌트
 *
 * 아코디언 섹션을 열고 닫는 버튼입니다.  
 * 내부적으로 현재 열림 상태(`isOpen`)와 토글 함수(`toggle`)를 제어합니다.
 *
 * @param {boolean} [rotatable] - 토글 회전 가능 여부
 */
export interface TriggerProps extends ComponentPropsWithoutRef<"button"> {
  rotatable?: boolean;
}

export const AccordionTrigger = ({
  children,
  className,
  rotatable = false,
  ...props
}: TriggerProps) => {
  const { toggle, isOpen } = useContext(AccordionContext);

  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx(S.triggerButton, className)}
      {...props}
    >
      <span
        className={S.triggerIcon({
          rotatable,
          open: rotatable ? isOpen : false,
        })}
      >
        {children}
      </span>
    </button>
  );
};

AccordionTrigger.displayName = "AccordionTrigger";