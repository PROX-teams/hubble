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

function AccordionContextProvider({ children }: PropsWithChildren) {

    const{ isOpen, toggle} = useToggle();


    return (
      <AccordionContext.Provider value={{ isOpen, toggle }}>
        {children}
      </AccordionContext.Provider>
    );
}

export {AccordionContextProvider}