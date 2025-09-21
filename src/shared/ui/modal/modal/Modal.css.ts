import { vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const dimmed = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
});

export const modalContainer = style({
  width: 700,
  height: 500,
  backgroundColor: vars.color.gray_100,
  color: vars.color.gray_500,
  overflow: "hidden",
  borderRadius: "0.75rem",

  selectors: {
    "&:focus": {
      outline: "none",
    },
    "&:focus-visible": {
      boxShadow: `0 0 0 2px ${vars.color.gray_200}`,
    },
  },
});
