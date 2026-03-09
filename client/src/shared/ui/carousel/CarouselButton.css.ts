import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  color: vars.color.stroke_200,

  ':hover': {
    color: vars.color.gray_400,
  },

  ':active': {
    transform: 'scale(0.95)',
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});
