import { tx } from "@/shared/styles/textStyle.css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const active = style({});

export const button = style([
  tx.cap1_rg,
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "3.875rem",
    height: "1.75rem",
    padding: "0 0.6875rem 0 0.5625rem ",
    border: `1px solid ${vars.color.stroke_200}`,
    borderRadius: "6.25rem",
    transition: "all 0.4s ease",

    selectors: {
      [`&:hover, &.${active}`]: {
        border: `1px solid ${vars.color.stroke_400}`,
      },

      [`${darkTheme} &`]: {
        backgroundColor: vars.color.black,
        color: vars.color.gray_600,
      },
      [`${darkTheme} &:hover, ${darkTheme} &.${active}`]: {
        color: vars.color.white,
      },

      [`${lightTheme} &`]: {
        backgroundColor: vars.color.white,
        color: vars.color.gray_700,
      },
      [`${lightTheme} &:hover, ${lightTheme} &.${active}`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const icon = style({
  transition: "all 0.4s ease",

  selectors: {
    [`${darkTheme} &`]: {
      color: vars.color.gray_600,
    },
    [`${darkTheme} ${button}:hover &, ${darkTheme} ${button}.${active} &`]: {
      color: vars.color.white,
    },

    [`${lightTheme} &`]: {
      color: vars.color.gray_700,
    },
    [`${lightTheme} ${button}:hover &, ${lightTheme} ${button}.${active} &`]: {
      color: vars.color.black,
    },
  },
});
