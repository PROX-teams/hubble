import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const button = style({
  position: 'absolute', // 혹은 필요에 따라 fixed/absolute
  top: 59,
  right:10,
  zIndex: 9999, // 최상단에 위치하게 설정
  cursor: 'pointer',
  color: vars.color.gray_400,
});
