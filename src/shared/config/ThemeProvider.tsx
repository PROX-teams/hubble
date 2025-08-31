"use client";

import { useState } from "react";
import { Theme } from "../types/global.types";
import { darkTheme, lightTheme } from "../styles/theme.css";
import * as S from "@/shared/styles/rootLayout.css";

export default function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 임시 다크 모드 상태 관리 (추후 전역 상태로 변경 예정)
  const [theme] = useState<Theme>("dark");

  return (
    <body className={theme === "dark" ? darkTheme : lightTheme}>
      <div className={S.rootLayout}>{children}</div>
    </body>
  );
}
