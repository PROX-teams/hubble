import { StyleRule } from "@vanilla-extract/css";

export const breakpoints = {
  1280: "1280px",
  1440: "1440px",
  1490: "1490px",
  1728: "1728px",
  1920: "1920px",
};

type Breakpoints = keyof typeof breakpoints;

/**
 *
 * @param breakpoint - 브레이크포인트 (1280, 1440, 1728, 1920)
 * @param styles - 적용할 스타일 객체
 * @param type - 미디어 쿼리 타입 ("min" 또는 "max"), 기본값은 "min"
 * @returns - 미디어 쿼리를 포함한 스타일 객체
 * @example
 * media(1280, { color: 'red' }) // min-width: 1280px
 * media(1440, { color: 'blue' }, 'max') // max-width: 1440px
 */

export const media = (
  breakpoint: Breakpoints,
  styles: StyleRule,
  type: "min" | "max" = "min"
): StyleRule => ({
  "@media": {
    [`screen and (${type}-width: ${breakpoints[breakpoint]})`]: styles,
  },
});
