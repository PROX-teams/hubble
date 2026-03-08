import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
});

export const searchInput  = style({
  display: "flex",
  width:"100%",
  borderRadius: 0,
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