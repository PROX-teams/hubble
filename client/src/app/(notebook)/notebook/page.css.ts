import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  width: '100%',
  maxWidth: '1360px',
  margin: '0 auto',
  padding: '40px 60px 40px 100px',
  boxSizing: 'border-box',
  minHeight: '100vh',
});

export const editorWrapper = style({
  maxWidth: '800px',
  margin: '0 auto',
  width: '100%',
  padding: '40px 20px',
});
