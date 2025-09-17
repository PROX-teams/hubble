import { tx } from "@/shared/styles/textStyle.css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const dropdownMenu = style({
  display: "flex",
  flexDirection: "column",
  height: "27.0625rem",
  padding: 0,
  backgroundColor: vars.color.gray_100,
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflowY: "auto",
});

export const header = style({
  position: "sticky",
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  width: "100%",
  minHeight: "2.875rem",
  paddingLeft: "0.625rem",
  backgroundColor: vars.color.gray_200,
  borderBottom: `1px solid ${vars.color.stroke_200}`,
});

export const tabMenu = style([
  tx.cap1_md,
  {
    width: "3.0625rem",
    height: "1.625rem",
    borderRadius: "0.375rem",
    transition: "all 0.4s ease",
    color: vars.color.gray_400,
  },
]);

export const activeTabMenu = style([
  tx.cap1_sb,
  {
    backgroundColor: vars.color.stroke_200,

    selectors: {
      [`${darkTheme} &`]: {
        color: vars.color.white,
      },
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const content = style({
  padding: "0.5rem 0 1rem 0",
  overflowY: "auto",
  overflowX: "hidden",
});
