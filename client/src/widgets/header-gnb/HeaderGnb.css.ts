import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const header = style({
  width: "100%",
  height: "48px",
  position: "fixed",
  top: 0,
  zIndex: 100,
  backgroundColor: vars.color.black,
  borderBottom: `1px solid ${vars.color.gray_200}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
});

export const logoLink = style({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
});

export const authSection = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

export const loginLink = style([
  tx.t2_md,
  {
    color: vars.color.white,
    textDecoration: "none",
    cursor: "pointer",
    ":hover": {
      color: vars.color.gray_400,
    },
  },
]);
