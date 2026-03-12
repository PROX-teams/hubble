import { style } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';


export const container = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', 
    minHeight: 'calc(100vh - 48px)',
    paddingBottom: '100px',
    width: '100%',
    margin: '0 auto',  
});

export const titleContainer = style({
  display: 'flex',
  flexDirection: 'column',
});

export const title = style([
  tx.m1_bd,
  {
    color: vars.color.white
  }]);


export const subTitle = style([
  tx.t1_rg,
  {
    color: vars.color.gray_500
  }]);


