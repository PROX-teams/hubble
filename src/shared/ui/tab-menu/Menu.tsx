import { HTMLAttributes, useContext } from "react";
import clsx from "clsx";
import {
  TabMenuContext,
  TabMenuDispatchContext,
} from "@/shared/model/contexts/TabMenuContextProvider";
import * as S from "./TabMenu.css";

/**
 * 탭 메뉴 아이템들을 감싸는 래퍼 컴포넌트입니다.
 * @param {React.ReactNode} children - 탭 메뉴 아이템들
 * @param {string} [className] - 추가적인 CSS 클래스
 */
export function TabMenus({
  children,
  className,
}: HTMLAttributes<HTMLUListElement>) {
  return <div className={clsx(S.tabMenus, className)}>{children}</div>;
}

/**
 * 클릭 가능한 개별 탭 메뉴 아이템 컴포넌트입니다.
 * @param {number} tabIndex - 탭의 고유 인덱스. 클릭 시 이 index로 활성 탭이 변경됩니다.
 * @param {() => void} [onClick] - 탭 클릭 시 실행될 추가적인 콜백 함수
 * @param {React.ReactNode} children - 탭 메뉴에 표시될 텍스트 또는 요소
 * @param {string} [className] - 추가적인 CSS 클래스
 * @param {string} [activeStyle] - 활성화된 탭에 적용될 추가적인 CSS 클래스
 */
export function TabMenu({
  tabIndex,
  onClick,
  children,
  className,
  activeStyle,
}: HTMLAttributes<HTMLButtonElement> & {
  tabIndex: number;
  onClick?: () => void;
  activeStyle?: string;
}) {
  const activeTab = useContext(TabMenuContext);
  const setActiveTab = useContext(TabMenuDispatchContext);

  const isActive = activeTab === tabIndex;

  const handleOnClick = () => {
    setActiveTab(tabIndex);
    onClick?.();
  };

  return (
    <button
      className={clsx(S.tab, className, isActive && activeStyle)}
      onClick={handleOnClick}
    >
      {children}
    </button>
  );
}
