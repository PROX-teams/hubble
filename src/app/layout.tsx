import type { Metadata } from "next";
import "@/shared/styles/global.css";
import ThemeProvider from "@/shared/config/ThemeProvider";

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
