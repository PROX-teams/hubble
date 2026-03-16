import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const header = style({
  marginBottom: '40px',
  paddingBottom: '30px',
});

export const category = style({
  fontSize: '14px',
  color: vars.color.stroke_main_100,
  fontWeight: '600',
  marginBottom: '12px',
  display: 'inline-block',
});

export const title = style({
  fontSize: '40px',
  fontWeight: '800',
  marginBottom: '20px',
  lineHeight: '1.3',
});

export const meta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '15px',
  marginBottom: '12px',
  color: vars.color.gray_400,
});

export const author = style({
  fontWeight: '600',
  color: vars.color.gray_600,
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});
