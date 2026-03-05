import type { Metadata } from "next";
import "@/shared/styles/global.css";
import { vars } from "@/shared/styles/theme.css";
import ThemeProvider from "@/shared/config/ThemeProvider";
import { GNBNav } from "@/shared/ui/gnb/gnb-nav/GNBNav";
import * as s from "@/shared/styles/rootLayout.css";

export const metadata: Metadata = {
  title: "PROX",
  description: "IT 직군을 위한 성장형 컨텐츠 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>
          {/*상단 GNB 임시 */}
          <div style={{ width: "100%",position: "sticky", background: vars.color.black, zIndex: 100, top: 0, height:"48px", borderBottom: `1px solid ${vars.color.gray_200}`, marginBottom: "48px"}}/>
          <GNBNav/>
          <main className={s.rootLayout}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
