"use client" 

import { ComponentPropsWithoutRef, useEffect, useContext, useRef } from "react";
import clsx from "clsx";
import * as s from "./Dropdown.css"
import { DropdownContext } from "@/shared/model/contexts/DropdownContextProvider";

const DropdownWrapper = ({ children, className, ...props }: ComponentPropsWithoutRef<"div"> ) => {

  const { isBoxOpen, closeBox} = useContext(DropdownContext);

  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if(!isBoxOpen) return;
    const handleClickOutside = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeBox(); 
      }
    };
    document.addEventListener("pointerdown", handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside,{ capture: true });
    };

  }, [isBoxOpen,closeBox])

  return (
    <div ref={dropdownRef} className={clsx(s.wrapper,className)} {...props}>
      {children}
    </div>
  );
};

export default DropdownWrapper;