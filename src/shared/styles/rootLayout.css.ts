import { style, globalStyle } from "@vanilla-extract/css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";

// globalStyle에서 테마별 배경색을 적용하는 올바른 방식입니다.
globalStyle(`body`, {
  margin: 0,
  padding: 0,
  minHeight: "100vh",
  color: vars.color.gray_700,
  transition: "background-color 0.3s ease",
});

// 테마 클래스가 적용된 요소(ThemeProvider의 div 등)에 배경색을 설정합니다.
globalStyle(`${darkTheme}`, {
  backgroundColor: vars.color.black,
  color: vars.color.white,
});

globalStyle(`${lightTheme}`, {
  backgroundColor: vars.color.white,
  color: vars.color.black,
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
