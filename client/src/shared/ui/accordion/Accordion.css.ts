import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@/shared/styles/theme.css";

export const wrapper = style({
  backgroundColor: "transparent", 
  width: "100%",                  
  height: "100%",                 
  display: "flex",                
  flexDirection: "column",
})

export const content = style({
  width: "100%",
  overflow: "hidden",
});

export const header = recipe({
  base: [
    {
      display: "flex",
      alignItems: "center",
      width: "100%",
      gap: "0.375rem",
    },
  ],
  variants: {
    variant: {
      compact: { justifyContent: "flex-start" },  
      spread: { justifyContent: "space-between" } 
    },
  },
  defaultVariants: {
    variant: "compact",
  },
});


export const triggerButton = style({
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
});

export const triggerIcon = recipe({
  base: {
    display: "inline-flex",
    transition: "transform 200ms ease",
    transform: "rotate(0deg)",
    color:vars.color.stroke_500,
  },
  variants: {
    rotatable: {
      true: {},
      false: { transition: "none" }, 
    },
    open: {
      true: { transform: "rotate(90deg)" },
      false: { transform: "rotate(0deg)" },
    },
  },
  
  defaultVariants: {
    rotatable: false,
    open: false,
  },
});
