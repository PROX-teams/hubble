import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type TabMenuState = number;
type TabMenuDispatchState = Dispatch<SetStateAction<TabMenuState>>;

export const TabMenuContext = createContext<TabMenuState | undefined>(
  undefined
);
export const TabMenuDispatchContext = createContext<
  TabMenuDispatchState | undefined
>(undefined);

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

export const useTabMenuContext = () => {
  const context = useContext(TabMenuContext);

  if (context === undefined) {
    throw new Error(
      "useTabMenuContext는 TabMenuContextProvider 내부에서 사용되어야 합니다."
    );
  }

  return context;
};

export const useTabMenuDispatchContext = () => {
  const context = useContext(TabMenuDispatchContext);

  if (context === undefined) {
    throw new Error(
      "useTabMenuDispatchContext는 TabMenuContextProvider 내부에서 사용되어야 합니다."
    );
  }

  return context;
};
