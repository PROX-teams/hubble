import { style } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';

export const pageContainer = style({
  display: 'flex',
  flexDirection: 'column',
});

export const contentSection = style([
  {
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
]);

export const sectionHeader = style({
  display: 'flex',
  marginBottom: '8px',
});

export const sectionTitle = style([
  tx.h3_sb, // 공통 타이포그래피 스타일 활용
  {
    color: vars.color.gray_700,
  }
]);

export const carouselWrapper = style({
  width: '856px',
});
