"use client";

import { useContext, useEffect, useRef } from "react";
import { DropdownContext } from "../contexts/DropdownContextProvider";

export const useClickOutside = () => {
  const { isBoxOpen, closeBox } = useContext(DropdownContext);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBoxOpen) return;
    const handleClickOutside = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeBox();
      }
    };
    document.addEventListener("pointerdown", handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside, { capture: true });
    };
  }, [isBoxOpen, closeBox]);

  return dropdownRef;
};