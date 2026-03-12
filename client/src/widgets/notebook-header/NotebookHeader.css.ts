import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const header = style({
  position: 'fixed',
  top: "48px",
  left: "312px",
  width: 'calc(100% - 312px)',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1.25rem',
  zIndex: 5,
  backgroundColor: 'transparent',
});

export const metaInfo = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  fontSize: '14px',
  color: vars.color.gray_400,
});

export const metaItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const divider = style({
  width: '1px',
  height: '12px',
  backgroundColor: vars.color.stroke_200,
});
