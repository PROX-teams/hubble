import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "0.875rem 1rem",
  borderRadius: "0.375rem",
  textDecoration: "none",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  backgroundColor: "transparent",

  ":hover": {
    backgroundColor: vars.color.gray_200,
  },
});

export const leftContent = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

export const iconWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.gray_400,
  flexShrink: 0,
});

export const textContent = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const title = style([
  tx.t1_md,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const meta = style([
  tx.cap1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const arrowIcon = style({
  display: "flex",
  alignItems: "center",
  color: vars.color.gray_400,
  flexShrink: 0,
});
