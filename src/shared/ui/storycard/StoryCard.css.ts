import { style } from "@vanilla-extract/css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const storyCard = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.125rem",
  padding: "1.875rem",
  width: "100%",
  height: "10.625rem",
  border: `0.063rem solid ${vars.color.stroke_300}`,
  borderRadius: "0.5rem",
  backgroundColor: vars.color.gray_200,
  cursor: "pointer",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  width: "100%",
  justifyContent: "space-between",
  color: vars.color.white,
});

export const titleContainer = style({
  display: "inline-flex",
  alignItems: "center",
  width: "100%",
  gap: "0.5rem",
  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.black,
    },
  },
});

export const titleIcon = style({
  display: "flex",
  alignItems: "center",
  color: vars.color.gray_300,
});

export const title = style([
  tx.h5_md,
  {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const countContainer = style([
  tx.t2_rg,
  {
    display: "inline-flex",
    gap: "0.25rem",
    color: vars.color.gray_400,
  },
]);

export const countIcon = style({
  display: "flex",
  alignItems: "center",
});

export const count = style({
  display: "flex",
  alignItems: "center",
  height: "1.125rem"
});


export const description = style([
  tx.b1_rg,
  {
    color: vars.color.gray_500,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    whiteSpace: "normal",
  },
]);
