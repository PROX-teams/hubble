"use client";

import { forwardRef, ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import * as S from "./Input.css";

interface InputFieldProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  label?: ReactNode;
  size?: "sm" | "md" | "lg";
  isError?: boolean;
  errorMessage?: string; 
}

export const Input = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      type = "text",
      placeholder = "내용을 입력해 주세요.",
      size = "md",
      errorMessage,
      isError = false,
      className,
      ...props
    },
    ref
    
  ) => {

    return (
      <div className={S.wrapper}>
        {label && <label className={S.label}>{label}</label>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={clsx(S.inputRecipe({size}), className)}
          {...props}
        />
        {isError && <p className={S.errorMessage}>{errorMessage}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";