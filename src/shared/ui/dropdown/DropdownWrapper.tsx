"use client" 

import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import * as s from "./Dropdown.css"
import { useClickOutside } from "@/shared/model/hooks/useClickOutside";

function DropdownWrapper({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {

  const dropdownRef = useClickOutside()

  return (
    <div ref={dropdownRef} className={clsx(s.wrapper,className)} {...props}>
      {children}
    </div>
  );
}

export { DropdownWrapper };
