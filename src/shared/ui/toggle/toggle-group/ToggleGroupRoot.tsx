import { HTMLAttributes } from "react";
import {
  ToggleGroupContextProvider,
  ToggleGroupDispatchState,
  ToggleGroupState,
} from "@/shared/model/contexts/ToggleGroupContext";
import { ToggleGroupItem } from "./Item";

/**
 * @example
 *  // 부모 컴포넌트(예: Page)에서 상태를 관리하고,
 *  // ToggleGroup의 값(value)과 상태 변경 함수(onValueChange)를 props로 전달합니다.
 * export default function ThreadsPage() {
 *  const [category, setCategory] = useState<string>("기획");
 *
 *  return (
 *   <>
 *     // ToggleGroup은 다른 UI 요소들과 독립적으로 존재합니다.
 *     <ToggleGroup
 *       value={category}
 *       onValueChange={setCategory}
 *       type="sidebar"
 *     >
 *       <ToggleGroup.Item value="기획" />
 *       <ToggleGroup.Item value="디자인" />
 *       <ToggleGroup.Item value="프로그래밍" />
 *     </ToggleGroup>
 *
 *    // ToggleGroup의 상태와 무관한 다른 컴포넌트
 *    <SortButton />
 *    {category === "기획" && <div>기획 페이지</div>}
 *    {category === "디자인" && <div>디자인 페이지</div>}
 *    {category === "프로그래밍" && <div>프로그래밍 페이지</div>}
 *    </>
 *  );
 * }
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
