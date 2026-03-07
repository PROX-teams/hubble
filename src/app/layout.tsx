'use client'

import dynamic from "next/dynamic";
import "@/shared/styles/global.css";
import { vars } from "@/shared/styles/theme.css";
import ThemeProvider from "@/shared/config/ThemeProvider";
import { GNBNav } from "@/shared/ui/gnb/gnb-nav/GNBNav";
import useModal from "@/shared/model/hooks/useModal";
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
        <ThemeProvider>
          {/*상단 GNB 임시 */}
          <div style={{ width: "100%",position: "sticky", background: vars.color.black, zIndex: 100, top: 0, height:"48px", borderBottom: `1px solid ${vars.color.gray_200}`, marginBottom: "48px"}}/>
          <GNBNav onSearchClick={openModal} />
          <main className={s.rootLayout}>
            {children}
          </main>
          {isOpen && (
            <Modal
              hide={closeModal}
              hideOnClickOutside={true}
            >
              <div style={{ padding: "20px" }}>
                <h2>검색</h2>
                <input 
                  type="text" 
                  placeholder="검색어를 입력하세요..." 
                  style={{ width: "100%", padding: "10px", marginTop: "10px" }}
                />
              </div>
            </Modal>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

