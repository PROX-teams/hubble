'use client';

import React from 'react';
import type { FallbackProps } from './ErrorBoundary';
import * as s from './ErrorFallback.css';

interface DefaultErrorFallbackProps extends FallbackProps {
  title?: string;
  message?: string;
}

/**
 * 에러 발생 시 노출되는 기본 Fallback UI 컴포넌트
 */
export const ErrorFallback = ({
  error,
  resetErrorBoundary,
  title = '문제가 발생했습니다',
  message,
}: DefaultErrorFallbackProps) => {
  const displayMessage =
    message || error?.message || '일시적인 오류가 발생했습니다. 다시 시도해 주세요.';

  return (
    <div className={s.fallbackContainer} role="alert" aria-live="assertive">
      <h3 className={s.errorTitle}>{title}</h3>
      <p className={s.errorMessage}>{displayMessage}</p>
      <button
        type="button"
        className={s.retryButton}
        onClick={resetErrorBoundary}
      >
        다시 시도
      </button>
    </div>
  );
};

export default ErrorFallback;
