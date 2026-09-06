import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const button = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  background: "none",
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.375rem",
  padding: "0.375rem 0.625rem",
  cursor: "pointer",
  color: vars.color.gray_400,
  transition: "all 0.2s ease-in-out",

  ":hover": {
    color: vars.color.white,
    backgroundColor: vars.color.gray_200,
    borderColor: vars.color.stroke_300,
  },
  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.gray_400,
      borderColor: vars.color.stroke_200,
    },
    [`${lightTheme} &:hover`]: {
      color: vars.color.black,
      backgroundColor: vars.color.gray_100,
    },
  },
});

export const bookmarked = style({
  color: vars.color.main,
  borderColor: vars.color.main,
  backgroundColor: "rgba(16, 185, 129, 0.1)",

  ":hover": {
    color: vars.color.main,
    borderColor: vars.color.main,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.main,
      borderColor: vars.color.main,
      backgroundColor: "rgba(16, 185, 129, 0.1)",
    },
    [`${lightTheme} &:hover`]: {
      color: vars.color.main,
      borderColor: vars.color.main,
      backgroundColor: "rgba(16, 185, 129, 0.15)",
    },
  },
});

export const count = style([
  tx.t2_rg,
  {
    lineHeight: 1,
  },
]);
