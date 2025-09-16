import { style } from "@vanilla-extract/css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";

export const rootLayout = style({
  selectors: {
    [`${darkTheme} &`]: {
      backgroundColor: vars.color.black,
      color: vars.color.gray_700,
    },
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
      color: vars.color.gray_700,
    },
  },
});
