import { style } from "@vanilla-extract/css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";

export const rootLayout = style({
  color: vars.color.gray_700,
  selectors: {
    [`${darkTheme} &`]: {
      backgroundColor: vars.color.black,
    },
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
    },
  },
});
