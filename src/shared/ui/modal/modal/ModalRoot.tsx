import { useEffect, useRef } from "react";

// NutationObserver 객체 설정
const mutationObserverOption: MutationObserverInit = {
  childList: true, // 감시 대상의 직계 자식 노드 변화(추가 또는 제거) 감지 여부
  subtree: false, // 감시 대상의 손자 노드 변화 감지 여부
};

const ModalRoot = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: MutationObserver;

    if (ref.current) {
      observer = new MutationObserver(() => {
        // DOM 변화 감지 시 실행될 콜백
        const size = ref.current?.childNodes.length || 0;
        document.body.classList.toggle("no-scroll", size > 0);
      });
      // 어떤 대상을 어떤 옵션으로 감시할지 설정 후 감시 시작
      observer.observe(ref.current, mutationObserverOption);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div id="modalRoot" ref={ref} />;
};

export default ModalRoot;
