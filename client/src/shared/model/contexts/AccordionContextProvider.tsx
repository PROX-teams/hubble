"use client";

import { createContext, PropsWithChildren } from 'react';
import { useToggle } from '../hooks/useToggle';

export interface AccordionContextProps {
  isOpen: boolean;
  toggle: () => void;
}

export const AccordionContext = createContext<AccordionContextProps>({
  isOpen: false,
  toggle: () => {},
});

interface AccordionContextProviderProps extends PropsWithChildren {
  defaultOpen?: boolean;
}

function AccordionContextProvider({ children, defaultOpen = false }: AccordionContextProviderProps) {

    const{ isOpen, toggle} = useToggle(defaultOpen);


    return (
      <AccordionContext.Provider value={{ isOpen, toggle }}>
        {children}
      </AccordionContext.Provider>
    );
}

export {AccordionContextProvider}