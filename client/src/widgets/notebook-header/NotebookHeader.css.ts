import { style } from '@vanilla-extract/css';
import { vars, lightTheme } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const pageTitle = style([
  tx.h2_sb,
  {
    color: vars.color.white,
    selectors: {
      [`${lightTheme} &`]: {
        color: vars.color.black,
      },
    },
  },
]);

export const noteCount = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const actionsSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const actionButton = style({
  whiteSpace: 'nowrap',
});
