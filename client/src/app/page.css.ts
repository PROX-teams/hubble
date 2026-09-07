import { style, globalStyle } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
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

export const creatorsSection = style({
  flex: 1,
  minWidth: '240px',
  maxWidth: '360px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const creatorsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});

// 크리에이터 카드가 컬럼 너비를 100% 꽉 채우도록 일치
globalStyle(`${creatorsWrapper} > *`, {
  width: '100% !important',
  maxWidth: '100% !important',
});

export const divider = style({
  width: '100%',
  height: '1px',
  backgroundColor: vars.color.gray_200,
  border: 'none',
  margin: '48px 0',
});

export const storyItemWrapper = style({
  padding: '0 12px',
  boxSizing: 'border-box',
  width: '100%',
});