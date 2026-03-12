import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserInfo } from '@/entities/user/user.types';

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null; // 추가
  // 액션
  setAuth: (user: UserInfo, accessToken: string, refreshToken: string) => void; // 수정
  clearAuth: () => void;
  updateUser: (user: Partial<UserInfo>) => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => 
        set({ 
          isLoggedIn: true, 
          user, 
          accessToken,
          refreshToken 
        }),

      clearAuth: () => 
        set({ 
          isLoggedIn: false, 
          user: null, 
          accessToken: null,
          refreshToken: null 
        }),

      updateUser: (newUser) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...newUser } : null,
        })),

      setAccessToken: (token) => 
        set({ accessToken: token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 로컬스토리지에는 유저 정보와 리프레시 토큰만 저장합니다.
      // (액세스 토큰은 여전히 메모리에만 둡니다.)
      partialize: (state) => ({ 
        user: state.user, 
        isLoggedIn: state.isLoggedIn,
        refreshToken: state.refreshToken
      }),
    }
  )
);
