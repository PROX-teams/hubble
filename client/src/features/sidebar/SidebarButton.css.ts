import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const button = style({
  position: 'fixed',
  top: '56px',
  right: '20px',
  width: '32px',
  height: '32px',
  zIndex: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  padding: 0,
  borderRadius: '6px',
  cursor: 'pointer',
  color: vars.color.gray_500,
  flexShrink: 0,
  transition: 'color 0.2s, background-color 0.2s',
  ':hover': {
    color: vars.color.gray_700,
    backgroundColor: vars.color.gray_100,
  },
});
