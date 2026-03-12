import { style, globalStyle } from "@vanilla-extract/css";
import { darkTheme, lightTheme, vars } from "@/shared/styles/theme.css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  minHeight: "100vh",
  color: vars.color.gray_700,
  transition: "background-color 0.3s ease",
});


// 2. 테마 클래스 요소 설정
globalStyle(`${darkTheme}, ${lightTheme}`, {
  minHeight: "100vh",
  width: "100%",
  minWidth: "fit-content",
  display: "flex",
  flexDirection: "column",
});

globalStyle(`${darkTheme}`, {
  backgroundColor: vars.color.black,
  color: vars.color.white,
});

globalStyle(`${lightTheme}`, {
  backgroundColor: vars.color.white,
  color: vars.color.black,
});

// 3. 실제 컨텐츠 레이아웃
export const rootLayout = style({
  paddingLeft: '250px',
  paddingTop: '48px',
  width: '100%',
  minHeight: '100vh',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});
