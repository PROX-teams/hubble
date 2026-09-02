import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const button = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  background: "none",
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.375rem",
  padding: "0.375rem 0.625rem",
  cursor: "pointer",
  color: vars.color.gray_400,
  transition: "all 0.2s ease-in-out",

  ":hover": {
    color: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.gray_400,
      borderColor: vars.color.stroke_200,
    },
    [`${lightTheme} &:hover`]: {
      color: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.08)",
      borderColor: "rgba(239, 68, 68, 0.3)",
    },
  },
});

export const liked = style({
  color: "#EF4444",
  borderColor: "#EF4444",
  backgroundColor: "rgba(239, 68, 68, 0.12)",

  ":hover": {
    color: "#EF4444",
    borderColor: "#EF4444",
    backgroundColor: "rgba(239, 68, 68, 0.18)",
  },
  selectors: {
    [`${lightTheme} &`]: {
      color: "#EF4444",
      borderColor: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.12)",
    },
    [`${lightTheme} &:hover`]: {
      color: "#EF4444",
      borderColor: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.18)",
    },
  },
});

export const count = style([
  tx.t2_rg,
  {
    lineHeight: 1,
  },
]);
