import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
});

export const title = style([
  tx.h2_sb,
  {
    textAlign: 'center',
    marginBottom: '8px',
    color: vars.color.black,
  }
]);

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const button = style([
  tx.t1_md,
  {
    height: '52px',
    borderRadius: '8px',
    backgroundColor: vars.color.black,
    color: vars.color.white,
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s ease',
    ':disabled': {
      backgroundColor: vars.color.gray_300,
      cursor: 'not-allowed',
    },
    ':hover': {
      backgroundColor: vars.color.gray_700,
    }
  }
]);

export const linkText = style([
  tx.b2_160_rg,
  {
    textAlign: 'center',
    color: vars.color.gray_500,
    marginTop: '16px',
  }
]);

export const link = style({
  color: vars.color.black,
  fontWeight: 600,
  textDecoration: 'none',
  marginLeft: '8px',
  ':hover': {
    textDecoration: 'underline',
  }
});
