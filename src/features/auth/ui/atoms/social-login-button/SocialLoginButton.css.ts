import { tx } from "@/shared/styles/textStyle.css";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style([{ gap: 8 }, tx.t2_rg]);

export const buttonStyle = styleVariants({
  lg: [base, { width: 414 }],
  sm: [base, { width: 202 }],
});
