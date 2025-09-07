import { ComponentPropsWithRef, Children, isValidElement, Fragment, ReactNode } from "react";
import clsx from "clsx";
import { breadcrumbListStyle } from "./Breadcrumb.css";
import BreadcrumbSeparator from "./BreadcrumbSeparator";

interface BreadcrumbListProps extends ComponentPropsWithRef<"ol"> {
  separator?: ReactNode;
}

const BreadcrumbList = ({ children, className, separator, ref, ...props }: BreadcrumbListProps) => {
    const items = Children.toArray(children).filter(isValidElement);
    const lastIndex = items.length - 1;

    return (
      <ol ref={ref} className={clsx(breadcrumbListStyle, className)} {...props}>
        {items.map((item, index) => (
          <Fragment key={index}>
            {item}
            {index < lastIndex && (
              <BreadcrumbSeparator>
                {separator}
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </ol>
    );
  };


BreadcrumbList.displayName = "BreadcrumbList";
export default BreadcrumbList;