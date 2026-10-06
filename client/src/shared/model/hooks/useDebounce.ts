import { useEffect, useRef, useCallback } from "react";

/**
 * 특정 액션(콜백 함수)의 실행을 디바운싱하여 이벤트 핸들러에서 명시적으로 호출 및 제어할 수 있는 훅 (Action Debounce)
 * @param callback 디바운싱할 콜백 함수
 * @param delay 지연 시간 (ms)
 * @returns { debounced, cancel }
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number = 300
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const debounced = useCallback(
    (...args: Args) => {
      cancel();
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [cancel, delay]
  );

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { debounced, cancel };
}
