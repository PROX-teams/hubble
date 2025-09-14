import clsx from "clsx";
import { ElementType, PropsWithChildren } from "react";
import { buttonStyle } from "./Button.css";
import { ButtonBase } from "@/shared/types/components.types";

type BaseButtonProps = ButtonBase & PropsWithChildren;
type ButtonProps<C extends ElementType> = BaseButtonProps & {
  as?: C; // 리액트 컴포넌트 또는 HTML 태그 요소 타입

  // Omit을 사용하여 정의한 prop과 겹치는 HTML 기본 속성을 제거합니다.
} & Omit<React.ComponentPropsWithoutRef<C>, keyof BaseButtonProps | "as">;

/**
 * 버튼 베이스 컴포넌트
 *
 * @param {"xs"|"sm"|"md"|"lg"} size - 버튼 height 크기  [xs: 24, sm: 28, md: 32, lg: 44]
 * @param {"colored"|"neutral"|"danger"} variants - 버튼 스타일 종류
 * @param {React.ReactNode} children - 버튼 내부에 표시할 콘텐츠(텍스트, 아이콘 등)
 * @param {boolean} disabled - 버튼 비활성화 여부
 * @param {string} className - 추가로 적용할 CSS 클래스명
 * @param {ElementType} as - 렌더링할 HTML 태그 요소 (기본값: 'button')
 * @param {ButtonHTMLAttributes<HTMLButtonElement>} props - HTML 버튼 속성들
 */

export default function Button<C extends ElementType = "button">({
  size = "md",
  variants = "neutral",
  children,
  as,
  ...props
}: ButtonProps<C>) {
  const { className, ...restProps } = props;

  const Component = as || "button";

  return (
    <Component
      className={clsx(className, buttonStyle({ size, variants }))}
      {...restProps}
    >
      {children}
    </Component>
  );
}
