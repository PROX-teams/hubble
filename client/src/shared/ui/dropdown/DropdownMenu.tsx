"use client";

import { HTMLAttributes, useContext } from "react";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { DropdownContext } from "@/shared/model/contexts/DropdownContextProvider";
import * as S from "./Dropdown.css";

/**
 * DropdownMenu 컴포넌트
 *
 * @param {("left" | "center" | "right")} [placement]  
 * 드롭다운 메뉴가 열릴 위치를 지정합니다.
 *
 * @param {boolean} [independent]  
 * 메뉴를 Context와 무관하게 독립적으로 열지 여부를 설정합니다.
 *
 * @param {Size} [size]  
 * Dropdown.css에 정의된 size variant를 지정합니다.
 */

type MenuVariant = RecipeVariants<typeof S.dropdownmenu>;
type Placement = NonNullable<MenuVariant>['placement'];
type Size = NonNullable<MenuVariant>['size'];

interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  placement?: Placement;
  independent?: boolean;
  size?: Size
}

function DropdownMenu({
  children,
  className,
  independent,
  placement = "left",
  size,
  ...props
}: DropdownMenuProps) {

  const { isBoxOpen } = useContext(DropdownContext);
  const isOpen = independent ?? isBoxOpen;

  return isOpen ? (
    <div className={clsx(S.dropdownmenu({ placement,size }), className)} {...props}>
      {children}
    </div>
  ) : null;
}

export { DropdownMenu };
