import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const modal = style({
  width: "min(640px, 92vw)",
  backgroundColor: vars.color.gray_100,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.75rem",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.75rem",
  overflow: "hidden",

  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
    },
  },
});

export const title = style([
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

export const formBody = style({
  display: "grid",
  gridTemplateColumns: "1fr 180px",
  gap: "2rem",
  width: "100%",
});

export const column = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
});

export const sectionTitle = style([
  tx.t2_md,
  {
    color: vars.color.gray_500,
    marginBottom: "0.25rem",
  },
]);

export const fieldGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const fieldLabel = style([
  tx.t2_rg,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const input = style([
  tx.b1_rg,
  {
    width: "100%",
    backgroundColor: vars.color.gray_200,
    border: `1px solid ${vars.color.stroke_200}`,
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    color: vars.color.white,
    outline: "none",
    transition: "border-color 0.2s ease",

    "::placeholder": {
      color: vars.color.gray_400,
    },
    ":focus": {
      borderColor: vars.color.stroke_main_100,
    },
    selectors: {
      [`${lightTheme} &`]: {
        backgroundColor: vars.color.gray_100,
        color: vars.color.black,
      },
    },
  },
]);

export const textarea = style([
  input,
  {
    minHeight: "110px",
    resize: "none",
  },
]);

export const iconPickerBox = style({
  width: "56px",
  height: "56px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: vars.color.gray_200,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.5rem",
  color: vars.color.stroke_main_100,
  cursor: "pointer",
  transition: "all 0.2s ease",

  ":hover": {
    borderColor: vars.color.stroke_main_100,
  },
  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.gray_100,
    },
  },
});

export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  marginTop: "0.5rem",
});

export const cancelButton = style([
  tx.b1_rg,
  {
    padding: "0.625rem 1.5rem",
    backgroundColor: vars.color.gray_200,
    border: `1px solid ${vars.color.stroke_200}`,
    borderRadius: "0.375rem",
    color: vars.color.white,
    cursor: "pointer",
    transition: "all 0.2s ease",

    ":hover": {
      backgroundColor: vars.color.gray_300,
    },
    selectors: {
      [`${lightTheme} &`]: {
        backgroundColor: vars.color.gray_200,
        color: vars.color.black,
      },
    },
  },
]);

export const submitButton = style([
  tx.t2_sb,
  {
    padding: "0.625rem 1.5rem",
    backgroundColor: vars.color.main,
    border: "none",
    borderRadius: "0.375rem",
    color: vars.color.white,
    cursor: "pointer",
    transition: "opacity 0.2s ease",

    ":hover": {
      opacity: 0.9,
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
]);
