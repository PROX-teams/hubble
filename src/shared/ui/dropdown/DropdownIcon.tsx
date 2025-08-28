import SelectIcon from "@/shared/assets/icons/common/select.svg";
import { ComponentProps } from "react";
import clsx from "clsx";
import * as S from "./Dropdown.css";

export const DropdownIcon = ({ children, className, ...props }: ComponentProps<"span">) => {
  return (
    <span className={clsx(S.icon, className)} {...props}>
      {children ?? <SelectIcon />}
    </span>
  );
};