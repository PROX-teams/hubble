import { HTMLAttributes, useContext } from "react";
import clsx from "clsx";
import {
  ToggleGroupContext,
  ToggleGroupDispatchContext,
} from "@/shared/model/contexts/ToggleGroupContext";

/**
 * 클릭 가능한 개별 토글 그룹 아이템 컴포넌트입니다.
 * @param {string} value - 탭의 고유 값으로 탭 메뉴에 텍스트로 표시됩니다. 클릭 시 이 값으로 활성 탭이 변경됩니다.
 * @param {string} [className] - 추가적인 CSS 클래스
 * @param {string} [activeStyle] - 활성화된 탭에 적용될 추가적인 CSS 클래스
 */

export interface ToggleGroupItemProps
  extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  activeStyle?: string;
}

export function ToggleGroupItem({
  value,
  className,
  activeStyle,
}: ToggleGroupItemProps) {
  const selectedValue = useContext(ToggleGroupContext);
  const onValueChange = useContext(ToggleGroupDispatchContext);

  const isSelected = selectedValue === value;

  const handleOnClick = () => {
    onValueChange?.(value);
  };

  return (
    <button
      className={clsx(className, isSelected && activeStyle)}
      onClick={handleOnClick}
    >
      {value}
    </button>
  );
}
