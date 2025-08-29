import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css"; 
import { tx } from "@/shared/styles/textStyle.css";

export const tagBox = style([
    tx.cap1_md,
    {
      backgroundColor: vars.color.gray_200,
      border: `0.06rem solid ${vars.color.stroke_300}`,
      padding: "0.28rem 0.625rem",
      width: "fit-content",
      minHeight: "1.625rem",
      display: "inline-flex",
      gap: "0.2rem",
      borderRadius: "0.375rem",
      verticalAlign: "middle"
    }
]);

export const tagLabel = style({
  color: vars.color.white,
});

export const removeIcon = style({
  marginInlineEnd: "-0.125rem",
  width: "1rem",
  height: "1rem",
  cursor: "pointer",
});

export const tagIcon = style({
  marginInlineStart: "-0.125rem",
  width: "1rem",
  height: "1rem",
});

export const tagCount = style({
  color: vars.color.gray_400,
});