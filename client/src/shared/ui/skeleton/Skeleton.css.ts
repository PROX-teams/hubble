import { keyframes, style } from '@vanilla-extract/css';
import { darkTheme, lightTheme, vars } from '@/shared/styles/theme.css';

const shimmer = keyframes({
  '0%': {
    opacity: 0.4,
  },
  '50%': {
    opacity: 0.8,
  },
  '100%': {
    opacity: 0.4,
  },
});

export const skeleton = style({
  borderRadius: '4px',
  animation: `${shimmer} 1.6s ease-in-out infinite`,
  selectors: {
    [`${darkTheme} &`]: {
      backgroundColor: vars.color.gray_200,
    },
    [`${lightTheme} &`]: {
      backgroundColor: vars.color.gray_100,
    },
  },
});
