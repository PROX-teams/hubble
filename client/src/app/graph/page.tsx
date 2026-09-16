'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PATHS } from '@/shared/constants/paths';
import * as s from './page.css';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function GraphPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 노드 포인트 초기화 (25개의 미려한 파티클)
    const nodeCount = 28;
    const nodes: NodePoint[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 노드 위치 업데이트 및 렌더링
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // 점 그리기 (에메랄드 글로우)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(62, 207, 142, 0.75)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(62, 207, 142, 0.5)';
        ctx.fill();

        // 인접 노드 간 연결선 그리기
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.35;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(62, 207, 142, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={s.container}>
      {/* 우주 지식 격자 및 백그라운드 발광 오브 */}
      <div className={s.bgGrid} />
      <div className={s.glowOrb} />

      {/* 실시간 노드 네트워크 캔버스 */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* 중앙 프리미엄 글래스모피즘 카드 */}
      <main className={s.glassCard}>
        <div className={s.badge}>
          <span className={s.pulseDot} />
          In Development
        </div>

        <div className={s.headerGroup}>
          <h1 className={s.title}>Knowledge Node Graph</h1>
          <p className={s.subtitle}>
            기록된 생각과 지식이 별자리처럼 서로 연결되는 인터랙티브 노드 그래프 기능이 곧 공개됩니다.
          </p>
        </div>

        {/* 3대 핵심 기능 티저 */}
        <section className={s.featureGrid} aria-label="노드 그래프 주요 기능 티저">
          <div className={s.featureItem}>
            <span className={s.featureIcon} role="img" aria-label="연결">
              🪐
            </span>
            <strong className={s.featureTitle}>노트 간 시각적 연결</strong>
            <p className={s.featureDesc}>태그와 상호 참조를 분석하여 지식의 연결망을 자동 생성합니다.</p>
          </div>

          <div className={s.featureItem}>
            <span className={s.featureIcon} role="img" aria-label="탐색">
              🔍
            </span>
            <strong className={s.featureTitle}>다차원 인사이트 탐색</strong>
            <p className={s.featureDesc}>관련 아이디어와 새로운 크리에이터를 그래프를 통해 직관적으로 발견합니다.</p>
          </div>

          <div className={s.featureItem}>
            <span className={s.featureIcon} role="img" aria-label="확장">
              ⚡
            </span>
            <strong className={s.featureTitle}>실시간 지식 맵</strong>
            <p className={s.featureDesc}>작성한 모든 기록이 실시간으로 전체 지식 생태계로 확장됩니다.</p>
          </div>
        </section>

        {/* 페이지 이동 CTA */}
        <div className={s.buttonGroup}>
          <Link href={PATHS.HOME} className={s.primaryButton}>
            홈 피드로 이동
          </Link>
          <Link href={PATHS.THREAD} className={s.secondaryButton}>
            스레드 둘러보기
          </Link>
        </div>
      </main>
    </div>
  );
}
