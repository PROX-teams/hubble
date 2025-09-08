"use client";

import { ComponentPropsWithRef} from 'react';
import { breadcrumbItemStyle, breadcrumbItemInactiveStyle } from './Breadcrumb.css';
import clsx from "clsx";

interface BreadcrumbItemProps extends ComponentPropsWithRef<"li"> {
  active?: boolean;
}

const BreadcrumbItem = ({ active = false, className,ref, ...props }: BreadcrumbItemProps) => (
  <li
    ref={ref}
    className={clsx(breadcrumbItemStyle, active && breadcrumbItemInactiveStyle, className)}
    {...props}
  />
)
BreadcrumbItem.displayName = "BreadcrumbItem"

export default BreadcrumbItem
