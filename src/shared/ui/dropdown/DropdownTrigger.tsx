import { ComponentPropsWithoutRef,useContext } from "react";
import type { RecipeVariants } from "@vanilla-extract/recipes";
import clsx from "clsx";
import { DropdownContext } from "@/shared/model/dropdown/contexts/DropdownContextProvider";
import * as S from "./Dropdown.css";

type TriggerVariants = NonNullable<RecipeVariants<typeof S.trigger>>;
type IconPlacement = NonNullable<TriggerVariants["iconPlacement"]>;
type Variant = NonNullable<TriggerVariants["variant"]>;

interface DropdownTriggerProps extends ComponentPropsWithoutRef<"button">{
  iconPlacement?: IconPlacement;
  variant ?: Variant;
}

function DropdownTrigger({
  iconPlacement = "right",
  variant  = "none",
  className,
  children,
  ...props
}: DropdownTriggerProps) {
  const { toggleBoxOpen } = useContext(DropdownContext);

  const handleClick = () => {
    toggleBoxOpen();
  };

  return (
    <button
      className={clsx(
        S.trigger({ iconPlacement, variant }),
        className
      )}
      onClick={handleClick}
      type="button" 
      {...props}
    >
      {children}
    </button>
  );
}

export { DropdownTrigger };