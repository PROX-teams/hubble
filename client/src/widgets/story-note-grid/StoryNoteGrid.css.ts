import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  width: "100%",
});

export const tagListWrapper = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  alignItems: "center",
  width: "100%",
});

export const tagItem = style({
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  selectors: {
    "&:hover": {
      borderColor: vars.color.stroke_main_100,
    },
  },
});

export const activeTagItem = style({
  backgroundColor: vars.color.main,
  borderColor: vars.color.stroke_main_100,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "1.25rem",
  width: "100%",

  "@media": {
    "screen and (max-width: 1200px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "screen and (max-width: 900px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "screen and (max-width: 600px)": {
      gridTemplateColumns: "repeat(1, 1fr)",
    },
  },
});

export const emptyState = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
    textAlign: "center",
    padding: "3rem 0",
    width: "100%",
  },
]);
