import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const pageContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  width: '100%',
  padding: '40px 180px 60px 0',
  boxSizing: 'border-box',
  overflowX: 'hidden',

  '@media': {
    'screen and (max-width: 1280px)': {
      padding: '40px 80px 60px 0',
    },
    'screen and (max-width: 768px)': {
      padding: '24px 20px 40px 0',
    },
  },
});

export const middleSection = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '64px',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '1030px',
});

export const divider = style({
  width: '100%',
  maxWidth: '1030px',
  height: '1px',
  backgroundColor: vars.color.gray_200,
  border: 'none',
  margin: '6px 0',
});