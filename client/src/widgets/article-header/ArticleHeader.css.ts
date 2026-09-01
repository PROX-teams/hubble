import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'fixed',
  top: '48px',
  left: '312px',
  width: 'calc(100% - 312px)',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  padding: '0 1.25rem',
  zIndex: 5,
  backgroundColor: 'transparent',
});
