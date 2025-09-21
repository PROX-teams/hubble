import Button from "@/shared/ui/button/button/Button";
import { ButtonHTMLAttributes } from "react";
import { ButtonBase } from "@/shared/types/components.types";
import * as S from "./UpdateProfileImgButton.css";

interface UpdateProfileImgButtonProps
  extends ButtonBase,
    ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * 프로필 이미지 변경 버튼입니다.
 */

export default function UpdateProfileImgButton({
  size = "md",
  variants = "neutral",
  ...props
}: UpdateProfileImgButtonProps) {
  return (
    <Button size={size} variants={variants} className={S.button} {...props}>
      프로필 이미지 변경
    </Button>
  );
}
