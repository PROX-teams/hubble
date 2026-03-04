import { createVar, style } from '@vanilla-extract/css';

export const visibleCountVar = createVar();

export const carouselContainer = style({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
});

export const carouselTrack = style({
  display: 'flex',
  width: '100%',
});

export const carouselItem = style({
  flex: `0 0 calc(100% / ${visibleCountVar})`,
  boxSizing: 'border-box',
});
