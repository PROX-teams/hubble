import { useEffect } from 'react';

interface UsePreventNavigationOptions {
  /** 변경사항이 존재하여 보호가 필요한지 여부 (기본값: true) */
  isDirty?: boolean;
  /** 사용자에게 표시할 경고 메시지 */
  message?: string;
}

/**
 * Next.js App Router 환경에서 내부 링크 클릭 및 브라우저 창 닫기 시 이탈을 방지하는 가드 훅 (A-1)
 * 1. beforeunload: 브라우저 탭 닫기, 새로고침 차단
 * 2. click event capturing: GNB 링크나 페이지 내 <a> 태그 클릭을 가로채 확인 대화상자 노출
 */
export const usePreventNavigation = ({
  isDirty = true,
  message = '작성 중인 내용이 있습니다. 페이지를 벗어나시겠습니까?',
}: UsePreventNavigationOptions = {}) => {
  useEffect(() => {
    if (!isDirty) return;

    // 1. 브라우저 닫기/새로고침 가드
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    // 2. 내부 <a> 태그 클릭 가로채기 (App Router 클라이언트 라우팅 방어)
    const handleClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // 앵커 링크(#), 외부 링크(http), 새 탭(target="_blank")이 아닌 경우에만 가로챔
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        anchor.target !== '_blank'
      ) {
        const confirmLeave = window.confirm(message);
        if (!confirmLeave) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClickCapture, true);
    };
  }, [isDirty, message]);
};
