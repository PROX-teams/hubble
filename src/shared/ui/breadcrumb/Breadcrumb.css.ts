import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";
import { style } from '@vanilla-extract/css';

export const breadcrumbStyle = style({
  backgroundColor: 'transfer',
});

export const breadcrumbListStyle = style([
  tx.cap1_rg,
  {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
]);

export const breadcrumbItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  color: vars.color.gray_400,
  cursor: "pointer"
});

export const breadcrumbItemInactiveStyle = style({
  textDecoration: 'none',
  color: vars.color.gray_700,
});


export const breadcrumbSeparatorStyle = style({
  display: 'flex',
  alignItems: 'center',
  color: vars.color.stroke_400
});

