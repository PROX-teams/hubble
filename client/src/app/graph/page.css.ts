import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

// 펄스 라이트 애니메이션
const pulseAnimation = keyframes({
  '0%': { transform: 'scale(0.95)', opacity: 0.6, boxShadow: '0 0 0 0 rgba(62, 207, 142, 0.7)' },
  '70%': { transform: 'scale(1)', opacity: 1, boxShadow: '0 0 0 10px rgba(62, 207, 142, 0)' },
  '100%': { transform: 'scale(0.95)', opacity: 0.6, boxShadow: '0 0 0 0 rgba(62, 207, 142, 0)' },
});

// 배경 발광 구체 유영 애니메이션
const floatAnimation = keyframes({
  '0%': { transform: 'translate(0px, 0px) scale(1)' },
  '50%': { transform: 'translate(25px, -20px) scale(1.08)' },
  '100%': { transform: 'translate(0px, 0px) scale(1)' },
});

export const container = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 48px)',
  padding: '60px 24px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  width: '100%',
});

// 우주 지식 그리드 배경
export const bgGrid = style({
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    radial-gradient(circle at 50% 40%, rgba(62, 207, 142, 0.08) 0%, transparent 60%),
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
  `,
  backgroundSize: '100% 100%, 48px 48px, 48px 48px',
  pointerEvents: 'none',
  zIndex: 0,
});

// 은은한 글로우 오브
export const glowOrb = style({
  position: 'absolute',
  width: '500px',
  height: '500px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(0, 98, 58, 0.35) 0%, rgba(62, 207, 142, 0.12) 50%, transparent 70%)',
  filter: 'blur(70px)',
  animation: `${floatAnimation} 12s ease-in-out infinite`,
  pointerEvents: 'none',
  zIndex: 0,
});

// 글래스모피즘 메인 카드
export const glassCard = style({
  position: 'relative',
  zIndex: 1,
  maxWidth: '760px',
  width: '100%',
  backgroundColor: 'rgba(23, 23, 23, 0.72)',
  backdropFilter: 'blur(24px)',
  border: `1px solid ${vars.color.stroke_200}`,
  borderRadius: '24px',
  padding: '48px 40px',
  boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '28px',
});

// 개발 중 뱃지
export const badge = style([
  tx.cap1_md,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
    color: vars.color.stroke_main_100,
    border: '1px solid rgba(62, 207, 142, 0.3)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
]);

export const pulseDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: vars.color.stroke_main_100,
  animation: `${pulseAnimation} 2s infinite ease-in-out`,
});

// 헤더 영역
export const headerGroup = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
});

export const title = style([
  tx.h1_sb,
  {
    color: vars.color.white,
    background: `linear-gradient(135deg, ${vars.color.white} 30%, ${vars.color.stroke_main_100} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
]);

export const subtitle = style([
  tx.t1_rg,
  {
    color: vars.color.gray_400,
    maxWidth: '520px',
    lineHeight: 1.6,
  },
]);

// 티저 기능 그리드
export const featureGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  width: '100%',
  marginTop: '8px',
  '@media': {
    'screen and (max-width: 680px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const featureItem = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 16px',
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: `1px solid ${vars.color.stroke_200}`,
  gap: '10px',
  transition: 'border-color 0.2s ease, transform 0.2s ease',
  ':hover': {
    borderColor: 'rgba(62, 207, 142, 0.4)',
    transform: 'translateY(-2px)',
  },
});

export const featureIcon = style({
  fontSize: '28px',
  marginBottom: '2px',
});

export const featureTitle = style([
  tx.t2_sb,
  {
    color: vars.color.white,
  },
]);

export const featureDesc = style([
  tx.cap2_rg,
  {
    color: vars.color.gray_500,
    lineHeight: 1.4,
  },
]);

// 액션 버튼 그룹
export const buttonGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '8px',
});

export const primaryButton = style([
  tx.t2_md,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '10px',
    backgroundColor: vars.color.stroke_main,
    color: vars.color.white,
    textDecoration: 'none',
    transition: 'background-color 0.2s ease, transform 0.15s ease',
    ':hover': {
      backgroundColor: vars.color.stroke_main_100,
      transform: 'translateY(-1px)',
    },
  },
]);

export const secondaryButton = style([
  tx.t2_md,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    border: `1px solid ${vars.color.stroke_300}`,
    color: vars.color.gray_600,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: vars.color.gray_400,
      color: vars.color.white,
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
  },
]);
