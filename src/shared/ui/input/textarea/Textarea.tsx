"use client";

import { forwardRef, ComponentPropsWithoutRef, ReactNode } from "react";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import * as S from "../input/Input.css";

/**
 * 
 * @param {"solid"} [variant] - input의 스타일 변형. 
 *   - "solid": 배경색 `vars.color.gray_100`과 보더 `0.063rem solid ${vars.color.stroke_200}`를 적용.
 *   - "muted": 배경색 `vars.color.gray_200`과 보더 `0.063rem solid ${vars.color.stroke_300}`를 적용.
 *   - 생략 시 base 스타일이 적용.
 * 
 * @param label - input 필드에 대한 설명 레이블을 지정.
 * 
 * @param {"sm" | "md" | "lg"} [size="md"] - 인풋 박스의 크기(높이,너비).
 *   - sm: 높이 2.00rem, 너비 21.25rem
 *   - md: 높이 5.38rem, 너비 28.13rem
 *   - lg: 높이 5.38rem, 너비 40.50rem
 * 
 * @param isError - 에러 상태를 나타내는 불리언 값.
 * 
 * @param errorMessage - 에러 상태일 때 표시할 에러 메시지를 지정.
 */


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