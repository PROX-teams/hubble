import { HTMLAttributes } from "react";
import {
  ToggleGroupContextProvider,
  ToggleGroupDispatchState,
  ToggleGroupState,
} from "@/shared/model/contexts/ToggleGroupContext";
import { ToggleGroupItem } from "./Item";

/**
 * @example
 *
 */

export interface ToggleGroupRootProps extends HTMLAttributes<HTMLDivElement> {
  /* 현재 선택된 아이템의 고유 값 */
  value: ToggleGroupState;

  /* 아이템 선택 시 호출될 콜백 함수 */
  onValueChange: ToggleGroupDispatchState;
  children: React.ReactNode;
  className?: string;
}

// 토글 그룹과 관련된 하위 컴포넌트를 포함하는 루트 컴포넌트입니다.
function ToggleGroupRoot({
  value,
  onValueChange,
  children,
  className,
}: ToggleGroupRootProps) {
  return (
    <ToggleGroupContextProvider value={value} onValueChange={onValueChange}>
      <div className={className}>{children}</div>
    </ToggleGroupContextProvider>
  );
}

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});
