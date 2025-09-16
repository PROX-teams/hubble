"use client"

import { createContext, PropsWithChildren, ReactNode } from "react";
import { useDropdownState } from "@/shared/model/hooks/useDropdownState";

export type DropdownContextType = {
  isBoxOpen: boolean;
  toggleBoxOpen: () => void;
  closeBox: () => void;
  selectedId: number | null;
  selectedOption: ReactNode | null;
  selectOption: (id: number, option: ReactNode) => void; 
};

export const DropdownContext = createContext<DropdownContextType>({
  isBoxOpen: false,
  toggleBoxOpen: () => {},
  closeBox: () => {},
  selectedId: null,
  selectedOption: null,
  selectOption: () => {},
});

function DropdownContextProvider({ children }: PropsWithChildren) {
  const {
    selectedOption,
    selectedId,
    selectOption,
    isBoxOpen,
    toggleBoxOpen,
    closeBox,
  } = useDropdownState<number>();

  return (
    <DropdownContext.Provider
      value={{
        isBoxOpen,
        toggleBoxOpen,
        closeBox,
        selectedOption,
        selectedId,
        selectOption,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}


export { DropdownContextProvider }
