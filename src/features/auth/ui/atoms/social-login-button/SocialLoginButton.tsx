import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { ButtonBase } from "@/shared/types/components.types";
import Button from "@/shared/ui/atoms/button/Button";
import { buttonStyle } from "./SocialLoginButton.css";

interface SocialLoginButtonProps
  extends ButtonBase,
    PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  /** 인증 서비스 제공업체를 지정 */
  provider: "Google" | "Kakao" | "Naver";
  /** 버튼 왼쪽에 표시될 아이콘 컴포넌트 */
  icon: React.ReactNode;
}

/**
 * 소셜 로그인을 위한 트리거 버튼 컴포넌트입니다.
 * provider, 아이콘, 텍스트를 받아 지정된 스타일의 버튼을 렌더링합니다.
 */

export default function SocialLoginButton({
  provider,
  size = "lg",
  variants = "neutral",
  children,
  icon,
  ...props
}: SocialLoginButtonProps) {
  const isGoogle = provider === "Google";

  return (
    <Button
      size={size}
      variants={variants}
      className={isGoogle ? buttonStyle.lg : buttonStyle.sm}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </Button>
  );
}
