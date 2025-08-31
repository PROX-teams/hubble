import { tx } from "@/shared/styles/textStyle.css";
import { style } from "@vanilla-extract/css";

export const buttonStyle = style(
  {
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    width: "fit-content",
  },
  tx.cap1_md
);
