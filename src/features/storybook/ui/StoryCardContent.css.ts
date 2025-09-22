import { style } from "@vanilla-extract/css";
import { media } from "@/shared/styles/responsive.css";

export const gridContainer = style([{
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
  width: "824px",
  minHeight: "170px",
  gap: "20px", 
  margin: "0 72px",
  },
  media(1280, {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
      width: "calc(824px + (100vw - 1280px))",
  }),
    media(1440, {
      width: "984px",
      margin: "0 calc(72px + (100vw - 1440px)/2)",
  }),
    media(1490, {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
      margin: "0 97px",
      width: "calc(984px + (100vw - 1490px))",
  }),
    media(1728, {
      width: "1222px",
      margin: "0 calc(97px + (100vw - 1728px)/2)", 
  }),
]);
