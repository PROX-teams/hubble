import { style } from '@vanilla-extract/css';
import { vars, lightTheme } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const container = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  paddingTop: '40px',
  minHeight: '100vh',
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
