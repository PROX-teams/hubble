import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const listItem = style({
  display: "flex",
  justifyContent:"space-between",
  alignItems: "center",
  padding: "10px 0",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
  ":hover": {
    opacity: 0.7,
  },
});

export const itemIcon = style({
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  color:vars.color.gray_400
});

export const itemContent = style({
  display: "flex",
  gap: "10px",
  alignItems: "center"
});

export const itemTitle = style([
  tx.t2_md,
  {
    color: vars.color.white,
  }]);

export const itemMeta = style([
  tx.cap2_rg,
  {
    fontSize: "12px",
    color: vars.color.gray_500,
    display: "flex",
    gap: "8px",
  }]);

export const count = style({
});
