import { style } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';

export const pageContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  width: '100%',
});

export const middleSection = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '40px',
  alignItems: 'flex-start',
  width: '100%',
});

export const contentSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const sectionHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const sectionTitle = style([
  tx.h3_sb,
  {
    color: vars.color.gray_700,
  },
]);

export const buttonGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const carouselWrapper = style({
  width: '856px',
});

export const creatorsSection = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const creatorsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const divider = style({
  width: '100%',
  height: '1px',
  backgroundColor: vars.color.gray_200,
  border: 'none',
  margin: '48px 0',
});