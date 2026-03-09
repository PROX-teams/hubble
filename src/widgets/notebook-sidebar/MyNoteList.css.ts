import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  padding: "12px 8px",
  boxSizing: "border-box",
  gap: "16px",
});

export const dropdownWrapper = style({
  width: "100%",
});

export const accordionListWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  width: "100%",
});

export const accordionHeader = style({
  width: "100%",
});

export const accordionTrigger = style({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: "8px",
  backgroundColor: "transparent",
  cursor: "pointer",
  border: "none",

  ":hover": {
    backgroundColor: vars.color.gray_200,
  },
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

export const accordionContent = style({
  padding: "4px 0 12px 12px",
});

export const noteListWrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  width: "100%",
});
