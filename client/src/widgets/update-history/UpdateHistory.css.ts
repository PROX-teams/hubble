import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

// 섹션 전체 영역
export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
});

// "Update History" 타이틀
export const title = style([
  tx.h4_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

// 사진 1 하단의 거대한 라운드 박스 컨테이너
export const listContainer = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  backgroundColor: vars.color.gray_100,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: "0.5rem",
  padding: "1rem",
  gap: "0.25rem",
});

// 데이터가 없을 때의 빈 상태 안내 텍스트
export const emptyText = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
    textAlign: "center",
    padding: "2rem 0",
  },
]);
