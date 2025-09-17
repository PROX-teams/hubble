import { HTMLAttributes } from "react";
import { TabMenuContextProvider } from "@/shared/model/contexts/TabMenuContext";
import { TabMenu, TabMenus } from "./Menu";
import { TabContent, TabContents } from "./Content";

/**
 * @example
 * 탭 메뉴에 따라 컨텐츠 렌더링 예시
 * <Tab>
 *   <Tab.Menus>
 *    <Tab.Menu tabIndex={0} activeStyle={S.active}>Tab 1</Tab.Menu>
 *    <Tab.Menu tabIndex={1} activeStyle={S.active}>Tab 2</Tab.Menu>
 *  </Tab.Menus>
 *  <Tab.Contents>
 *    <Tab.Content tabIndex={0}>Content 1</Tab.Content>
 *    <Tab.Content tabIndex={1}>Content 2</Tab.Content>
 *  </Tab.Contents>
 * </Tab>
 */

// 탭 메뉴와 관련된 하위 컴포넌트를 포함하는 루트 컴포넌트입니다.
function TabMenuRoot({ children, className }: HTMLAttributes<HTMLDivElement>) {
  return (
    <TabMenuContextProvider>
      <div className={className}>{children}</div>
    </TabMenuContextProvider>
  );
}

export const Tab = Object.assign(TabMenuRoot, {
  Menus: TabMenus,
  Menu: TabMenu,
  Contents: TabContents,
  Content: TabContent,
});
