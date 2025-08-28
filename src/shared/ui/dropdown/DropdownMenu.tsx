import { HTMLAttributes, useContext } from "react";
import { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { DropdownContext } from "@/shared/model/dropdown/contexts/DropdownContextProvider";
import * as S from "./Dropdown.css";

type MenuVariant = RecipeVariants<typeof S.menu>;
type Placement = NonNullable<MenuVariant>['placement'];

interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  placement?: Placement;
  independent?: boolean;
}

export default function DropdownMenu({
  children,
  className,
  independent,
  placement = "left",
  ...props
}: DropdownMenuProps) {

  const { isBoxOpen } = useContext(DropdownContext);
  const isOpen = independent ?? isBoxOpen;

  return isOpen ? (
    <div className={clsx(S.menu({ placement }), className)} {...props}>
      {children}
    </div>
  ) : null;
}

export { DropdownMenu };