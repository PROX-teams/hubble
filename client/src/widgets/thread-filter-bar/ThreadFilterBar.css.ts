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

export const tagElement = style([
  tx.cap1_rg,
  {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    color: vars.color.gray_500,
  }
]);

export const activeTagElement = style([
  tagElement,
  {
    fontWeight: 'bold',
    color: vars.color.black,
  },
]);
