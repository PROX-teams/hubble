import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const panelContainer = style({
  width: '382px',
  height: '100%',
  minHeight: '600px',
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  flexShrink: 0,
  overflow: 'hidden',

  '@media': {
    'screen and (max-width: 1024px)': {
      width: '100%',
      minHeight: 'auto',
    },
  },
});

export const listWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  overflowY: 'auto',
  flex: 1,
  boxSizing: 'border-box',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE/Edge
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none', // Chrome/Safari 회색띠 완전 제거
    },
  },
});

export const emptyState = style([
  tx.b2_160_rg,
  {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 16px',
    color: vars.color.gray_400,
    textAlign: 'center',
    backgroundColor: vars.color.gray_100,
    borderRadius: '12px',
    border: `1px dashed ${vars.color.stroke_300}`,
  },
]);

export const retryButton = style({
  padding: '8px 14px',
  color: vars.color.white,
  backgroundColor: vars.color.stroke_main,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
});
