import { HTMLAttributes } from "react";
import { useTabMenuContext } from "@/shared/model/contexts/TabMenuContext";

/**
 * 탭 콘텐츠 아이템들을 감싸는 래퍼 컴포넌트입니다.
 * @param {React.ReactNode} children - 탭 콘텐츠 아이템들
 * @param {string} [className] - 추가적인 CSS 클래스
 */
export function TabPanels({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={className}>{children}</div>;
}

/**
 * 개별 탭 콘텐츠 아이템 컴포넌트입니다. 활성화된 탭의 index와 일치할 때만 렌더링됩니다.
 * @param {number} tabIndex - 탭의 고유 인덱스
 * @param {React.ReactNode} children - 탭 콘텐츠 내용
 * @param {string} [className] - 추가적인 CSS 클래스
 */
export function TabPanel({
  tabIndex,
  children,
  className,
}: HTMLAttributes<HTMLDivElement> & { tabIndex: number }) {
  const activeTab = useTabMenuContext();

  return tabIndex === activeTab ? (
    <div className={className}>{children}</div>
  ) : null;
}
