import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'fixed',
  top: '48px',
  left: '312px',
  width: 'calc(100% - 312px)',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 3.5rem 0 1.25rem',
  zIndex: 5,
  backgroundColor: 'transparent',
});

export const actionsWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});
