import Button from "@/shared/ui/atoms/button/Button";
import * as S from "./SignupButton.css";
import { ButtonHTMLAttributes } from "react";
import { ButtonBase } from "@/shared/types/components.types";

interface SignupButtonProps
  extends ButtonBase,
    ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * 회원가입 플로우의 마지막 단계에서 사용되는 '가입 완료' 버튼입니다.
 */

export default function SignupButton({
  size = "lg",
  variants = "colored",
  disabled = false,
  ...props
}: SignupButtonProps) {
  return (
    <Button
      size={size}
      variants={variants}
      className={disabled ? S.signupButton.disabled : S.signupButton.default}
      disabled={disabled}
      {...props}
    >
      가입 완료
    </Button>
  );
}
