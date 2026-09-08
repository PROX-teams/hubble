import { style } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';

export const bannerContainer = style({
  position: 'relative',
  width: '100%',
  height: '240px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px',
  overflow: 'hidden',
  
  '@media': {
    'screen and (max-width: 768px)': {
      height: '250px',
    },
  },
});
export const bannerImage = style({
  objectFit: 'cover',
  filter: 'brightness(0.7)', // 글씨가 잘 보이도록 이미지를 약간 어둡게 처리
});

export const contentWrapper = style({
  position: 'absolute',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const title = style([
  tx.h2_sb,
  {
    color: vars.color.white,
    display: 'inline-block',
    width: 'fit-content',
    transformOrigin: 'left center', // 왼쪽 끝을 축으로 설정   
    transition: 'transform 0.3s ease-in-out', 
    selectors: {
      "&:hover": {
        transform: 'scale(1.05)'
      },
    },

}]);
