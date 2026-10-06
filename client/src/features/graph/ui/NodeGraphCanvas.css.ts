import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const canvasContainer = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '600px',
  backgroundColor: vars.color.black,
  borderRadius: '16px',
  border: `1px solid ${vars.color.stroke_200}`,
  overflow: 'hidden',
  boxSizing: 'border-box',
  userSelect: 'none',
});

export const svg = style({
  width: '100%',
  height: '100%',
  display: 'block',
  cursor: 'grab',
  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
  },
});

// 1. 연결선 (Link) 상태별 스타일 클래스
export const linkBase = style({
  transition: 'stroke-opacity 0.3s ease, stroke 0.3s ease',
  pointerEvents: 'none',
});

export const linkHighlighted = style([
  linkBase,
  {
    stroke: vars.color.stroke_main_100,
    strokeWidth: 1.8,
    strokeOpacity: 0.9,
  },
]);

export const linkDefault = style([
  linkBase,
  {
    stroke: vars.color.stroke_300,
    strokeWidth: 1.0,
    strokeOpacity: 0.25,
  },
]);

// 2. 노드 그룹 (Node Group) 상태별 스타일 클래스
export const nodeGroup = style({
  cursor: 'pointer',
  transition: 'opacity 0.3s ease',
  opacity: 1,
});

// 3. 노드 원형 (Node Circle) 상태별 스타일 클래스
export const nodeCircleBase = style({
  transition: 'all 0.2s ease',
});

export const nodeCircleActive = style([
  nodeCircleBase,
  {
    fill: '#368A64',
    stroke: '#48A37A',
    strokeWidth: 1.0,
  },
]);

export const nodeCircleDefault = style([
  nodeCircleBase,
  {
    fill: '#2B2D33',
    stroke: 'rgba(255, 255, 255, 0.06)',
    strokeWidth: 1.0,
  },
]);

export const nodeCircleSelected = style([
  nodeCircleBase,
  {
    fill: '#368A64',
    stroke: vars.color.stroke_main_100,
    strokeWidth: 2.5,
    filter: `drop-shadow(0 0 10px ${vars.color.stroke_main_100})`,
  },
]);

// 4. 노드 라벨 (Node Label) 상태별 스타일 클래스
export const nodeLabelBase = style({
  pointerEvents: 'none',
  userSelect: 'none',
  textAnchor: 'middle',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.9)',
  letterSpacing: '-0.01em',
});

export const nodeLabelActive = style({
  fill: vars.color.white,
  fontWeight: '600',
});

export const nodeLabelDefault = style({
  fill: vars.color.gray_400,
  fontWeight: '400',
});

export const rootNodeLabel = style([
  nodeLabelBase,
  nodeLabelActive,
  {
    fontSize: '14px',
  },
]);

export const level2NodeLabel = style([
  nodeLabelBase,
  {
    fontSize: '11px',
  },
]);

export const level3NodeLabel = style([
  nodeLabelBase,
  {
    fontSize: '10px',
  },
]);

export const emptyContainer = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  textAlign: 'center',
  zIndex: 5,
});

export const emptyTitle = style([
  tx.b1_rg,
  {
    color: vars.color.gray_400,
  },
]);

export const expansionStatus = style({
  position: 'absolute',
  left: '16px',
  bottom: '16px',
  padding: '8px 12px',
  color: vars.color.gray_400,
  backgroundColor: 'rgba(20, 22, 26, 0.92)',
  border: `1px solid ${vars.color.stroke_300}`,
  borderRadius: '8px',
  fontSize: '12px',
});
