import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const header = style({
  position: 'fixed',
  top: '48px',
  left: '312px',
  width: 'calc(100% - 312px)',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1.25rem',
  zIndex: 5,
  backgroundColor: 'transparent',
});

export const actionsWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginRight: '36px',
});

export const storyButton = style({
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  transition: 'color 0.15s ease',
  ':hover': {
    color: vars.color.stroke_main_100,
    textDecoration: 'underline',
  },
});
