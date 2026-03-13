import { useState } from "react";

export const useToggle = (initialValue: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialValue);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    toggle, 
  };
};