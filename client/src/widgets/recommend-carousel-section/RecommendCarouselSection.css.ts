import { style } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';

export const contentSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '856px',
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
  flexShrink: 0,
});

export const skeletonRow = style({
  display: 'flex',
  gap: '16px',
});

export const skeletonRowWide = style({
  display: 'flex',
  gap: '24px',
});

export const emptyMessage = style([
  tx.b1_rg,
  {
    color: vars.color.gray_500,
    padding: '32px 0',
    textAlign: 'center',
  },
]);
