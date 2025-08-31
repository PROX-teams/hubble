import SelectIcon from "@/shared/assets/icons/common/select.svg";
import type { RecipeVariants } from "@vanilla-extract/recipes";
import { ComponentProps } from "react";
import clsx from "clsx";
import * as S from "./Dropdown.css";

type TriggerVariants = NonNullable<RecipeVariants<typeof S.icon>>;
type Side = NonNullable<TriggerVariants["side"]>;

export interface DropdownIconProps extends ComponentProps<"span"> {
  side?: Side;
}

export const DropdownIcon = ({
  children,
  className,
  side,
  ...props
}: DropdownIconProps) => {
  return (
    <span className={clsx(S.icon({ side }), className)} {...props}>
      {children ?? <SelectIcon />}
    </span>
  );
};