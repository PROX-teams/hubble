'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { reissueToken } from '@/entities/user/api/auth.api';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, refreshToken, setAccessToken, clearAuth } = useAuthStore();
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  const [hasRefreshError, setHasRefreshError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  useEffect(() => queryClient.getQueryCache().subscribe(() => {
    setHasRefreshError(queryClient.getQueryCache().getAll().some(query =>
      query.getObserversCount() > 0 && query.state.status === 'error' && query.state.data !== undefined));
  }), [queryClient]);

  // Silent Refresh 로직
  useEffect(() => {
    const initAuth = async () => {
      // 로그인은 되어 있는데 액세스 토큰이 없는 경우 (새로고침 상황)
      if (isLoggedIn && refreshToken && !useAuthStore.getState().accessToken) {
        try {
          // 서버에 토큰 재발급 요청
          const response = await reissueToken(refreshToken);
          // 새 토큰을 메모리에 저장
          setAccessToken(response.accessToken);
        } catch (error) {
          console.error('인증 복구 실패:', error);
          // 토큰이 만료되었거나 오류 발생 시 강제 로그아웃
          clearAuth();
        }
      }
    };

    initAuth();
  }, [isLoggedIn, refreshToken, setAccessToken, clearAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      {hasRefreshError && (
        <div role="alert" style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 10000, background: '#fff', color: '#222', padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
          최신 내용을 불러오지 못했습니다. 이전 내용이 표시될 수 있습니다.
          <button disabled={retrying} onClick={async () => {
            setRetrying(true);
            try { await queryClient.refetchQueries({ type: 'active', predicate: query => query.state.status === 'error' }); }
            finally { setRetrying(false); }
          }}>{retrying ? '확인 중…' : '다시 불러오기'}</button>
        </div>
      )}
      {children}
    </QueryClientProvider>
  );
}
