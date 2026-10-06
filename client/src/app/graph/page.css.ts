import { style } from '@vanilla-extract/css';
import { vars, lightTheme } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const container = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 32px 32px 0',
  boxSizing: 'border-box',
  minHeight: '100vh',

  '@media': {
    'screen and (max-width: 1280px)': {
      padding: '20px 20px 32px 0',
    },
    'screen and (max-width: 768px)': {
      padding: '16px 12px 24px 0',
    },
  },
});

// 1. 상단 전체 헤더 행: 캔버스와 사이드바 각각의 상단 컨트롤을 하나의 수평 바닥선으로 정렬
export const headerRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '24px',
  width: '100%',
  marginBottom: '16px',

  '@media': {
    'screen and (max-width: 1024px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '16px',
    },
  },
});

// 캔버스 상단 헤더 영역 (좌측 타이틀 + 우측 카테고리 탭)
export const mainHeaderArea = style({
  flex: 1,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '16px',
  minWidth: 0,
});

export const titleSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const breadcrumb = style([
  tx.t2_rg,
  {
    color: vars.color.gray_400,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
]);

export const breadcrumbActive = style({
  color: vars.color.white,
  fontWeight: '500',
});

export const title = style([
  tx.h1_sb,
  {
    color: vars.color.white,
    letterSpacing: '-0.02em',
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

// 사이드바 상단 헤더 영역 (우측 정렬 << >> 페이지네이션)
export const sidebarHeaderArea = style({
  width: '382px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  flexShrink: 0,
  paddingBottom: '4px', // 버튼 높이와 타이틀 베이스라인 시각적 균형 보정

  '@media': {
    'screen and (max-width: 1024px)': {
      width: '100%',
    },
  },
});

export const sidebarPaginationGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
});

export const sidebarPaginationBtn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  color: vars.color.gray_400,
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '-1px',
  cursor: 'pointer',
  padding: '6px 8px',
  borderRadius: '6px',
  transition: 'all 0.15s ease',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: vars.color.gray_100,
      color: vars.color.white,
    },
    '&:disabled': {
      opacity: 0.2,
      cursor: 'not-allowed',
    },
  },
});

// 2. 본문 행: 캔버스와 사이드바가 정확히 동일한 수평 윗변 라인에서 시작
export const contentRow = style({
  display: 'flex',
  gap: '24px',
  height: 'calc(100vh - 140px)',
  minHeight: '620px',
  width: '100%',

  '@media': {
    'screen and (max-width: 1024px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  },
});

export const canvasWrapper = style({
  flex: 1,
  height: '100%',
  minHeight: '600px',
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
});

export const canvasState = style({
  width: '100%',
  minHeight: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  color: vars.color.gray_400,
  backgroundColor: vars.color.black,
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: '16px',
});

export const canvasRetryButton = style({
  padding: '8px 14px',
  color: vars.color.white,
  backgroundColor: vars.color.stroke_main,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
});

export const sidebarWrapper = style({
  width: '382px',
  height: '100%',
  flexShrink: 0,

  '@media': {
    'screen and (max-width: 1024px)': {
      width: '100%',
      height: 'auto',
    },
  },
});
