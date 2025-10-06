import type { Metadata } from "next";
import "@/shared/styles/global.css";
import ThemeProvider from "@/shared/config/ThemeProvider";
import { GNBNav } from "@/shared/ui/gnb-nav/GNBNav";

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
          <GNBNav/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
