'use client' 

import { ComponentPropsWithoutRef} from "react";
import { useContext } from "react";
import clsx from "clsx";
import { DropdownContext } from "@/shared/model/contexts/DropdownContextProvider";
import * as S from "./Dropdown.css";

interface DropdownOptionProps extends ComponentPropsWithoutRef<'div'> {
  // 필수 사용
  optionId: number;
}

export default function DropdownOption({
  optionId,
  onClick,
  className,
  children,
  ...props
}: DropdownOptionProps) {
  const { selectedId, selectOption, toggleBoxOpen } = useContext(DropdownContext);

  const isSelected = optionId === selectedId;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    selectOption(optionId, children);
    toggleBoxOpen();
    onClick?.(e);
  };

  return (
    <div
      className={clsx(S.option, isSelected && S.optionSelected, className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

export { DropdownOption };