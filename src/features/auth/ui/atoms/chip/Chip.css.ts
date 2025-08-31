import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { buttonBaseStyle } from "@/shared/ui/atoms/button/Button.css";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style([
  buttonBaseStyle,
  {
    width: 144,
    height: 44,
    border: `1px solid ${vars.color.stroke_200}`,

    ":hover": {
      border: `1px solid ${vars.color.stroke_400}`,
    },
  },
]);

export const chipStyle = styleVariants({
  default: [
    base,
    {
      selectors: {
        [`${lightTheme} &`]: {
          backgroundColor: vars.color.white,
        },
        [`${darkTheme} &`]: {
          backgroundColor: vars.color.black,
        },
      },
    },
  ],

  isSelected: [
    base,
    {
      backgroundColor: vars.color.gray_200,
    },
  ],
});
