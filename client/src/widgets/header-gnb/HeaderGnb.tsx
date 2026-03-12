"use client";

import Link from "next/link";
import { useAuthStore } from "@/entities/user/model/useAuthStore";
import Avatar from "@/entities/user/ui/avatar/Avatar";
import Button from "@/shared/ui/button/button/Button";
import { PATHS } from "@/shared/constants/paths";
import LogoIcon from "@/shared/assets/logo/logo.svg";
import * as S from "./HeaderGnb.css";

export function HeaderGnb() {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <header className={S.header}>
      {/* 좌측: 로고 */}
      <Link href={PATHS.ROOT} className={S.logoLink}>
        <LogoIcon/>
      </Link>

      {/* 우측: 인증 섹션 */}
      <div className={S.authSection}>
        {isLoggedIn && user ? (
          <Avatar 
            size={32} 
            userId={user.id} 
            src={user.profileImageUrl} 
            name={user.nickname} 
          />
        ) : (
          <Button 
            as={Link} 
            href={PATHS.AUTH_LOGIN} 
            variants="colored" 
            size="sm"
          >
            로그인
          </Button>
        )}
      </div>
    </header>
  );
}
