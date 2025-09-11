import { tx } from "@/shared/styles/textStyle.css";
import { lightTheme, vars } from "@/shared/styles/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style([
  {
    display: "flex",
    alignItems: "center",
    gap: 5,
    width: "fit-content",
    height: 24,
    padding: "3.5px 9px 3.5px 7px",
    border: `1px solid ${vars.color.stroke_300}`,
    borderRadius: 5,
    backgroundColor: vars.color.gray_200,
    color: vars.color.gray_500,
    transition: "all 0.4s ease",

    ":hover": {
      color: vars.color.white,
      border: `1px solid ${vars.color.stroke_400}`,
    },

    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.gray_500,
      },
      [`${lightTheme} &:hover`]: {
        color: vars.color.black,
      },
      [`&[disabled]`]: {
        cursor: "not-allowed", // 커서 변경
        opacity: 0.6, // 시각적 비활성화 효과
      },
    },
  },
  tx.cap1_md,
]);

export const icon = style({
  color: vars.color.gray_500,
  transition: "all 0.4s ease",

  selectors: {
    [`${container}:hover &`]: {
      color: vars.color.white,
    },
    [`${lightTheme} ${container}:hover &`]: {
      color: vars.color.black,
    },
  },
});
