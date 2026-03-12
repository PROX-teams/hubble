import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  width: '100%',
  maxWidth: '440px',
  margin: '0 auto',
  padding: '40px 0',
});

export const titleGroup = style({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const title = style([
  tx.h2_sb,
  { color: vars.color.black }
]);

export const description = style([
  tx.b2_160_rg,
  { color: vars.color.gray_500 }
]);

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const inputWithButton = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
});

export const inputWrapper = style({
  flex: 1,
});

export const actionButton = style([
  tx.cap1_md,
  {
    height: '44px',
    padding: '0 16px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.black}`,
    backgroundColor: vars.color.white,
    color: vars.color.black,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    ':disabled': {
      borderColor: vars.color.gray_300,
      color: vars.color.gray_300,
      cursor: 'not-allowed',
    },
    ':hover': {
      backgroundColor: vars.color.gray_100,
    }
  }
]);

export const submitButton = style([
  tx.t1_md,
  {
    height: '52px',
    borderRadius: '8px',
    backgroundColor: vars.color.black,
    color: vars.color.white,
    cursor: 'pointer',
    border: 'none',
    marginTop: '12px',
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

export const helperText = style([
  tx.cap2_rg,
  {
    marginTop: '4px',
    marginLeft: '4px',
  }
]);

export const successText = style({
  color: vars.color.stroke_main_100,
});

export const errorText = style({
  color: vars.color.system_red,
});
