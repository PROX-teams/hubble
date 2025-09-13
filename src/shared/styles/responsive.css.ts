import { StyleRule } from "@vanilla-extract/css";

export const breakpoints = {
  1280: "1280px",
  1440: "1440px",
  1728: "1728px",
  1920: "1920px",
};

type Breakpoints = keyof typeof breakpoints;

export const media = (
  breakpoint: Breakpoints,
  styles: StyleRule
): StyleRule => ({
  "@media": {
    [`screen and (min-width: ${breakpoints[breakpoint]})`]: styles,
  },
});
