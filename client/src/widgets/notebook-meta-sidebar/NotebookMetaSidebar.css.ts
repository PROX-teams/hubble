import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const sidebarContainer = style({
  padding: '24px 16px',
  overflowY: 'auto',
  overflowX: 'hidden',
  height: '100%',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
});

export const sidebarHeader = style({
  display: 'flex',
  alignItems: 'center',
  paddingTop: '16px',
  marginBottom: '16px',
});

export const sidebarTitle = style([
  tx.t1_md,
  {
    color: vars.color.gray_700,
    margin: 0,
  },
]);



export const commentPlaceholder = style({
  padding: '2rem 1rem',
  color: '#9CA3AF',
  textAlign: 'center',
});