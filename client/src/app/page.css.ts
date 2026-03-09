import { style } from '@vanilla-extract/css';
import { tx } from '@/shared/styles/textStyle.css';
import { vars } from '@/shared/styles/theme.css';

export const pageContainer = style({
  display: 'flex',
  gap: '64px',
  flexDirection: 'row',
});


export const firstcontainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '62px',
});


export const container = style({
  display: 'flex',
  flexDirection: 'row',
});

export const contentSection = style([
  {
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
]);

export const sectionHeader = style({
  display: 'flex',
});

export const sectionTitle = style([
  tx.h3_sb, // 공통 타이포그래피 스타일 활용
  {
    color: vars.color.gray_700,
  }
]);

export const carouselWrapper = style({
  width: '856px',
});

export const buttonGroup = style({

})


{/* 크리에이터 카드 */}

export const creatorsSection = style({
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',

  

})

export const creatorsWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'

})

export const divider = style({
    width: '100%',             // 가로로 길게 뻗도록
    height: '1px',            // 두께는 1px
    backgroundColor: vars.color.gray_200, // 색상 적용
    border: 'none', 
    margin: '48px 0'  
})