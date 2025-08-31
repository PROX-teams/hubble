import Button from "@/shared/ui/atoms/button/Button";
import { ButtonHTMLAttributes } from "react";
import { ButtonBase } from "@/shared/types/components.types";
import * as S from "./ActionButton.css";

interface ActionButtonProps
  extends ButtonBase,
    ButtonHTMLAttributes<HTMLButtonElement> {
  wideWidth?: boolean;
}

export default function ActionButton({
  size = "md",
  variants = "colored",
  children,
  wideWidth = false,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      size={size}
      variants={variants}
      className={S.styles[wideWidth ? "wide" : "default"]}
      {...props}
    >
      {children}
    </Button>
  );
}
