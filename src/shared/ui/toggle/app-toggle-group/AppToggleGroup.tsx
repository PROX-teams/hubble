import clsx from "clsx";
import { ToggleGroupItemProps } from "../toggle-group/Item";
import {
  ToggleGroup,
  ToggleGroupRootProps,
} from "../toggle-group/ToggleGroupRoot";
import { Children, cloneElement, isValidElement } from "react";
import * as S from "./AppToggleGroup.css";

/*
 * `type` prop에 따라 `AppToggleGroup`의 스타일 variant을 결정합니다.
 *
 * - page: 페이지 본문용 기본 스타일
 * - sidebar: 사이드바용 컴팩트 스타일
 */
export type ToggleGroupType = "page" | "sidebar";

// 토글 그룹 루트 컴포넌트
function AppToggleGroupRoot({
  type = "page",
  children,
  ...props
}: ToggleGroupRootProps & { type?: ToggleGroupType }) {
  // AppToggleGroupItem 컴포넌트에 "type" prop을 자동으로 주입
  // 외부에서 Item 컴포넌트에 일일이 type을 지정하지 않아도 됨
  const itemsWithInjectedProps = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === AppToggleGroupItem) {
      // 원본 child는 유지하면서 type prop만 새로 주입하여 반환
      return cloneElement(child, { type } as Partial<
        ToggleGroupItemProps & { type: ToggleGroupType }
      >);
    }

    return child;
  });

  return (
    <ToggleGroup className={clsx(S.typeVariants.root[type])} {...props}>
      {itemsWithInjectedProps}
    </ToggleGroup>
  );
}

// 토글 그룹 아이템 컴포넌트
function AppToggleGroupItem({
  type = "page",
  ...props
}: ToggleGroupItemProps & { type?: ToggleGroupType }) {
  return (
    <ToggleGroup.Item
      className={clsx(S.typeVariants.item[type])}
      activeStyle={S.typeVariants.active[type]}
      {...props}
    />
  );
}

export const AppToggleGroup = Object.assign(AppToggleGroupRoot, {
  Item: AppToggleGroupItem,
});
