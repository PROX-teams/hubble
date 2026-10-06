import { style } from '@vanilla-extract/css';
import { vars, lightTheme } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const container = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  padding: '40px 180px 60px 0',
  boxSizing: 'border-box',
  minHeight: '100vh',

  '@media': {
    'screen and (max-width: 1280px)': {
      padding: '40px 80px 60px 0',
    },
    'screen and (max-width: 768px)': {
      padding: '24px 20px 40px 0',
    },
  },
});

export const headerSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
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

export const pageSubtitle = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const tabMenu = style({
  marginBottom: '8px',
});

export const listSection = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '32px',
  minHeight: '500px',
});
