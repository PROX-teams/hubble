import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const profileSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
  boxSizing: "border-box",
});

export const profileHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

export const profileInfoGroup = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

export const profileTextGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const profileName = style([
  tx.h3_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const profileRole = style([
  tx.t2_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const gridCards = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "20px",
  width: "100%",
  alignItems: "stretch",

  "@media": {
    "screen and (max-width: 960px)": {
      gridTemplateColumns: "1fr",
    },
  },
});
