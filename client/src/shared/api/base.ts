import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { API_BASE_URL } from './constants';

export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  // Zustand 스토어에서 메모리에 저장된 accessToken을 가져옵니다.
  const { accessToken } = useAuthStore.getState();

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    // 쿠키 기반의 refreshToken 처리를 위해 credentials 옵션을 설정합니다.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `API Error: ${response.status} ${response.statusText}`;
    
    throw new Error(message);
  }

  return response.json();
};
