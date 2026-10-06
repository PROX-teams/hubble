import { style, styleVariants } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';

const baseContentSection = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
} as const;

export const contentSection = styleVariants({
  compact: {
    ...baseContentSection,
    width: '638px',
  },
  full: {
    ...baseContentSection,
    width: '1030px',
  },
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

export const carouselWrapper = styleVariants({
  compact: {
    width: '638px',
    flexShrink: 0,
  },
  full: {
    width: '1030px',
    flexShrink: 0,
  },
});

export const skeletonRow = style({
  display: 'flex',
  width: '100%',
});

export const emptyMessage = style([
  tx.b1_rg,
  {
    color: vars.color.gray_500,
    padding: '32px 0',
    textAlign: 'center',
  },
]);
