'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login } from '@/entities/user/api/auth.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import type { LoginRequest } from '@/entities/user/user.types';
import { PATHS } from '@/shared/constants/paths';

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      // UserInfo 객체 구성 (서버 응답에 따라 조정)
      const userInfo = {
        id: (response as any).id || 0,
        email: (response as any).email || '',
        nickname: (response as any).nickname || '',
      };

      // 1. 유저 정보, 2. 액세스 토큰, 3. 리프레시 토큰 저장
      setAuth(userInfo, response.accessToken, response.refreshToken);
      
      router.push(PATHS.HOME);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });
};
