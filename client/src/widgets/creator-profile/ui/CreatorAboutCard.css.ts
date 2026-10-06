import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const card = style({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "24px 28px",
  borderRadius: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: `1px solid ${vars.color.stroke_200}`,
  backdropFilter: "blur(12px)",
  minHeight: "180px",
  boxSizing: "border-box",
  flex: 1,
  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: "rgba(0, 0, 0, 0.02)",
      borderColor: vars.color.stroke_200,
    },
  },
});

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

export const actionGroup = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const content = style([
  tx.b2_160_rg,
  {
    color: vars.color.gray_400,
    lineHeight: "1.65",
    whiteSpace: "pre-line",
    wordBreak: "keep-all",
    margin: 0,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.gray_600,
      },
    },
  },
]);
