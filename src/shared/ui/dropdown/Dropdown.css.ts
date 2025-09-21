import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const dropdownwrapper = style({
  display: "inline-block",
  position: "relative",
});

export const dropdowntrigger = recipe({
  base: [
    tx.cap1_md,
    {
      display: "flex",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      padding: "0.53rem 0.75rem",
      border: `0.063rem solid ${vars.color.stroke_200}`,
      borderRadius: "0.38rem",
      backgroundColor: vars.color.black,
      cursor: "pointer",
      color: vars.color.gray_500,
      selectors: {
        [`${lightTheme} &`]: {
          backgroundColor: vars.color.white,
        },
      },
    },
  ],
  variants: {
    size: {
      sm: { width: "5.5rem", height: "2.125rem" }, // 88×34
      md: { width: "6.563rem", height: "2.125rem" }, // 105×34
      lg: { width: "6.875rem", height: "2.125rem" }, // 110×34
      xl: { width: "7.25rem", height: "1.625rem" }, // 116×26
      "2xl": { width: "14.5rem", height: "2.125rem" }, // 232×34
      "2xl-tall": { width: "14.5rem", height: "3.5rem" }, // 232×56
      "3xl": { width: "20.75rem", height: "2.125rem" }, // 332×34
      "4xl": { width: "28.125rem", height: "2.125rem" }, // 450×34
    },
    variant: {
      solid: {
        backgroundColor: vars.color.gray_100,
        border: `0.063rem solid ${vars.color.stroke_400}`,
      },
      surface: {
        backgroundColor: vars.color.gray_200,
        border: `0.063rem solid ${vars.color.stroke_400}`,
      },
      muted: {
        backgroundColor: vars.color.gray_100,
        border: `0.063rem solid ${vars.color.stroke_300}`,
      },
      ghost: {
        padding: "0",
        backgroundColor: "transparent",
        border: "none",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const dropdownvalue = recipe({
  base: {
    color: vars.color.gray_500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
  variants: {
    selected: {
      true: {
        color: vars.color.white,
        selectors: {
          [`${lightTheme} &`]: {
            color: vars.color.black,
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export const dropdownicon = recipe({
  base: {
    display: "inline-flex",
  },
  variants: {
    side: {
      left: { marginInlineStart: "-0.375rem " },
      right: { marginInlineEnd: "-0.375rem " },
    },
  },
});

export const dropdownmenu = recipe({
  base: {
    maxHeight: "26.875rem", // 430px
    marginTop: "0.4rem",
    border: `0.1rem solid ${vars.color.stroke_300}`,
    borderRadius: "0.38rem",
    padding: "0.2rem 0.2rem",
    backgroundColor: vars.color.gray_200,
    //대응하기
    overflowY: "auto",
    overflowX: "hidden",
    zIndex: 1000,
    position: "absolute",
  },
  variants: {
    size: {
      sm: { width: "5.5rem" }, // 88px
      md: { width: "7.5rem" }, // 120px
      lg: { width: "9.625rem" }, // 154px
      xl: { width: "14.5rem" }, // 232px
      "2xl": { width: "20.75rem" }, // 332px
      "3xl": { width: "22.25rem" }, // 356px
      "4xl": { width: "28.125rem" }, // 450px
    },
    placement: {
      left: {
        left: 0,
      },
      center: {
        left: "50%",
        transform: "translateX(-50%)",
      },
      right: {
        right: 0,
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
});

export const dropdownoption = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0.34rem 1rem",
  cursor: "pointer",
  color: vars.color.gray_500,
  fontSize: "0.75rem",
});

export const optionSelected = style({
  padding: "0.34rem 1rem",
  borderRadius: "0.19rem",
  backgroundColor: vars.color.gray_300,
  color: vars.color.white,
  fontSize: "0.75rem",
  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.black,
    },
  },
});
