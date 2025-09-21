import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const checkWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.75rem",
  height: "1.625rem",
  borderRadius: "0.375rem",
  backgroundColor: "transparent",
  transition: "all 0.4s ease",
  cursor: "pointer",

  ":hover": {
    backgroundColor: vars.color.gray_200,
  },
});

export const check = style({
  transition: "all 0.4s ease",
  color: vars.color.gray_400,

  selectors: {
    [`${darkTheme} ${checkWrapper}:hover &`]: {
      color: vars.color.white,
    },
    [`${lightTheme} ${checkWrapper}:hover &`]: {
      color: vars.color.black,
    },
  },
});
