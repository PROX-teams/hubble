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
  gap: '18px',
  color: vars.color.gray_400,
  marginRight: '32px'
});

export const metaItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: 'none',
  color: vars.color.gray_400,
});

export const metaIcon = style({
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: 'none',
  color: vars.color.gray_400,
  transition: 'all 0.2s ease-in-out',
  ':hover': {

    color: vars.color.gray_700,
  }
});

export const activeLike = style({
  color: vars.color.system_red,
  transition: 'all 0.2s ease-in-out',
});

export const activeBookmark = style({
  color: vars.color.stroke_main_100, 
  transition: 'all 0.2s ease-in-out',
});
