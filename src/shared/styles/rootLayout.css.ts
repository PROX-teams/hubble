import { lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const rootLayout = style({
  backgroundColor: vars.color.black,
  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
    },
  },
});
