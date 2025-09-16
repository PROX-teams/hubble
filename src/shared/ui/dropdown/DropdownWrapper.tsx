"use client" 

import { ComponentPropsWithoutRef, useContext} from "react";
import { DropdownContext } from "@/shared/model/contexts/DropdownContextProvider";
import clsx from "clsx";
import * as s from "./Dropdown.css"
import { useClickOutside } from "@/shared/model/hooks/useClickOutside";

function DropdownWrapper({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {

  const { isBoxOpen, closeBox } = useContext(DropdownContext);

  const dropdownRef = useClickOutside<HTMLDivElement>({
    onClickOutside: () => {
      closeBox();
    },
    enabled: !isBoxOpen,
  })

  return (
    <div ref={dropdownRef} className={clsx(s.dropdownwrapper,className)} {...props}>
      {children}
    </div>
  );
}

export { DropdownWrapper };
