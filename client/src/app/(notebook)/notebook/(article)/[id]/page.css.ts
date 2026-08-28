import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const container = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '60px 20px',
  color: vars.color.white,
});

export const loadingContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  fontSize: '18px',
  color: vars.color.gray_400,
});
