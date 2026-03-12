import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

export const container = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: '60px 20px',
  color: vars.color.white,
});

export const header = style({
  marginBottom: '40px',
  borderBottom: `1px solid ${vars.color.stroke_200}`,
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
  color: vars.color.gray_400,
});

export const author = style({
  fontWeight: '600',
  color: vars.color.gray_600,
});

export const content = style({
  fontSize: '18px',
  lineHeight: '1.8',
  color: vars.color.gray_700,
  marginBottom: '60px',
});

// Tiptap 콘텐츠 스타일링
globalStyle(`${content} ul`, {
  listStyleType: 'disc !important',
  paddingLeft: '24px',
  margin: '16px 0',
});

globalStyle(`${content} ol`, {
  listStyleType: 'decimal !important',
  paddingLeft: '24px',
  margin: '16px 0',
});

globalStyle(`${content} li`, {
  marginBottom: '8px',
});

globalStyle(`${content} p`, {
  marginBottom: '20px',
});

globalStyle(`${content} h1, ${content} h2, ${content} h3`, {
  marginTop: '40px',
  marginBottom: '20px',
  fontWeight: '700',
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '40px',
  paddingTop: '30px',
  borderTop: `1px solid ${vars.color.stroke_200}`,
});

export const loadingContainer = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  fontSize: '18px',
  color: vars.color.gray_400,
});
