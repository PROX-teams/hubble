import { tx } from "@/shared/styles/textStyle.css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const base = style({
  display: "flex",
  alignItems: "center",
  backgroundColor: vars.color.gray_100,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: 6,
  transition: "all 0.4s ease-in-out",

  ":hover": {
    backgroundColor: vars.color.gray_200,
    border: `1px solid ${vars.color.stroke_300}`,
  },

  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.gray_100,
    },

    [`${lightTheme} &:hover`]: {
      backgroundColor: vars.color.gray_200,
      border: `1px solid ${vars.color.stroke_300}`,
    },
  },
});
const compactBase = style({
  display: "flex",
  flexDirection: "row-reverse",
  gap: "0.5rem",
  width: "14.5rem",
  height: "3.4375rem",
  padding: "0.625rem 0.5rem",
  borderRadius: 0,
  backgroundColor: vars.color.black,
  border: "none",

  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
    },
  },
});
export const hoverContainer = style({});
export const container = recipe({
  variants: {
    variant: {
      large: [
        base,
        {
          flexDirection: "column",
          width: "19.0625rem",
          height: "19rem",
        },
      ],
      small: [
        base,
        {
          flexDirection: "column",
          width: "12.625rem",
          height: "12.375rem",
        },
      ],
      wide: [
        base,
        {
          flexDirection: "row-reverse",
          gap: "0.6875rem",
          width: "23.875rem",
          height: "6rem",
          padding: "1.125rem",
        },
      ],
      compact: compactBase,
    },
  },
});

const imgBase = style({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  borderRadius: "0.375rem",
});
const imgCompactVariant = style({});
export const dimmedOverlay = style({
  // 기본 (다크 모드) dimmed
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.4s ease",
  borderRadius: "inherit",
});
globalStyle(`${hoverContainer}:hover ${dimmedOverlay}`, {
  backgroundColor: "transparent",
});
globalStyle(`${lightTheme} ${dimmedOverlay}`, {
  // 라이트모드에서는 dimmed 효과 X
  backgroundColor: "transparent",
});
globalStyle(`${imgCompactVariant} > div`, {
  // compact에서는 dimmed 효과 X
  backgroundColor: "transparent",
});
export const imgWrapper = recipe({
  base: imgBase,

  variants: {
    variant: {
      large: { height: "8.9375rem", borderRadius: "0.312rem 0.312rem 0 0" },
      small: { minHeight: "4.5625rem", borderRadius: "0.312rem 0.312rem 0 0" },
      wide: {
        minWidth: "6.9375rem",
        height: "3.75rem",
        borderRadius: "0.25rem",
      },
      compact: [
        { minWidth: "3.375rem", height: "2rem", borderRadius: "0.187rem" },
        imgCompactVariant,
      ],
    },
  },
});

export const metaContainer = style([
  {
    display: "flex",
    alignItems: "center",
    color: vars.color.gray_500,
    marginBottom: "0.8125rem",
  },
  tx.cap2_rg,
]);
globalStyle(`${metaContainer} > *:not(:first-child)::before`, {
  content: "'|'",
  height: "0.75rem",
  color: vars.color.stroke_400,
  margin: "0 0.5rem",
});
export const metaIconWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "0.125rem",
});

export const contentContainer = recipe({
  base: { display: "flex" },

  variants: {
    variant: {
      large: {
        flexDirection: "column",
        alignItems: "flex-start",
      },
      small: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.625rem",
      },
      wide: {
        flexDirection: "column",
        gap: "0.25rem",
      },
      compact: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.125rem",
      },
    },
    withImg: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    // --- large ---
    {
      variants: {
        variant: "large",
        withImg: true,
      },
      style: { padding: "1.125rem" },
    },
    {
      variants: {
        variant: "large",
        withImg: false,
      },
      style: { padding: "1.25rem 1.125rem 0 1.125rem" },
    },
    // --- small ---
    {
      variants: {
        variant: "small",
        withImg: true,
      },
      style: { padding: "0.875rem 0.8125rem 1.125rem 0.8125rem" },
    },
    {
      variants: {
        variant: "small",
        withImg: false,
      },
      style: { padding: "1rem 0.8125rem 0 0.8125rem" },
    },
    // --- compact ---
    {
      variants: {
        variant: "compact",
        withImg: true,
      },
      style: { width: "9.625rem" },
    },
    {
      variants: {
        variant: "compact",
        withImg: false,
      },
      style: { width: "13.5rem" },
    },
  ],
});

const titleStyleBase = style({
  selectors: {
    [`${lightTheme} &`]: {
      color: vars.color.black,
    },
  },
});
export const titleStyle = recipe({
  base: [
    {
      display: "block",
      color: vars.color.white,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    tx.t1_md,
  ],

  variants: {
    variant: {
      large: [
        titleStyleBase,
        tx.t1_md,
        { width: "15.5625rem", marginBottom: "0.4375rem" },
      ],
      small: [
        titleStyleBase,
        {
          display: "-webkit-box",
          width: "10.875rem",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          whiteSpace: "normal",
        },
      ],
      wide: [titleStyleBase, {}],
      compact: [
        {
          width: "100%",
          color: vars.color.gray_500,
          transition: "all 0.4s ease-in-out",

          selectors: {
            [`${darkTheme} ${hoverContainer}:hover &`]: {
              color: vars.color.white,
            },
            [`${lightTheme} ${hoverContainer}:hover &`]: {
              color: vars.color.black,
            },
          },
        },
        tx.cap1_sb,
      ],
    },

    withImg: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    // --- wide ---
    {
      variants: {
        variant: "wide",
        withImg: true,
      },
      style: { width: "14rem" },
    },
    {
      variants: {
        variant: "wide",
        withImg: false,
      },
      style: { width: "21.625rem" },
    },
  ],
});

export const content = recipe({
  base: {
    display: "-webkit-box",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    color: vars.color.gray_500,
  },

  variants: {
    variant: {
      large: [
        {
          paddingLeft: "0.75rem",
          borderLeft: `1px solid ${vars.color.stroke_400}`,
        },
        tx.b2_180_rg,
      ],
      small: [
        {
          paddingLeft: "0.625rem",
          borderLeft: `1px solid ${vars.color.stroke_400}`,
        },
        tx.b3_rg,
      ],
      wide: [{ height: "2.125rem", WebkitLineClamp: 2 }, tx.cap1_rg],
      compact: [
        {
          width: "100%",
          whiteSpace: "nowrap",
          WebkitLineClamp: 1,
          color: vars.color.gray_400,
        },
        tx.cap3_rg,
      ],
    },
    withImg: { true: {}, false: {} },
  },

  compoundVariants: [
    // --- large ---
    {
      variants: {
        variant: "large",
        withImg: true,
      },
      style: { height: "4.3125rem", WebkitLineClamp: 3 },
    },
    {
      variants: {
        variant: "large",
        withImg: false,
      },
      style: { height: "5.75rem", WebkitLineClamp: 4 },
    },
    // --- small ---
    {
      variants: {
        variant: "small",
        withImg: true,
      },
      style: { height: "2.75rem", WebkitLineClamp: 2 },
    },
    {
      variants: {
        variant: "small",
        withImg: false,
      },
      style: { height: "4.125rem", WebkitLineClamp: 3 },
    },
    // --- wide ---
    {
      variants: {
        variant: "wide",
        withImg: true,
      },
      style: { width: "14rem" },
    },
    {
      variants: {
        variant: "wide",
        withImg: false,
      },
      style: { width: "21.625rem" },
    },
  ],
});
