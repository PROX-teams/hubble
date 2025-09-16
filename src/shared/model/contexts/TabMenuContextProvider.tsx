import { createContext, Dispatch, SetStateAction, useState } from "react";

type TabMenuState = number;
type TabMenuDispatchState = Dispatch<SetStateAction<TabMenuState>>;

export const TabMenuContext = createContext<TabMenuState>(0);
export const TabMenuDispatchContext = createContext<TabMenuDispatchState>(
  () => {}
);

export function TabMenuContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabMenuState>(0);

  return (
    <TabMenuContext.Provider value={activeTab}>
      <TabMenuDispatchContext.Provider value={setActiveTab}>
        {children}
      </TabMenuDispatchContext.Provider>
    </TabMenuContext.Provider>
  );
}
