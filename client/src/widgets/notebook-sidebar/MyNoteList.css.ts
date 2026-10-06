import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  minHeight: 0,
  padding: "16px 14px",
  boxSizing: "border-box",
  gap: "16px",
  overflow: "visible",
});

export const dropdownWrapper = style({
  width: "100%",
  position: "relative",
  zIndex: 20,
});

export const fullWidthWrapper = style({
  width: "100%",
  display: "block",
});

export const fullWidthTrigger = style({
  width: "100% !important",
  boxSizing: "border-box",
});

export const fullWidthMenu = style({
  width: "100% !important",
  minWidth: "100%",
  boxSizing: "border-box",
});

export const noteListWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  boxSizing: "border-box",
  paddingRight: "2px",

  "::-webkit-scrollbar": {
    width: "4px",
    height: "0px",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: vars.color.stroke_300,
    borderRadius: "2px",
  },
});

globalStyle(`${noteListWrapper} > *`, {
  width: "100% !important",
  maxWidth: "100% !important",
  boxSizing: "border-box",
});

export const accordionListWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  width: "100%",
});

export const storyTitle = style({
  fontSize: "14px",
  fontWeight: "600",
  color: vars.color.gray_700,
});

export const noteCount = style({
  fontSize: "12px",
  color: vars.color.gray_400,
});

export const emptyText = style({
  padding: "32px 16px",
  color: vars.color.gray_400,
  fontSize: "13px",
  textAlign: "center",
  width: "100%",
  boxSizing: "border-box",
});

export const draftHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "4px 6px 10px 6px",
  borderBottom: `1px solid ${vars.color.stroke_200}`,
  width: "100%",
  boxSizing: "border-box",
});

export const draftTitleText = style({
  fontSize: "13px",
  fontWeight: "600",
  color: vars.color.gray_600,
});

export const clearAllBtn = style({
  fontSize: "12px",
  color: vars.color.gray_400,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "2px 4px",
  transition: "color 0.2s ease",
  ":hover": {
    color: vars.color.system_red,
  },
});

export const deleteIconBtn = style({
  position: "absolute",
  top: "10px",
  right: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  color: vars.color.gray_400,
  cursor: "pointer",
  zIndex: 2,
  padding: "4px",
  borderRadius: "4px",
  transition: "color 0.2s ease, background-color 0.2s ease",
  ":hover": {
    color: vars.color.system_red,
  },
});
