import { HTMLAttributes } from "react";
import { TabMenuContextProvider } from "@/shared/model/contexts/TabMenuContext";
import { TabItem, TabList } from "./Menu";
import { TabPanel, TabPanels } from "./Panel";

/**
 * @example
 * <Tab>
 *   <Tab.List>
 *    <Tab.Item tabIndex={0} activeStyle={S.active}>Tab 1</Tab.Item>
 *    <Tab.Item tabIndex={1} activeStyle={S.active}>Tab 2</Tab.Item>
 *  </Tab.List>
 *  <Tab.Panels>
 *    <Tab.Content tabIndex={0}>Content 1</Tab.Content>
 *    <Tab.Content tabIndex={1}>Content 2</Tab.Content>
 *  </Tab.Panels>
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
  List: TabList,
  Item: TabItem,
  Panels: TabPanels,
  Panel: TabPanel,
});
