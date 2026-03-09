import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";

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
  padding: "11px 8px",
  borderBottom: `1px solid ${vars.color.stroke_300}`,
  gap: "4px",
});

export const tabItem = style({
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: "500",
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
});

export const activeTab = style({
  color: vars.color.gray_700,
  backgroundColor: vars.color.gray_300,
  fontWeight: "600",
});

export const tabPanels = style({
  flex: 1,
  overflowY: "auto",
  padding: "8px 0",

  // 스크롤바 스타일링
  "::-webkit-scrollbar": {
    width: "4px",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: vars.color.stroke_300,
    borderRadius: "2px",
  },
});
