"use client" 

import { ComponentPropsWithoutRef, useContext} from "react";
import { DropdownContext } from "@/shared/model/contexts/DropdownContextProvider";
import clsx from "clsx";
import * as s from "./Dropdown.css"
import { useHideOnClickOutside } from "@/shared/model/hooks/useHideOnClickOutside";

function DropdownWrapper({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {

  const { isBoxOpen, closeBox } = useContext(DropdownContext);

  const dropdownRef = useHideOnClickOutside<HTMLDivElement>({
    onClickOutside: () => {
      closeBox();
    },
    disabled: !isBoxOpen,
  })

  return (
    <div ref={dropdownRef} className={clsx(s.dropdownwrapper,className)} {...props}>
      {children}
    </div>
  );
}

export { DropdownWrapper };
