import { useEffect, useRef } from 'react';

type ClickOutsideEvents = Pick<
  WindowEventMap,
  'pointerdown' | 'pointerup' | 'mousedown' | 'mouseup' | 'touchstart' | 'touchend'
>;

interface ClickOutsideOptions {
  onClickOutside: () => void;
  event?: keyof ClickOutsideEvents;
  enabled?: boolean;
}

/**
 * 외부 클릭 이벤트 발생 시 실행할 함수
 * @param {() => void} [onClickOutside] 
 *  외부 클릭 이벤트 종류
 * @param {keyof ClickOutsideEvents} [event]
 * 외부 클릭 감지를 비활성화 여부
 * @param {boolean} [enabled]
 */


export const useClickOutside = <T extends HTMLElement>({
  onClickOutside,
  event = 'pointerdown',
  enabled = false,
}: ClickOutsideOptions) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (enabled) return;
    const handleClickOutside = (e: ClickOutsideEvents[typeof event]) => {

      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside();
      }
    };
    window.addEventListener(event, handleClickOutside, { capture: true });

    return () => {
      window.removeEventListener(event, handleClickOutside, { capture: true });
    };
  }, [onClickOutside, event, enabled]);

  return ref;
};
