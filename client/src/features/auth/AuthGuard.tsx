import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/entities/user/model/useAuthStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Zustand persist가 localStorage에서 상태를 복원할 때까지 대기
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    // 하이드레이션이 완료된 시점에 비로소 로그인 여부를 정확히 판정
    if (hasHydrated && !isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.replace('/login');
    }
  }, [hasHydrated, isLoggedIn, router]);

  // 하이드레이션 이전이거나 로그인이 안 된 경우 렌더링 방지
  if (!hasHydrated || !isLoggedIn) return null;
  return <>{children}</>;
}