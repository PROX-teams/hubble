import { style } from "@vanilla-extract/css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";
import { recipe } from "@vanilla-extract/recipes";

export const storyCard = recipe({
  base: {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  border: `0.063rem solid ${vars.color.stroke_200}`,
  borderRadius: "0.5rem",
  backgroundColor: vars.color.gray_100,
  cursor: "pointer",
  transition: "all 0.4s ease-in-out",
  selectors: {
      "&:hover": {
        backgroundColor: vars.color.gray_200,   
        borderColor: vars.color.stroke_300,     
      },
    },
  },
  variants: {
    density: {
      compact: [
        tx.t1_md,
        {
          padding: "1.125rem",   
          height: "8.3125rem",  
          gap: "0.5rem",         
        },
      ],
      comfortable: [
        tx.h5_md,
        {
          padding: "1.875rem",   
          height: "10.625rem",  
          gap: "1.125rem",      
        },
      ],
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
});

export const header = style({
  display: "flex",
  alignItems: "center",
  width: "100%",
  overflow: "hidden",
  justifyContent: "space-between",
});

export const titleContainer = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    width: "100%",
    gap: "0.5rem",
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: { color: vars.color.black },
    },
  },
  variants: {
    density: {
      compact: [tx.t1_md],
      comfortable: [tx.h5_md],
    },
  },
  defaultVariants: { density: "comfortable" },
});

export const titleIcon = style({
  display: "flex",
  alignItems: "center",
  color: vars.color.gray_300,
});

export const title = style(
  {
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
);

export const countContainer = recipe({
  base: {
    display: "inline-flex",
    gap: "0.25rem", 
    color: vars.color.gray_400,
  },
  variants: {
    density: {
      compact: [tx.cap1_rg],
      comfortable: [tx.t2_rg],
    },
  },
  defaultVariants: { density: "comfortable" },
});

export const countIcon = style({
  display: "flex",
  alignItems: "center",
});

export const count = style({
  display: "flex",
  alignItems: "center",
  height: "1.125rem"
});

export const description = recipe({
  base: {
    color: vars.color.gray_500,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    whiteSpace: "pre-line",
  },
  variants: {
    density: {
      compact: [
        tx.b2_160_rg,
        {
          marginRight: "0.5rem",  
          marginLeft: "2.25rem",  
        },
      ],
      comfortable: [tx.b1_rg],
    },
  },
  defaultVariants: { density: "comfortable" },
});

