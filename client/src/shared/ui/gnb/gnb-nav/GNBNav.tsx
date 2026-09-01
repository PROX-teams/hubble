"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS_PRIMARY, NAV_ITEMS_SECONDARY } from "@/shared/constants/gnbNav";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import useModal from "@/shared/model/hooks/useModal";
import AuthRequiredModal from "@/shared/ui/modal/auth-modal/AuthRequiredModal";
import Link from "next/link";
import * as S from "./GNBNav.css";

import { PATHS } from "@/shared/constants/paths";

interface GNBNavProps {
  onSearchClick?: () => void;
}

/**
 * GNB 네비게이션 컴포넌트
 *
 * 사이드 네비게이션 바를 렌더링합니다.  
 * 마우스 오버 시 확장되고, 현재 경로에 따라 활성화된 항목을 표시합니다.    
 * [active] 상태는 현재 사이드바가 활성화 됐을때 적용되는 스타일입니다.
 * [current] 상태는 현재 경로와 항목의 `href`가 정확히 일치하는 경우로 적용되는 스타일입니다.
 */

export function GNBNav({ onSearchClick }: GNBNavProps) {
  const pathname = usePathname();
  const [isGnbOpen, setIsGnbOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const { isOpen: isAuthModalOpen, openModal: openAuthModal, closeModal: closeAuthModal } = useModal();

  return (
    <>
      <aside
        className={S.aside({ open: isGnbOpen })}
        onMouseEnter={() => setIsGnbOpen(true)}
        onMouseLeave={() => setIsGnbOpen(false)}
      >
        {NAV_ITEMS_PRIMARY.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          const isSearch = href === PATHS.SEARCH;

          return (
            <Link
              key={href}
              href={href}
              title={!isGnbOpen ? label : undefined}
              className={S.navLink({ active: isGnbOpen, current: isActive })}
              onClick={(e) => {
                if (isSearch && onSearchClick) {
                  e.preventDefault(); // 페이지 이동 방지
                  onSearchClick();    // 모달 열기 함수 실행
                }
              }}
            >
              <Icon className={S.icon} />
              <span className={S.label}>
                {label}
              </span>
            </Link>
          );
        })}
        <div className={S.separator} role="separator" />
        {NAV_ITEMS_SECONDARY.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={!isGnbOpen ? label : undefined}
              className={S.navLink({ active: isGnbOpen, current: isActive })}
              onClick={(e) => {
                // 비로그인 상태에서 개인 작업실 메뉴(Dashboard, StoryBook, NoteBook) 클릭 시 페이지 이동 가로채기
                if (!isLoggedIn) {
                  e.preventDefault();
                  openAuthModal();
                }
              }}
            >
              <Icon className={S.icon} />
              <span className={S.label}>
                {label}
              </span>
            </Link>
          );
        })}
      </aside>

      {/* 비로그인 유저 사이드바 클릭 시 즉시 띄우는 로그인 유도 모달 */}
      {isAuthModalOpen && (
        <AuthRequiredModal hide={closeAuthModal} />
      )}
    </>
  );
}
