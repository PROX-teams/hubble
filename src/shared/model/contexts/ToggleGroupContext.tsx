import { createContext, Dispatch, SetStateAction, useContext } from "react";

/* 타입 정의 */
export type ToggleGroupState = string;
export type ToggleGroupDispatchState = Dispatch<
  SetStateAction<ToggleGroupState>
>;

/* 컨텍스트 생성 */
export const ToggleGroupContext = createContext<ToggleGroupState | undefined>(
  undefined
);
export const ToggleGroupDispatchContext = createContext<
  ToggleGroupDispatchState | undefined
>(undefined);

/* 프로바이더 컴포넌트 */
export function ToggleGroupContextProvider({
  value,
  onValueChange,
  children,
}: {
  children: React.ReactNode;
  value: ToggleGroupState;
  onValueChange: ToggleGroupDispatchState;
}) {
  return (
    <ToggleGroupContext.Provider value={value}>
      <ToggleGroupDispatchContext.Provider value={onValueChange}>
        {children}
      </ToggleGroupDispatchContext.Provider>
    </ToggleGroupContext.Provider>
  );
}

/* 커스텀 훅 */
export const useToggleGroupContext = () => {
  const context = useContext(ToggleGroupContext);

  if (context === undefined) {
    throw new Error(
      "useToggleGroupContext는 ToggleGroupContextProvider 내부에서 사용되어야 합니다."
    );
  }

  return context;
};

export const useToggleGroupDispatchContext = () => {
  const context = useContext(ToggleGroupDispatchContext);

  if (context === undefined) {
    throw new Error(
      "useToggleGroupDispatchContext는 ToggleGroupContextProvider 내부에서 사용되어야 합니다."
    );
  }

  return context;
};
