import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import * as s from './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 콘텐츠 로딩 시 시각적 플레이스홀더를 제공하는 공통 Skeleton 컴포넌트입니다.
 */
export const Skeleton = ({
  width,
  height,
  borderRadius,
  className,
  style,
  children,
}: SkeletonProps) => {
  return (
    <div
      className={clsx(s.skeleton, className)}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
