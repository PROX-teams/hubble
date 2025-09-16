"use client";

import { ComponentPropsWithoutRef,useContext } from "react";
import type { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { DropdownContext } from "@/shared/model/contexts/DropdownContextProvider";
import * as S from "./Dropdown.css";

/**
 * DropdownTrigger 컴포넌트 Props
 *
 * @param {"none" | "solid" | "ghost"} [variant]  
 * 트리거 버튼의 스타일 변형을 지정합니다.  
 * - `none`: 기본 스타일 없음  
 * - `solid`: 배경/테두리가 있는 기본형  
 * - `ghost`: 배경 없는 투명형
 *
 * @param {"sm" | "md" | "lg" | "xl" | "2xl" | "2xl-tall" | "3xl" | "4xl"} [size]  
 * 트리거 버튼의 너비와 높이를 지정합니다.  
 * (Dropdown.css에 정의된 size variant를 따릅니다.)
 */

type TriggerVariants = NonNullable<RecipeVariants<typeof S.trigger>>;
type Variant = NonNullable<TriggerVariants["variant"]>;
type Size = NonNullable<TriggerVariants["size"]>;

interface DropdownTriggerProps extends ComponentPropsWithoutRef<"button">{
  variant ?: Variant;
  size?: Size;
}

function DropdownTrigger({
  variant,
  size,
  className,
  children,
  ...props
}: DropdownTriggerProps) {
  const { toggleBoxOpen } = useContext(DropdownContext);

  const handleClick = () => {
    toggleBoxOpen();
  };

  return (
    <button
      className={clsx(
        S.trigger({ variant,size}),
        className
      )}
      onClick={handleClick}
      type="button" 
      {...props}
    >
      {children}
    </button>
  );
}

export { DropdownTrigger };