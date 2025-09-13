import { media } from "@/shared/styles/responsive.css";
import { tx } from "@/shared/styles/textStyle.css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style([
  {
    display: "flex",
    alignItems: "center",
    gap: "0.875rem",
    width: "100%",
    minWidth: "16.5rem",
    maxWidth: "22.5rem",
    height: "4.5rem",
    padding: "1rem 1.062rem 1.062rem 1rem",
    border: `1px solid ${vars.color.stroke_200}`,
    borderRadius: "0.375rem",
    transition: "all 0.4s ease-in-out",
    cursor: "pointer",

    selectors: {
      [`${darkTheme} &`]: {
        backgroundColor: vars.color.black,
      },
      [`${lightTheme} &`]: {
        backgroundColor: vars.color.white,
      },
      [`&:hover`]: {
        backgroundColor: vars.color.gray_100,
      },
    },
  },
  media(1280, { maxWidth: "18.875rem" }),
  media(1440, { maxWidth: "16.5rem" }),
  media(1728, { maxWidth: "22.5rem" }),
]);

export const contentWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  flex: 1,
  width: "100%",
  height: "2.437rem",
});

export const name = style([
  tx.t1_md,
  {
    selectors: {
      [`${darkTheme} &`]: {
        color: vars.color.white,
      },
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const introduction = style([
  tx.cap1_rg,
  {
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    color: vars.color.gray_500,
  },
]);
