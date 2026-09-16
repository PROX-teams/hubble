import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const pageContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  width: '100%',
  paddingRight: '40px',
  paddingBottom: '80px',
  boxSizing: 'border-box',
  overflowX: 'hidden',
});

export const middleSection = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '32px',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '1264px',
});

export const divider = style({
  width: '100%',
  height: '1px',
  backgroundColor: vars.color.gray_200,
  border: 'none',
  margin: '6px 0',
});

export const skeletonItemFlex = style({
  flex: 1,
});

export const storyItemWrapper = style({
  boxSizing: 'border-box',
  width: '100%',
});