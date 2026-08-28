import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "2.5rem",
  width: "100%",
  maxWidth: "1160px",
  margin: "0 auto",
  padding: "40px 60px",
});

export const headerSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const pageTitle = style([
  tx.h2_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const pageSubtitle = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const storyGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1.25rem",
  width: "100%",

  "@media": {
    "screen and (max-width: 900px)": {
      gridTemplateColumns: "repeat(1, 1fr)",
    },
  },
});

export const emptyStoryText = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
    padding: "2rem 0",
  },
]);
