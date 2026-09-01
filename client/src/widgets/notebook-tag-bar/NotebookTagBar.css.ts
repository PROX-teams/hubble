import { style } from '@vanilla-extract/css';
import { vars, lightTheme } from '@/shared/styles/theme.css';

export const tagBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  overflowX: 'auto',
  paddingBottom: '4px',
  width: '100%',
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
  flexShrink: 0,
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
