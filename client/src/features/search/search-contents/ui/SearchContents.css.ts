import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
});

export const searchBarWrapper = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  borderBottom: `1px solid ${vars.color.stroke_200}`,
  backgroundColor: "transparent",
});

export const searchInput = style([
  tx.b1_rg,
  {
    width: "100%",
    padding: "16px 44px 16px 20px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: vars.color.white,
    selectors: {
      "&::placeholder": {
        color: vars.color.gray_400,
      },
      "&:focus": {
        outline: "none",
      },
      "&::-webkit-search-decoration": {
        display: "none",
      },
      "&::-webkit-search-cancel-button": {
        display: "none", // 브라우저 기본 x 버튼 숨김
      },
    },
  },
]);

export const clearButton = style({
  position: "absolute",
  right: "16px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  padding: "4px",
  cursor: "pointer",
  color: vars.color.gray_400,
  borderRadius: "50%",
  transition: "color 0.15s ease, background-color 0.15s ease",
  selectors: {
    "&:hover": {
      color: vars.color.white,
      backgroundColor: vars.color.gray_200,
    },
  },
});


export const section = style({
  display: "flex",
  flexDirection: "column",
  padding: "16px 26px"
});

export const sectionTitle = style([
  tx.cap2_rg,
  {
    color: vars.color.gray_400,
    marginBottom: "10px"
  }]);

export const tagList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
});

export const sectionlist = style({
  display: "flex",
  flexDirection: "column",
});

export const divider = style({
  width: "100%",
  height: "1px",
  backgroundColor: vars.color.stroke_200,
  border: "none",
});