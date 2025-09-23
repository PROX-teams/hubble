import { style } from "@vanilla-extract/css";
import { media } from "@/shared/styles/responsive.css";

export const gridContainer = style([{
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
  width: "824px",
  gap: "20px", 
  },
  media(1280, {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
      width: "calc(824px + (100vw - 1280px))",
  }),
    media(1440, {
      width: "984px",
  }),
    media(1490, {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
      width: "calc(984px + (100vw - 1490px))",
  }),
    media(1728, {
      width: "1222px",
  }),
]);
