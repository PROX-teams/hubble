import { style, styleVariants} from "@vanilla-extract/css";
import { lightTheme, vars } from "@/shared/styles/theme.css";

export const sidebarBase = style({
  top: "3rem",
  bottom: 0,
  zIndex: 50, // GNB(100)보다 낮음
  transition: "transform 0.4s ease",
  display: "flex",
  flexDirection: "column",
  backgroundColor: vars.color.black,
  selectors: {
    [`.${lightTheme} &`]: {
      backgroundColor: vars.color.white, 
    },
  }
});

export const leftSidebar = style([
  sidebarBase, 
  {
    position: "fixed",
    left: 0,
    width: "16.25rem", 
    borderRight: `1px solid ${vars.color.stroke_200}`,
  },
]);

export const rightSidebar = style([
  sidebarBase,
  {
    position: "fixed", // 👈 fixed 추가
    right: 0,         // 👈 우측 고정
    width: "30.125rem",
    padding: "0 1rem",
    borderLeft: `0.06rem solid ${vars.color.stroke_200}`,
  },
]);

export const sidebarTransform = styleVariants({
  // 👈 왼쪽 사이드바용 (GNB 옆으로 튀어나옴)
  openLeft: { transform: "translateX(3.25rem)" }, 
  closedLeft: { transform: "translateX(-100%)" }, 

  // 👈 오른쪽 사이드바용 (GNB와 무관하게 제자리에서 동작)
  openRight: { transform: "translateX(0)" },
  closedRight: { transform: "translateX(100%)" },
});
