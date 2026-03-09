"use client";

import { forwardRef, ComponentPropsWithoutRef, KeyboardEvent, ReactNode,ChangeEvent} from "react";
import clsx from "clsx";
import * as S from "./KeywordInput.css";
import AddIcon from "@/shared/assets/icons/common/add.svg"

interface KeywordInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
    icon?: ReactNode
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onSearch?: (value?: string) => void;
}

const KeywordInput = forwardRef<HTMLInputElement, KeywordInputProps>(
  (
    {
      value,
      onChange,
      onSearch,
      icon = <AddIcon/>,
      className,
      ...props
    },
    ref
  ) => {
    
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch?.(e.currentTarget.value);
      }
    };
    return (
      <div role="search" className={clsx(S.keywordInputWrapper, className)}>
        {icon && <span className={S.iconBox}>{icon}</span>}
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className={clsx(S.baseField, className)}
          {...props}
        />
      </div>
    );
  }
);

KeywordInput.displayName = "KeywordInput";
export default KeywordInput;