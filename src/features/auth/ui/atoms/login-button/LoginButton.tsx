import Button from "@/shared/ui/atoms/button/Button";
import { ButtonHTMLAttributes } from "react";
import { ButtonBase } from "@/shared/types/components.types";

interface LoginButtonProps
  extends ButtonBase,
    ButtonHTMLAttributes<HTMLButtonElement> {}

export default function LoginButton({
  size = "sm",
  variants = "colored",
  ...props
}: LoginButtonProps) {
  return (
    <Button size={size} variants={variants} {...props}>
      로그인
    </Button>
  );
}
