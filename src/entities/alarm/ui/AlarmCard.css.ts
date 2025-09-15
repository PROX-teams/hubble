import { style } from "@vanilla-extract/css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  display: "flex",
  gap: "0.5rem",
  width: "22.25rem",
  height: "4.0937rem",
  padding: "0.625rem 0.75rem",
  borderBottom: `1px solid ${vars.color.gray_200}`,
  backgroundColor: vars.color.gray_100,
});

export const innerWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  height: "2.75rem",
  marginTop: "0.09375rem",
});

export const contentWrapper = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "15.75rem",
  height: "100%",
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const userName = style([
  tx.cap1_md,
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

export const date = style([
  tx.cap2_rg,
  {
    color: vars.color.gray_500,
  },
]);

export const message = style([
  tx.b2_160_rg,
  {
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    color: vars.color.gray_700,
  },
]);

export const checkWrapper = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "1.75rem",
  height: "1.625rem",
  borderRadius: "0.375rem",
  backgroundColor: vars.color.gray_200,
  transition: "all 0.4s ease",
  cursor: "pointer",
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
