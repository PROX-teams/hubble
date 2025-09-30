import { HTMLAttributes, useContext } from "react";
import {
  ToggleGroupContext,
  ToggleGroupDispatchContext,
} from "@/shared/model/contexts/ToggleGroupContext";

/**
 * 클릭 가능한 개별 토글 그룹 아이템 컴포넌트입니다.
 * @param {string} value - 탭의 고유 값으로 탭 메뉴에 텍스트로 표시됩니다. 클릭 시 이 값으로 활성 탭이 변경됩니다.
 * @param {string} [className] - 추가적인 CSS 클래스
 * @param {string} [children] - 탭 메뉴에 표시될 텍스트 또는 요소
 */

export interface ToggleGroupItemProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "children"> {
  value: string;
  children?: React.ReactNode | ((isSelected: boolean) => React.ReactNode);
}

export function ToggleGroupItem({
  value,
  className,
  children,
}: ToggleGroupItemProps) {
  const selectedValue = useContext(ToggleGroupContext);
  const onValueChange = useContext(ToggleGroupDispatchContext);

  const isSelected = selectedValue === value;

  const handleOnClick = () => {
    onValueChange?.(value);
  };

  return (
    <button className={className} onClick={handleOnClick}>
      {typeof children === "function"
        ? children(isSelected)
        : children ?? value}
    </button>
  );
}
