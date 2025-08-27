import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "0.5rem",
});

export const label = style([
  tx.cap1_rg,
  {
    color: vars.color.gray_500,
  },
]);

export const errorMessage = style([
  tx.cap1_rg,
  {
    color: vars.color.system_red,
  },
]);

const baseField = style([
  tx.b1_rg,
  {
    width: "100%",
    borderRadius: "0.38rem",
    border: `2px solid ${vars.color.stroke_200}`,
    backgroundColor: vars.color.gray_100,
    color: vars.color.white,
    transition: "border-color 0.2s ease",
    selectors: {
      "&::placeholder": { color: vars.color.gray_400 },
      "&:focus": { outline: "none", borderColor: vars.color.stroke_typing },
    },
  },
]);

export const inputRecipe = recipe({
  base: [baseField],
  variants: {
    size: {
      sm: [
        tx.cap1_rg,
        {
          width: "28.13rem",
          minHeight: "2.13rem",
          padding: "0.53rem 0.75rem",
        },
      ],
      md: {
        width: "40.5rem",
        minHeight: "2.25rem",
        padding: "0.44rem 0.75rem",
      },
      lg: {
        width: "28.25rem",
        minHeight: "2.75rem",
        padding: "0.69rem 0.75rem",
      },
    },
  },
  defaultVariants: { size: "md" },
});

export const textareaRecipe = recipe({
  base: [
    baseField,
    {
      resize: "none",
      overflow: "auto",
      selectors: {
        "&::-webkit-scrollbar": { display: "none" },
      },
    },
  ],
  variants: {
    size: {
      sm: {
        width: "21.25rem",
        minHeight: "2.00rem",
        padding: "0.34rem 0.75rem",
      },
      md: {
        width: "28.13rem",
        minHeight: "5.38rem",
        padding: "0.63rem 0.75rem",
      },
      lg: {
        width: "40.50rem",
        minHeight: "5.38rem",
        padding: "0.63rem 0.75rem",
      },
    },
  },
  defaultVariants: { size: "md" },
});