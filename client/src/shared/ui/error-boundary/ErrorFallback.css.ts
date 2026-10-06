import { style } from '@vanilla-extract/css';

export const fallbackContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 16px',
  minHeight: '200px',
  textAlign: 'center',
  gap: '12px',
  borderRadius: '8px',
  backgroundColor: '#fafafa',
  border: '1px dashed #e0e0e0',
  width: '100%',
  boxSizing: 'border-box',
});

export const errorTitle = style({
  fontSize: '15px',
  fontWeight: 600,
  color: '#333333',
  margin: 0,
});

export const errorMessage = style({
  fontSize: '13px',
  color: '#777777',
  margin: 0,
  lineHeight: 1.5,
  maxWidth: '280px',
  wordBreak: 'keep-all',
});

export const retryButton = style({
  marginTop: '8px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#ffffff',
  backgroundColor: '#2563eb',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#1d4ed8',
  },
  ':active': {
    backgroundColor: '#1e40af',
  },
});
