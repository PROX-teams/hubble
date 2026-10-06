import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "3.5rem",
  width: "100%",
  boxSizing: "border-box",
  padding: "40px 180px 60px 0",

  "@media": {
    "screen and (max-width: 1280px)": {
      padding: "40px 80px 60px 0",
    },
    "screen and (max-width: 768px)": {
      gap: "2.5rem",
      padding: "24px 20px 40px 0",
    },
  },
});

export const storySection = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
});

export const headerSection = style({
  display: "flex",
  flexDirection: "column",
});

export const titleRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
  width: "100%",
});

export const titleLeftGroup = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
});

export const pageTitle = style([
  tx.h4_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const filterBadge = style([
  tx.cap1_md,
  {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "6px",
    backgroundColor: "rgba(62, 207, 142, 0.12)",
    color: vars.color.stroke_main_100,
    border: `1px solid ${vars.color.stroke_main_100}`,
    width: "fit-content",
  },
]);

export const clearFilterBtn = style({
  background: "none",
  border: "none",
  color: vars.color.stroke_main_100,
  cursor: "pointer",
  padding: 0,
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  selectors: {
    "&:hover": {
      opacity: 0.8,
    },
  },
});

export const pageSubtitle = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const storyGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "1.25rem",
  width: "100%",
  minHeight: "60vh",
  alignContent: "start",

  "@media": {
    "screen and (max-width: 1024px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "screen and (max-width: 640px)": {
      gridTemplateColumns: "repeat(1, 1fr)",
    },
  },
});

export const emptyStoryText = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
    padding: "2rem 0",
  },
]);

export const tagListWrapper = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  alignItems: "center",
  width: "100%",
  marginTop: "16px",
});

export const tagItem = style({
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  selectors: {
    "&:hover": {
      borderColor: vars.color.stroke_main_100,
    },
  },
});

export const activeTagItem = style({
  backgroundColor: vars.color.main,
  borderColor: vars.color.stroke_main_100,
});
