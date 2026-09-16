import { style, globalStyle } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';

export const creatorsSection = style({
  flex: 1,
  minWidth: '240px',
  maxWidth: '360px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const sectionTitle = style([
  tx.h3_sb,
  {
    color: vars.color.gray_700,
  },
]);

export const creatorsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});

globalStyle(`${creatorsWrapper} > *`, {
  width: '100% !important',
  maxWidth: '100% !important',
});

export const emptyMessage = style([
  tx.b1_rg,
  {
    color: vars.color.gray_500,
    padding: '24px 0',
    textAlign: 'center',
  },
]);
