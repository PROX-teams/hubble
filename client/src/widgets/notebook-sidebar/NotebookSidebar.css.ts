import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

export const tabList = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "11px 0",
  borderBottom: `1px solid ${vars.color.stroke_300}`,
  gap: "4px",
});

export const tabItem = style([
  tx.cap2_sb,
  {
  padding: "5px 8px",
  color: vars.color.gray_400,
  cursor: "pointer",
  borderRadius: "8px",
  transition: "all 0.2s ease",
  border: "none",
  backgroundColor: "transparent",

  ":hover": {
    color: vars.color.gray_600,
    backgroundColor: vars.color.gray_200,
  },
}]);

export const activeTab = style({
  color: vars.color.gray_700,
  backgroundColor: vars.color.gray_300,
  fontWeight: "600",
});

export const tabPanels = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  overflow: "visible",
  position: "relative",
});

export const tabPanel = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  height: "100%",
  width: "100%",
});
