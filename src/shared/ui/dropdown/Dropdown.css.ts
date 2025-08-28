import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const wrapper = style({
  position: "relative",
})

export const trigger = recipe({
  base: [
    tx.cap1_md, 
    {
      display: "flex",
      justifyContent:"space-between",
      padding: "0.53rem 0.75rem",
      border: `0.063rem solid ${vars.color.stroke_400}`, 
      borderRadius: "0.38rem",
      backgroundColor: vars.color.gray_100,
      cursor: "pointer",
      width: "100%",
      color: vars.color.gray_500,
    }
  ],
  variants: {
    iconPlacement: {
      right: { paddingLeft: "0.75rem", paddingRight: "0.375rem" }, 
      both:  { paddingLeft: "0.5rem",  paddingRight: "0.375rem" },  
      left:  { paddingLeft: "0.5rem",  paddingRight: "0.75rem" }, 
      none:  { paddingLeft: "0rem",    paddingRight: "0rem" },  
    },
    variant: {
      solid: {
        backgroundColor: vars.color.black,
        border: `0.063rem solid ${vars.color.stroke_200}`, 
      },
      ghost: {
        backgroundColor: "transparent",
        border: "none",             
      },
      none: {}
    },
  },
  defaultVariants: {
      iconPlacement: "right",
      variant: "none",
    },
  });

export const value = recipe({
  base: {
    color: vars.color.gray_500,
  },
  variants: {
    selected: {
      true: {
        color: vars.color.white,
      },
      false: {},
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export const icon = style({
  display: "flex",
});

export const menu = recipe({
  base:{
  marginTop: "0.4rem", 
  border: `0.1rem solid ${vars.color.stroke_200}`,
  borderRadius: "0.38rem",
  padding: "0.2rem 0.2rem", 
  backgroundColor: vars.color.gray_200,
  maxHeight: "12.5rem",
  overflowY: "auto",
  zIndex: 1000,
  position: "absolute",
  minWidth: "10rem",
  },
  variants: {
    placement: {
      left: {
        left: 0,
      },
      center: {
        left: "50%",
        transform: "translateX(-50%)" ,
      },
      right: {
        right: 0,
      },
    },
  }
});

export const option = style({
  alignItems: "center",
  padding: "0.34rem 1rem",
  cursor: "pointer",
  color: vars.color.gray_500,
  fontSize: "0.75rem",
});

export const optionSelected = style({
  display: "flex",
  alignItems: "center",
  padding: "0.34rem 1rem",
  borderRadius: "0.19rem", 
  backgroundColor: vars.color.gray_300,
  color: vars.color.white,
  fontSize: "0.75rem",
});

