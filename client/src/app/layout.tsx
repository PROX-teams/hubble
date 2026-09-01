'use client'

import dynamic from "next/dynamic";
import localFont from "next/font/local";
import "@/shared/styles/global.css";
import ThemeProvider from "@/shared/config/ThemeProvider";
import QueryProvider from "@/shared/api/QueryProvider";
import { GNBNav } from "@/shared/ui/gnb/gnb-nav/GNBNav";
import { HeaderGnb } from "@/widgets/header-gnb/HeaderGnb"; // 추가
import { useSearchModalStore } from "@/features/search/search-contents/model/useSearchModalStore";
import { SearchContents } from "@/features/search/search-contents/ui/SearchContents";
import * as s from "@/shared/styles/rootLayout.css";
import { darkTheme } from "@/shared/styles/theme.css";

// 폰트 최적화 설정
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

// Modal 컴포넌트를 SSR 없이 동적으로 로드합니다.
const Modal = dynamic(() => import("@/shared/ui/modal/modal/Modal"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { isOpen, openSearch, closeSearch } = useSearchModalStore();

  return (
    <html lang="ko" className={`${darkTheme} ${pretendard.variable}`}>
      <body className={pretendard.className}>
        <QueryProvider>
          <ThemeProvider>
            <HeaderGnb />
            <GNBNav onSearchClick={openSearch} />
            <main className={s.rootLayout}>
              {children}
            </main>
            {isOpen && (
              <Modal
                hide={closeSearch}
                hideOnClickOutside={true}
              >
                <SearchContents />
              </Modal>
            )}
            <div id="modalRoot" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
