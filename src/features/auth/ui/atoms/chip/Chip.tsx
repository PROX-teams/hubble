import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { chipStyle } from "./Chip.css";

interface ChipProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  /* 버튼이 선택된 상태인지 */
  isSelected?: boolean;
}

/** 관심 분야를 선택하는 데 사용되는 칩 버튼입니다. */

export default function Chip({
  isSelected = false,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      className={isSelected ? chipStyle.isSelected : chipStyle.default}
      {...props}
    >
      {children}
    </button>
  );
}
