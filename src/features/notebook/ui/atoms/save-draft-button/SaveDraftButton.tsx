import Button from "@/shared/ui/atoms/button/Button";
import { ButtonHTMLAttributes } from "react";
import { ButtonBase } from "@/shared/types/components.types";
import * as S from "./SaveDraftButton.css";

interface SaveDraftButtonProps
  extends ButtonBase,
    ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * 임시 저장 버튼입니다.
 */

export default function SaveDraftButton({
  size = "md",
  variants = "neutral",
  ...props
}: SaveDraftButtonProps) {
  return (
    <Button
      size={size}
      variants={variants}
      className={S.buttonStyle}
      {...props}
    >
      임시 저장
    </Button>
  );
}
