import { HTMLAttributes } from "react";
import clsx from "clsx";
import * as S from "./Accordion.css"

export const AccordionWrapper = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement> ) => {
  return (
    <div className={clsx(S.wrapper,className)} {...props}>
      {children}
    </div>
  );
};

