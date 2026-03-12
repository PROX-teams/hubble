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

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
