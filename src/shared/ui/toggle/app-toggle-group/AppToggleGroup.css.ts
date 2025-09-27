import { style, styleVariants } from "@vanilla-extract/css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const rootBase = style({
  display: "flex",
  gap: "0.25rem",
  width: "fit-content",
});

export const itemBase = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0.375rem",
  transition: "all 0.4s ease",
});

export const typeVariants = {
  root: styleVariants({
    page: [
      rootBase,
      {
        height: "2.25rem",
        padding: "0.3125rem",
        borderRadius: "0.5rem",

        selectors: {
          [`${darkTheme} &`]: {
            backgroundColor: vars.color.gray_100,
          },
          [`${lightTheme} &`]: {
            backgroundColor: vars.color.gray_200,
          },
        },
      },
    ],
    sidebar: [
      rootBase,
      {
        height: "1.625rem",
        borderRadius: "0.375rem",
      },
    ],
  }),

  item: styleVariants({
    page: [
      itemBase,
      {
        padding: "0.28125rem 0.625rem",
        border: `1px solid transparent`,

        selectors: {
          [`${darkTheme} &`]: {
            color: vars.color.gray_500,
          },
          [`${darkTheme} &:hover`]: {
            color: vars.color.white,
          },
          [`${lightTheme} &`]: {
            color: vars.color.gray_500,
          },
          [`${lightTheme} &:hover`]: {
            color: vars.color.black,
          },
        },
      },
      tx.cap1_md,
    ],
    sidebar: [
      itemBase,
      {
        height: "100%",
        padding: "0.3125rem 0.5rem",

        "&:hover": {
          backgroundColor: vars.color.gray_200,
        },

        selectors: {
          [`${darkTheme} &`]: {
            color: vars.color.gray_400,
            backgroundColor: vars.color.black,
          },
          [`${darkTheme} &:hover`]: {
            backgroundColor: vars.color.gray_200,
          },
          [`${lightTheme} &`]: {
            color: vars.color.gray_400,
            backgroundColor: vars.color.white,
          },
          [`${lightTheme} &:hover`]: {
            backgroundColor: vars.color.gray_200,
          },
        },
      },
      tx.cap2_md,
    ],
  }),

  active: styleVariants({
    page: [
      itemBase,
      {
        selectors: {
          [`${darkTheme} &`]: {
            border: `1px solid ${vars.color.stroke_300}`,
            color: vars.color.white,
            backgroundColor: vars.color.gray_300,
          },
          [`${lightTheme} &`]: {
            border: `1px solid ${vars.color.gray_700}`,
            color: vars.color.white,
            backgroundColor: vars.color.gray_700,
          },
          [`${lightTheme} &:hover`]: {
            color: vars.color.white,
          },
        },
      },
      tx.cap1_sb,
    ],
    sidebar: [
      itemBase,

      {
        padding: "0.3125rem 0.5rem",

        selectors: {
          [`${darkTheme} &`]: {
            color: vars.color.white,
            backgroundColor: vars.color.gray_200,
          },
          [`${lightTheme} &`]: {
            color: vars.color.black,
            backgroundColor: vars.color.gray_200,
          },
        },
      },
      tx.cap2_sb,
    ],
  }),
};
