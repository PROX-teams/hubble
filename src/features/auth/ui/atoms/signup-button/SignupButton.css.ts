import { tx } from "@/shared/styles/textStyle.css";
import { vars } from "@/shared/styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style(
  {
    width: 452,
  },
  tx.t2_md
);

export const signupButton = styleVariants({
  default: [base],

  disabled: [
    base,
    {
      color: vars.color.gray_400,
      backgroundColor: vars.color.main_disabled,
      border: `1px solid ${vars.color.stroke_main_disabled}`,
      pointerEvents: "none", // 마우스 클릭 방지
      userSelect: "none",
    },
  ],
});
