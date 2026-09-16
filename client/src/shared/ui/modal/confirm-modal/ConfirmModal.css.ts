import { tx } from "@/shared/styles/textStyle.css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "25rem",
  minHeight: "16.5rem",
  padding: "1.75rem 1.75rem 1.5rem",
  boxSizing: "border-box",
});

export const iconWrapper = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "0.75rem",
});

export const icon = style({
  color: vars.color.gray_700,
  transition: "all 0.4s ease",
});

export const contentWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
  flex: 1,
});

export const title = style([
  {
    marginBottom: "0.5rem",
    color: vars.color.white,
    textAlign: "center",

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
    color: vars.color.gray_500,
    lineHeight: 1.5,
    margin: 0,
  },
  tx.b1_rg,
]);

export const footer = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.75rem",
  width: "100%",
  marginTop: "1.25rem",
});
