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
  gap: 8,
  width: 232,
  height: 55,
  padding: "10px 8px",
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
          width: 305,
          height: 304,
        },
      ],
      small: [
        base,
        {
          flexDirection: "column",
          width: 202,
          height: 198,
        },
      ],
      wide: [
        base,
        {
          flexDirection: "row-reverse",
          gap: 11,
          width: 382,
          height: 96,
          padding: "18px",
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
  borderRadius: 6,
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
  borderRadius: 6,
  transition: "background-color 0.4s ease",
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
      large: { height: 143 },
      small: { minHeight: 73 },
      wide: { minWidth: 111, height: 60 },
      compact: [
        { minWidth: 54, height: 32, borderRadius: 3 },
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
    marginBottom: 13,
  },
  tx.cap2_rg,
]);
globalStyle(`${metaContainer} > *:not(:first-child)::before`, {
  content: "'|'",
  height: 12,
  color: vars.color.stroke_400,
  margin: "0 8px",
});
export const metaIconWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: 2,
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
        gap: 10,
      },
      wide: {
        flexDirection: "column",
        gap: 4,
      },
      compact: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
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
      style: { padding: 18 },
    },
    {
      variants: {
        variant: "large",
        withImg: false,
      },
      style: { padding: "20px 18px 0 18px" },
    },
    // --- small ---
    {
      variants: {
        variant: "small",
        withImg: true,
      },
      style: { padding: "14px 13px 18px 13px" },
    },
    {
      variants: {
        variant: "small",
        withImg: false,
      },
      style: { padding: "16px 13px 0 13px" },
    },
    // --- compact ---
    {
      variants: {
        variant: "compact",
        withImg: true,
      },
      style: { width: 154 },
    },
    {
      variants: {
        variant: "compact",
        withImg: false,
      },
      style: { width: 216 },
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
      large: [titleStyleBase, tx.t1_md, { width: 249, marginBottom: 7 }],
      small: [
        titleStyleBase,
        {
          display: "-webkit-box",
          width: 174,
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
      style: { width: 224 },
    },
    {
      variants: {
        variant: "wide",
        withImg: false,
      },
      style: { width: 346 },
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
          paddingLeft: 12,
          borderLeft: `1px solid ${vars.color.stroke_400}`,
        },
        tx.b2_180_rg,
      ],
      small: [
        {
          paddingLeft: 10,
          borderLeft: `1px solid ${vars.color.stroke_400}`,
        },
        tx.b3_rg,
      ],
      wide: [{ WebkitLineClamp: 2 }, tx.cap1_rg],
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
      style: { height: 69, WebkitLineClamp: 3 },
    },
    {
      variants: {
        variant: "large",
        withImg: false,
      },
      style: { height: 92, WebkitLineClamp: 4 },
    },
    // --- small ---
    {
      variants: {
        variant: "small",
        withImg: true,
      },
      style: { height: 44, WebkitLineClamp: 2 },
    },
    {
      variants: {
        variant: "small",
        withImg: false,
      },
      style: { height: 66, WebkitLineClamp: 3 },
    },
    // --- wide ---
    {
      variants: {
        variant: "wide",
        withImg: true,
      },
      style: { width: 224 },
    },
    {
      variants: {
        variant: "wide",
        withImg: false,
      },
      style: { width: 346 },
    },
  ],
});
