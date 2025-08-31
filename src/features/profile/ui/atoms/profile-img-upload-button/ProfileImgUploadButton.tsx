import Button from "@/shared/ui/atoms/button/Button";
import { ButtonHTMLAttributes } from "react";
import { ButtonBase } from "@/shared/types/components.types";
import * as S from "./ProfileImgUploadButton.css";

interface ProfileImgUploadButtonProps
  extends ButtonBase,
    ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * 프로필 이미지 변경 버튼입니다.
 */

export default function ProfileImgUploadButton({
  size = "md",
  variants = "neutral",
  ...props
}: ProfileImgUploadButtonProps) {
  return (
    <Button
      size={size}
      variants={variants}
      className={S.buttonStyle}
      {...props}
    >
      프로필 이미지 변경
    </Button>
  );
}
