'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useContext, ComponentPropsWithoutRef } from "react";
import { AccordionContext } from "@/shared/model/accordion/contexts/AccordionContextProvider";
import clsx from "clsx";
import * as S from "@/shared/ui/accordion/Accordion.css";

export const AccordionContent = ({ children, className }: ComponentPropsWithoutRef<'div'>) => {
  const { isOpen } = useContext(AccordionContext);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="accordion-content"
          className={clsx(S.content, className)}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};


