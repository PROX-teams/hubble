import { vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: "50%",
  overflow: "hidden",
});

export const img = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const text = style({
  fontSize: "1.25rem",
  fontWeight: 400,
  color: vars.color.white,
});
