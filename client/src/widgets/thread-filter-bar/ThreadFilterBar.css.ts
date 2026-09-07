import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const filterSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const filterRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
});

export const tagFilterRow = style({
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  paddingBottom: '4px',
  flex: 1,
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const dropdown = style([
  tx.t2_rg,
  {
    width: '160px',
  }
]);

export const tagElement = style({
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s ease-in-out',
  selectors: {
    '&:hover': {
      borderColor: vars.color.stroke_main_100,
    },
  },
});

export const activeTagElement = style({
  backgroundColor: vars.color.main,
  borderColor: vars.color.stroke_main_100,
});
