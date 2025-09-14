import { style } from "@vanilla-extract/css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const keywordInputWrapper = style({
  display: "inline-flex",
  alignItems: "center",
  width: "13.38rem",
  padding: "0.28rem 0.50rem",
  gap: "0.25rem",
  borderRadius: "0.38rem",
  border: `1px solid ${vars.color.stroke_300}`,
  backgroundColor: vars.color.gray_200,
  color: vars.color.white,
  transition: "border-color 0.2s ease",
});

export const baseField = style([
  tx.cap1_rg,
  {
    width: "100%",
    border: "none",
    color: vars.color.white,
    selectors: {
      "&::placeholder": { color: vars.color.gray_400 },
      "&:focus": { outline: "none" },
      "&::-webkit-search-decoration": { display: "none" },
      "&::-webkit-search-cancel-button": { display: "none" },
      [`${lightTheme} &`]: { color: vars.color.black},
    },
  },
]);

export const iconBox = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 auto",
});