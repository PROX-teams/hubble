'use client'

import dynamic from "next/dynamic";
import "@/shared/styles/global.css";
import { vars } from "@/shared/styles/theme.css";
import ThemeProvider from "@/shared/config/ThemeProvider";
import QueryProvider from "@/shared/api/QueryProvider";
import { GNBNav } from "@/shared/ui/gnb/gnb-nav/GNBNav";
import useModal from "@/shared/model/hooks/useModal";
import { SearchContents } from "@/features/search/search-contents/ui/SearchContents";
import * as s from "@/shared/styles/rootLayout.css";

// Modal 컴포넌트를 SSR 없이 동적으로 로드합니다.
const Modal = dynamic(() => import("@/shared/ui/modal/modal/Modal"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { openModal, isOpen, closeModal } = useModal();

  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ThemeProvider>
            {/*상단 GNB 임시 */}
            <div style={{ width: "100%", position: "sticky", background: vars.color.black, zIndex: 100, top: 0, height:"48px", borderBottom: `1px solid ${vars.color.gray_200}`, marginBottom: "48px"}}/>
            <GNBNav onSearchClick={openModal} />
            <main className={s.rootLayout}>
              {children}
            </main>
            {isOpen && (
              <Modal
                hide={closeModal}
                hideOnClickOutside={true}
              >
                <SearchContents />
              </Modal>
            )}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
