import { lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const buttonBaseStyle = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  borderRadius: 6,
  color: vars.color.white,
  transition: "background-color 0.4s ease, border 0.4s ease",

  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.black,
    },
  },
});

export const buttonStyle = recipe({
  base: [buttonBaseStyle],

  variants: {
    size: {
      xs: { height: 24, borderRadius: 5 },
      sm: { width: 66, height: 28 },
      md: { height: 32 },
      lg: { height: 44 },
    },

    variants: {
      colored: {
        backgroundColor: vars.color.main,
        border: `1px solid ${vars.color.stroke_main}`,
        ":hover": {
          backgroundColor: vars.color.main_100,
          border: `1px solid ${vars.color.stroke_main_100}`,
        },
        ":disabled": {
          color: vars.color.gray_400,
          backgroundColor: vars.color.main_disabled,
          border: `1px solid ${vars.color.stroke_main_disabled}`,
          cursor: "not-allowed",
        },
      },
      neutral: {
        backgroundColor: vars.color.gray_200,
        border: `1px solid ${vars.color.stroke_300}`,
        ":hover": {
          border: `1px solid ${vars.color.stroke_400}`,
        },
      },
      danger: {
        backgroundColor: vars.color.gray_200,
        border: `1px solid ${vars.color.stroke_300}`,
        ":hover": {
          border: `1px solid ${vars.color.stroke_400}`,
        },
        color: vars.color.system_red,
        selectors: {
          [`${lightTheme} &`]: {
            color: vars.color.system_red,
          },
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
    variants: "neutral",
  },
});
