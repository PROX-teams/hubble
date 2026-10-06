import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
});

export const title = style([
  tx.h4_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const card = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "20px 24px",
  borderRadius: "0.5rem",
  backgroundColor: vars.color.gray_100,
  border: `1px solid ${vars.color.stroke_200}`,
  boxSizing: "border-box",
  minHeight: "275px",
  height: "100%",
  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.gray_100,
    },
  },
});

export const graphWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
  overflowX: "auto",
});

export const monthRow = style({
  display: "flex",
  justifyContent: "space-between",
  paddingLeft: "4px",
  paddingRight: "4px",
});

export const monthLabel = style([
  tx.cap1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const grid = style({
  display: "grid",
  gridAutoFlow: "column",
  gridTemplateRows: "repeat(7, 12px)",
  gap: "4px",
  width: "fit-content",
  margin: "0 auto",
});

export const cell = style({
  width: "12px",
  height: "12px",
  borderRadius: "2.5px",
  backgroundColor: vars.color.gray_200,
  transition: "all 0.15s ease",
  cursor: "pointer",
  selectors: {
    "&:hover": {
      outline: `1px solid ${vars.color.stroke_main_100}`,
      transform: "scale(1.2)",
    },
  },
});

export const cellLevel0 = style({
  backgroundColor: vars.color.gray_300,
  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.gray_300,
    },
  },
});

export const cellLevel1 = style({
  backgroundColor: "#168353",
});

export const cellLevel2 = style({
  backgroundColor: "#2F7453",
});

export const cellLevel3 = style({
  backgroundColor: vars.color.stroke_main_100,
});

export const cellLevel4 = style({
  backgroundColor: vars.color.main,
});

export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "12px",
  borderTop: `1px solid ${vars.color.stroke_200}`,
  flexWrap: "wrap",
  gap: "12px",
});

export const countText = style([
  tx.t2_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const countSub = style([
  tx.cap1_rg,
  {
    color: vars.color.gray_400,
    fontWeight: "normal",
    marginLeft: "4px",
  },
]);

export const legend = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

export const legendText = style([
  tx.cap1_rg,
  {
    color: vars.color.gray_400,
    margin: "0 2px",
  },
]);

export const legendCell = style({
  width: "10px",
  height: "10px",
  borderRadius: "2px",
});
