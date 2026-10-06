'use client';

import { Component, ReactNode, ErrorInfo, ComponentType } from 'react';

export interface FallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

export interface CustomError extends Error {
  code?: string;
  status?: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorBoundaryProps {
  FallbackComponent: ComponentType<FallbackProps>;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: ReactNode;
}

/**
 * 런타임 크래시 및 화이트아웃(Whiteout) 방지 ErrorBoundary
 * - 컴포넌트 렌더링 중 예외 발생 시 상위 전파를 차단하고 Fallback UI로 대체
 * - 에러 성격(NOT_FOUND, 시스템 에러 vs 비즈니스 에러)에 따른 분기 지원
 * - onReset 콜백을 통한 React Query 캐시 리셋 연동 지원
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };

    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const customError = error as CustomError;

    // 1. 404 에러 (NOT_FOUND): 전용 안내 또는 Not-Found 대응
    if (customError.code === 'NOT_FOUND' || customError.status === 404) {
      return { hasError: true, error };
    }

    // 2. 시스템 에러 (네트워크 에러, 런타임 예외, 파싱 에러 등): Fallback UI 전환
    const isSystemError =
      !customError.code ||
      customError.code === 'NETWORK_ERROR' ||
      customError.code === 'PARSE_ERROR' ||
      (customError.status !== undefined && customError.status >= 500);

    if (isSystemError) {
      return { hasError: true, error };
    }

    // 3. 그 외 경미한 비즈니스 에러는 컴포넌트 트리를 깨뜨리지 않음
    return { hasError: false, error: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 외부 로거/모니터링(Sentry 등)으로 전달 가능하도록 콜백 실행
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('[ErrorBoundary caught an error]:', error, errorInfo);
    }
  }

  /** 에러 상태 초기화 및 부모 onReset(예: React Query 캐시 리셋) 실행 */
  resetErrorBoundary(): void {
    if (this.props.onReset) {
      this.props.onReset();
    }

    this.setState({
      hasError: false,
      error: null,
    });
  }

  render() {
    const { state, props } = this;
    const { hasError, error } = state;
    const { FallbackComponent, children } = props;

    if (hasError && error) {
      return (
        <FallbackComponent
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
