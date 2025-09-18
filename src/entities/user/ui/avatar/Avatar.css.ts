import { tx } from "@/shared/styles/textStyle.css";
import { vars } from "@/shared/styles/theme.css";
import { style, styleVariants } from "@vanilla-extract/css";

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

export const baseText = style({
  fontWeight: 400,
  lineHeight: "160%",
  letterSpacing: "-0.02em",
  color: vars.color.white,
});

export const text = styleVariants({
  20: [
    baseText,
    {
      fontSize: "0.6875rem",
    },
  ],
  26: [baseText, tx.b2_160_rg],
  32: [
    baseText,
    {
      fontSize: "1rem",
    },
  ],
  38: [
    baseText,
    {
      fontSize: "1.125rem",
    },
  ],
  48: [
    baseText,
    {
      fontSize: "1.5rem",
    },
  ],
  65: [
    baseText,
    {
      fontSize: "2rem",
    },
  ],
});
