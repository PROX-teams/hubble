import { useCallback, useState } from "react";

export const useToggle = (initialState = false) => {
  const [isActive, setIsActive] = useState<boolean>(initialState);

  const toggle = useCallback((prev: boolean) => {
    setIsActive(prev);
  }, []);

  return { isActive, setIsActive, toggle };
};
