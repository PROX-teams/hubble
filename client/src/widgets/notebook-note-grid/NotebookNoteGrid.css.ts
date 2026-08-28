import { style } from '@vanilla-extract/css';
import { vars, lightTheme } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  width: '100%',
  maxWidth: '1360px',
  margin: '0 auto',
  padding: '40px 60px 40px 100px',
  boxSizing: 'border-box',
});

export const headerSection = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const pageTitle = style([
  tx.h2_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const noteCount = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const sortSection = style({
  display: 'flex',
  alignItems: 'center',
});

export const filterBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  overflowX: 'auto',
  paddingBottom: '4px',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const tagItem = style({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderRadius: '20px',
  padding: '6px 14px',
  selectors: {
    '&:hover': {
      borderColor: vars.color.stroke_200,
    },
  },
});

export const activeTagItem = style({
  borderColor: vars.color.main,
  backgroundColor: vars.color.gray_300,
  selectors: {
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.gray_100,
      borderColor: vars.color.main,
    },
  },
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px',
  width: '100%',

  '@media': {
    'screen and (max-width: 1100px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    'screen and (max-width: 720px)': {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
});

export const emptyState = style([
  tx.b1_rg,
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
    color: vars.color.gray_400,
    width: '100%',
  },
]);
