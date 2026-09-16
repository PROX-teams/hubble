import { createVar, style } from '@vanilla-extract/css';

export const visibleCountVar = createVar();
export const gutterVar = createVar();

export const carouselContainer = style({
  position: 'relative',
  width: `calc(100% + (${gutterVar} * 2))`,
  margin: `0 calc(-1 * ${gutterVar})`,
  overflow: 'hidden',
});

export const carouselTrack = style({
  display: 'flex',
  width: '100%',
});

export const carouselItem = style({
  flex: `0 0 calc(100% / ${visibleCountVar})`,
  padding: `0 ${gutterVar}`,
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
});
