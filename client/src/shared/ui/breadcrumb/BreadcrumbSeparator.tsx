import { ComponentProps } from "react";
import clsx from "clsx";
import { breadcrumbSeparatorStyle } from "./Breadcrumb.css";
import SeparatorIcon from "@/shared/assets/icons/common/separator.svg";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<"span">) => (
  <span className={clsx(breadcrumbSeparatorStyle, className)} {...props}>
    {children ?? <SeparatorIcon />}
  </span>
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export default BreadcrumbSeparator;