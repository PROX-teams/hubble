"use client";

import { ButtonBase } from "@/shared/types/components.types";
import Button from "@/shared/ui/atoms/button/Button";
import { ButtonHTMLAttributes } from "react";
import EmailIcon from "@/shared/assets/icons/dashboard/email.svg";
import * as S from "./EmailCopyButton.css";

interface EmailCopyButtonProps
  extends ButtonBase,
    ButtonHTMLAttributes<HTMLButtonElement> {
  email?: string;
}

/**
 * 이메일 복사 버튼입니다.
 */

export default function EmailCopyButton({
  variants = "neutral",
  size = "xs",
  email,
  onClick,
  ...props
}: EmailCopyButtonProps) {
  const handleCopyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e); // 스토리북에서 주입된 이벤트 액션 실행

    if (email) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          alert(`${email}(이)가 클립보드에 복사되었습니다.`);
        })
        .catch((err) => alert(`이메일 복사에 실패했습니다: ${err}`));
    }
  };

  return (
    <Button
      variants={variants}
      size={size}
      className={S.buttonStyle}
      onClick={handleCopyEmail}
      {...props}
    >
      <EmailIcon className={S.iconStyle} />
      E-mail
    </Button>
  );
}
