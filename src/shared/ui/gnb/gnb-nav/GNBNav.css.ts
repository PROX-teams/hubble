import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars,lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const aside = recipe({
  base: {
    position: "fixed",
    top: "3rem", 
    bottom: 0,
    borderRight: `0.0625rem solid ${vars.color.gray_200}`, 
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: vars.color.black,
    gap: "0.125rem", 
    padding: "0.5rem", 
    transition: "width 0.3s ease",
    overflow: "hidden",
    selectors: {
      [`.${lightTheme} &`]: {
        backgroundColor: vars.color.white,
      },
    },
  },
  variants: {
    open: {
      true: { width: "12rem" }, 
      false: { width: "3.25rem" }, 
    },
  },
  defaultVariants: {
    open: false,
  },
});

export const navLink = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    height: "2rem", 
    padding: "0 0.5rem",
    borderRadius: "0.5rem",
    color: vars.color.gray_400,
    transition: "background-color 0.4s ease, padding 0.2s ease, gap 0.2s ease, width 0.2s ease",
    selectors: {
      "&:hover": {
        backgroundColor: vars.color.gray_300,
        color: vars.color.white,
        [`.${lightTheme} &`]: {
          color: vars.color.black,
        },
      },
    },
  },
  variants: { 
    active: {
      true: { gap: "0.5rem", width: "100%" }, 
      false: { gap: 0, width: "2.25rem" }, 
    },
    current: {
      true: {
        backgroundColor: vars.color.gray_300,
        color: vars.color.white,
        selectors: {
          [`.${lightTheme} &`]: {
            color: vars.color.black,
          },
        },
      },
    },
  },
});

export const icon = style({
  flexShrink: 0,
  width: "1.25rem", 
  height: "1.25rem", 
});

export const label = style([
  tx.t2_rg,
  {
  display: "inline-block",
  overflow: "hidden",
  whiteSpace: "nowrap",
  transition: "max-width 0.35s ease, opacity 0.25s ease",
  willChange: "max-width, opacity",
}]);

export const separator = style({
  height: "0.0625rem", 
  width: "100%",
  background: vars.color.stroke_200,
  margin: "0.75rem 0",
});
