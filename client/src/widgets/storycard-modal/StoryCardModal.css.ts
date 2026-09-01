import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const modal = style({
  width: "min(1120px, 92vw)",
  height: "min(740px, 85vh)",
  backgroundColor: vars.color.gray_100,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.75rem",
  padding: "3rem 4rem",
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
  paddingBottom: "1.25rem",
  borderBottom: `1px solid ${vars.color.stroke_200}`,
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

export const moreMenuWrapper = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
});

export const moreButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  padding: "0.375rem",
  cursor: "pointer",
  color: vars.color.gray_400,
  borderRadius: "0.25rem",
  transition: "all 0.2s ease-in-out",

  ":hover": {
    color: vars.color.white,
    backgroundColor: vars.color.gray_200,
  },
  selectors: {
    [`${lightTheme} &:hover`]: {
      color: vars.color.black,
      backgroundColor: vars.color.gray_200,
    },
  },
});

export const dropdownMenu = style({
  position: "absolute",
  top: "calc(100% + 0.5rem)",
  right: 0,
  backgroundColor: vars.color.gray_200,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.5rem",
  padding: "0.375rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  minWidth: "110px",
  zIndex: 10,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",

  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
  },
});

export const dropdownItem = style([
  tx.t2_rg,
  {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0.5rem 0.75rem",
    background: "none",
    border: "none",
    borderRadius: "0.25rem",
    color: vars.color.white,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",

    ":hover": {
      backgroundColor: vars.color.gray_300,
    },
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
      [`${lightTheme} &:hover`]: {
        backgroundColor: vars.color.gray_100,
      },
    },
  },
]);

export const deleteItem = style([
  dropdownItem,
  {
    color: "#EF4444",
    ":hover": {
      backgroundColor: "rgba(239, 68, 68, 0.15)",
    },
  },
]);
