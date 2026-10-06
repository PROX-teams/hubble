import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  maxWidth: '1360px',
  margin: '0 auto',
  minHeight: '100vh',
});

export const editorWrapper = style({
  maxWidth: '800px',
  margin: '0 auto',
  width: '100%',
  paddingTop: '80px',
  paddingBottom: '40px',
  paddingLeft: '20px',
  paddingRight: '20px',
});
