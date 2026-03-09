"use client";

import { SyntheticEvent, useMemo } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ModalBase } from "@/shared/types/components.types";
import * as S from "./Modal.css";
import { shadowSprinkles } from "@/shared/styles/shadow.css";
import { modalVariants } from "@/shared/lib/animations/modal";

interface ModalProps extends ModalBase {
  hideOnClickOutside?: boolean;
  hide: () => void;
}

/**
 * 공용 모달 컴파운드 컴포넌트입니다.
 * createPortal을 사용하여 `#modalRoot`에 렌더링되며, framer-motion을 통해 애니메이션 효과가 적용됩니다.
 * Modal.Header, Modal.Content, Modal.Footer와 함께 사용됩니다.
 * @param {boolean} [hideOnClickOutside=false] - 배경(dimmed) 클릭 시 모달을 닫을지 여부를 결정합니다.
 * @param {() => void} hide - 모달을 닫는 기능을 수행하는 콜백 함수입니다.
 * @param {ReactNode} children - 모달 내부에 렌더링될 자식 요소들입니다. (Modal.Header, Modal.Content 등)
 * @param {string} [className] - 모달 컨테이너(`modalContainer`)에 적용할 추가 CSS 클래스입니다.
 */

export default function Modal({
  hideOnClickOutside = false,
  hide,
  children,
  className,
}: ModalProps) {
  const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

  const container = useMemo(() => {
    if (typeof document === "undefined") return null; // SSR 여부 확인
    return document.getElementById("modalRoot"); // 브라우저 환경에서만 접근
  }, []);

  if (!container) return null;

  return createPortal(
    <motion.div
      className={S.dimmed}
      onClick={hideOnClickOutside ? hide : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        onClick={stopPropagation}
        className={clsx(
          S.modalContainer,
          shadowSprinkles({ boxShadow: "modal" }),
          className
        )}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {children}
      </motion.div>
    </motion.div>,
    container
  );
}
