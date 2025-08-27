"use client";

import { forwardRef, ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import * as s from "../input/Input.css";

interface TextareaFieldProps
  extends Omit<ComponentPropsWithoutRef<"textarea">, "size"> {
  label?: ReactNode;
  size?: "sm" | "md" | "lg";
  isError?: boolean;
  errorMessage?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      placeholder = "내용을 입력해 주세요",
      size = "md",
      isError = false,
      errorMessage,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={s.wrapper}>
        {label && <label className={s.label}>{label}</label>}
        <textarea
          ref={ref}
          placeholder={placeholder}
          className={clsx(s.textareaRecipe({ size }), className)}
          rows={1}
          {...props}
        />

        {isError && <p className={s.errorMessage}>{errorMessage}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";