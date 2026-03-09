import { style } from "@vanilla-extract/css";
import { media } from "@/shared/styles/responsive.css";

export const gridContainer = style([
  {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    width: "824px",
    gap: "20px",
  },
  media(1280, {
    width: "calc(824px + (100vw - 1280px))",
  }),
  media(1440, {
    width: "calc(984px + (238 * (100vw - 1440px) / 288))",
  }),
  media(1728, {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    width: "1222px",
  }),
]);

