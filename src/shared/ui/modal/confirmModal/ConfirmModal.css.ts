import { tx } from "@/shared/styles/textStyle.css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "24.875rem",
  height: "15.875rem",
  paddingTop: "1.875rem",
});

export const iconWrapper = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "1rem",
});
export const icon = style({
  color: vars.color.gray_700,
  transition: "all 0.4s ease",
});

export const contentWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "19.8rem",
  marginBottom: "2.25rem",
});

export const title = style([
  {
    marginBottom: "0.375rem",
    color: vars.color.white,

    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
  tx.h3_sb,
]);

export const description = style([
  {
    textAlign: "center",
    whiteSpace: "pre-wrap",
  },
  tx.b1_rg,
]);

export const footer = style({
  display: "flex",
  gap: "0.5rem",
});
