import { style } from '@vanilla-extract/css';

export const trigger = style({
  width: '100%',
  height: '20px',
  pointerEvents: 'none',
});

export const hiddenTrigger = style({
  width: '100%',
  height: '0px',
  pointerEvents: 'none',
});
