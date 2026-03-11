import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const container = style({
  width:'100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  minHeight: '100vh',
});

export const tabMenu = style({
  marginBottom: '8px',
});

export const activeTab = style([
  tx.h3_sb,
  {
    color: vars.color.white,
  }
]);

export const inactiveTab = style([
  tx.h3_sb,
  {
    color: vars.color.gray_400,
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        color: vars.color.gray_600,
      },
    },
  }
]);

export const listSection = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '32px',
  minHeight: '500px',
});
