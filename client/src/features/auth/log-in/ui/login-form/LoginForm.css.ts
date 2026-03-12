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
  tx.t2_md,
  {
    width:"452px",
    
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
  color: vars.color.white,
  textDecoration: 'none',
  marginLeft: '8px',
  ':hover': {
    textDecoration: 'underline',
  }
});
