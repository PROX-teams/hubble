import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const modal = style({
  width: "min(1040px, 92vw)",
  height: "auto",
  maxHeight: "88vh",
  backgroundColor: vars.color.gray_100,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.75rem",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  overflow: "hidden",

  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
    },
  },
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  flexShrink: 0,
});

export const titleContainer = style({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
});

export const titleIcon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.stroke_main_100,
});

export const title = style([
  tx.h3_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const metaContainer = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

export const metaItem = style([
  tx.t2_rg,
  {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    color: vars.color.gray_400,
  },
]);

export const closeButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  padding: "0.25rem",
  cursor: "pointer",
  color: vars.color.gray_400,
  borderRadius: "0.25rem",
  transition: "all 0.2s ease-in-out",

  ":hover": {
    color: vars.color.white,
    backgroundColor: vars.color.gray_200,
  },
});

export const contentWrapper = style({
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  paddingRight: "0.25rem",

  "::-webkit-scrollbar": {
    width: "6px",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: vars.color.stroke_300,
    borderRadius: "3px",
  },
});
