import { style, globalStyle } from "@vanilla-extract/css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";

// 모든 페이지의 공통 배경색과 텍스트 색상을 설정합니다.
globalStyle("body", {
  minHeight: "100vh",
  color: vars.color.gray_700,
  selectors: {
    [`${darkTheme} &`]: {
      backgroundColor: vars.color.black,
    },
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.white,
    },
  },
});

// 실제 컨텐츠가 배치될 영역의 레이아웃을 정의합니다.
export const rootLayout = style({
  paddingLeft: '320px', // 사이드바 공간 확보
  width: '100%',
  minHeight: '100vh',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
});
