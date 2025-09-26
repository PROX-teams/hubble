import { lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const label = style({
  position: "relative",
  display: "inline-block",
  width: "44px",
  height: "22px",
});

export const input = style({
  opacity: 0,
  width: 0,
  height: 0,
  position: "absolute",
});

export const slider = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  backgroundColor: vars.color.stroke_300,
  borderRadius: "1000px",
  transition: "all 0.4s ease-in-out",
  cursor: "pointer",

  selectors: {
    // 활성화 시
    [`${input}:checked + &`]: {
      backgroundColor: vars.color.stroke_typing,
    },
    [`${input}:checked + &::before`]: {
      transform: "translateX(22px)",
    },

    // 라이트 모드
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.gray_300,
    },
    [`${lightTheme} &::before`]: {
      border: `0.5px solid ${vars.color.stroke_300}`,
    },
  },

  "::before": {
    content: "",
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "18px",
    height: "18px",
    border: `0.5px solid ${vars.color.gray_400}`,
    borderRadius: "50%",
    backgroundColor: "#fafafa",
    boxShadow: `
      0px 1px 6px rgba(0, 0, 0, 0.06),
      0px 2px 1px rgba(0, 0, 0, 0.04)
    `,
    transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
  },
});
