import { ComponentPropsWithoutRef, forwardRef } from "react";
import clsx from "clsx";
import * as s from "./SideBar.css";

export interface SidebarProps extends ComponentPropsWithoutRef<"aside"> {
  isSidebarOpen?: boolean;
  position?: "left" | "right";
}

/**
 * SideBar 컴포넌트
 * 
 * @param {boolean} isSidebarOpen - 열림/닫힘 상태
 * @param {"left" | "right"} [position="left"] - 사이드바 위치
 */
export const SideBar = forwardRef<HTMLElement, SidebarProps>(
  ({ isSidebarOpen = false, position = "left", className, children, ...props }, ref) => {
    const baseClass = position === "left" ? s.leftSidebar : s.rightSidebar;
    const transformClass =
      position === "left"
        ? (isSidebarOpen ? s.sidebarTransform.openLeft : s.sidebarTransform.closedLeft)
        : (isSidebarOpen ? s.sidebarTransform.openRight : s.sidebarTransform.closedRight);

    return (
      <aside 
        ref={ref} 
        className={clsx(baseClass, transformClass, className)} 
        {...props}
      >
        {children}
      </aside>
    );
  }
);

SideBar.displayName = "SideBar";
