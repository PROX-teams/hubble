import { style } from "@vanilla-extract/css";

export const gridContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
  width: "min(824px, calc(100% - 144px))",
  minHeight: "170px",
  gap: "20px", 
  margin: "0 72px",
  
  "@media": {
    "(min-width: 1280px)": { 
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))", 
      width: "calc(824px + (100vw - 1280px))",
    },
    "(min-width: 1440px)": { 
      width: "984px",
      margin: "0 calc(72px + (100vw - 1440px)/2)",
    },

    "(min-width: 1490px)": { 
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))", 
      margin: "0 97px",
      width: "calc(984px + (100vw - 1490px))",
    },

    "(min-width: 1728px)": { 
      width: "1222px",
      margin: "0 calc(97px + (100vw - 1728px)/2)", 

    },
  },
});