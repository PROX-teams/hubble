import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

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
