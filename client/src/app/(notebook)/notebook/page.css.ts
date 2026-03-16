import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  padding: '40px 20px',
});

export const editorWrapper = style({
  maxWidth: '800px',
  margin: '0 auto',
  width: '100%',
});
