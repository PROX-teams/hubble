import { style } from "@vanilla-extract/css";
import { vars, lightTheme } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const container = style({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "transparent",
});

// 상단 헤더 (My Story 뱃지 + 카운트)
export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: `1px solid ${vars.color.stroke_200}`,
});

export const myStoryBadge = style([
  tx.cap2_sb,
  {
    backgroundColor: vars.color.gray_200,
    color: vars.color.white,
    padding: "4px 10px",
    borderRadius: "6px",
    selectors: {
      [`${lightTheme} &`]: {
        backgroundColor: vars.color.gray_300,
        color: vars.color.black,
      },
    },
  },
]);

export const metaBadgeGroup = style([
  tx.cap1_rg,
  {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: vars.color.gray_400,
  },
]);

export const metaItem = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
});

// 2번째 툴바 (폴더 추가 + 정렬)
export const subToolbar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 16px 6px",
});

export const addFolderButton = style({
  display: "flex",
  alignItems: "center",
  background: "none",
  border: "none",
  color: vars.color.stroke_main_100,
  cursor: "pointer",
  padding: 0,
});

export const sortButton = style({
  display: "flex",
  alignItems: "center",
  background: "none",
  border: "none",
  color: vars.color.gray_400,
  cursor: "pointer",
  padding: 0,
  ":hover": {
    color: vars.color.white,
  },
});

export const content = style({
  flex: 1,
  overflowY: "auto",
  padding: "4px 12px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",

  "::-webkit-scrollbar": {
    width: "4px",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: vars.color.stroke_300,
    borderRadius: "2px",
  },
});

export const sectionTitle = style([
  tx.cap1_rg,
  {
    color: vars.color.gray_500,
    padding: "4px 6px 4px",
  },
]);

export const treeList = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const treeItem = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 6px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.2s ease",

  ":hover": {
    backgroundColor: vars.color.gray_200,
  },
});

export const treeItemLabel = style([
  tx.cap1_md,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

// 좌측 세로 가이드라인이 있는 하위 노트 목록
export const subNoteList = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginLeft: "14px",
  paddingLeft: "12px",
  borderLeft: `1px solid ${vars.color.stroke_300}`,
  marginTop: "4px",
  marginBottom: "6px",
});

export const subNoteItem = style({
  display: "flex",
  alignItems: "center",
  padding: "6px 8px",
  borderRadius: "4px",
  textDecoration: "none",
  color: vars.color.gray_400,
  transition: "all 0.2s ease",

  ":hover": {
    backgroundColor: vars.color.gray_200,
    color: vars.color.white,
  },
});

export const subNoteTitle = style([
  tx.cap1_rg,
  {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
]);

export const emptySubNote = style([
  tx.cap2_rg,
  {
    padding: "6px 8px",
    color: vars.color.gray_300,
  },
]);

export const divider = style({
  height: "1px",
  backgroundColor: vars.color.stroke_200,
  margin: "4px 0",
});
