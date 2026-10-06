'use client';

import React, { Suspense, ReactNode, ComponentType } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorBoundary, { FallbackProps } from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

export interface AsyncBoundaryProps {
  children: ReactNode;
  /** 에러 발생 시 렌더링할 Fallback 컴포넌트 (미지정 시 기본 ErrorFallback 사용) */
  rejectedFallback?: ComponentType<FallbackProps>;
  /** 비동기 로딩 중 렌더링할 Suspense Fallback (미지정 시 children 즉시 렌더링) */
  pendingFallback?: ReactNode;
  /** 리셋 시 추가로 실행할 콜백 */
  onReset?: () => void;
  /** 에러 로깅/모니터링 핸들러 */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * 선언적 비동기 에러 & 로딩 바운더리 (AsyncBoundary / ErrorHandlingWrapper)
 * 1. QueryErrorResetBoundary: Fallback의 [다시 시도] 클릭 시 React Query 실패 캐시를 즉시 리셋
 * 2. ErrorBoundary: 런타임 에러 상위 전파 차단 및 장애 격리(Fault Isolation)
 * 3. Suspense: 선언적 스켈레톤/로딩 처리 결합
 */
export const AsyncBoundary = ({
  children,
  rejectedFallback: RejectedFallback = ErrorFallback,
  pendingFallback,
  onReset,
  onError,
}: AsyncBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={() => {
            reset();
            onReset?.();
          }}
          onError={onError}
          FallbackComponent={RejectedFallback}
        >
          {pendingFallback ? (
            <Suspense fallback={pendingFallback}>{children}</Suspense>
          ) : (
            children
          )}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default AsyncBoundary;
