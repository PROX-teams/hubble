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
      // UserInfo 객체 구성 (서버 응답에 포함된 필드 매핑)
      const userInfo = {
        id: response.id,
        email: response.email,
        nickname: response.nickname,
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
