import { tx } from "@/shared/styles/textStyle.css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style([
  {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    width: 172,
    height: 32,
    border: `1px solid ${vars.color.stroke_300}`,
    borderRadius: 6,
    backgroundColor: vars.color.gray_200,
    color: vars.color.white,
    transition: "all 0.4s ease",

    ":hover": {
      border: `1px solid ${vars.color.stroke_400}`,
    },

    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
  tx.cap1_md,
]);

export const iconWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const icon = style({
  color: vars.color.white,

  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.black,
    },
  },
});
