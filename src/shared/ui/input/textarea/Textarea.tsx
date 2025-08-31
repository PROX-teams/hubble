"use client";

import { forwardRef, ComponentPropsWithoutRef, ReactNode } from "react";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import * as S from "../input/Input.css";

type TextareaVariants = NonNullable<RecipeVariants<typeof S.textareaRecipe>>;
type Variant = NonNullable<TextareaVariants ["variant"]>;

interface TextareaFieldProps
  extends Omit<ComponentPropsWithoutRef<"textarea">, "size"> {
  variant?: Variant;
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
      variant,
      size = "md",
      isError = false,
      errorMessage,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={S.wrapper}>
        {label && <label className={S.label}>{label}</label>}
        <textarea
          ref={ref}
          placeholder={placeholder}
          className={clsx(S.textareaRecipe({ size, variant }), className)}
          rows={1}
          {...props}
        />

        {isError && <p className={S.errorMessage}>{errorMessage}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";