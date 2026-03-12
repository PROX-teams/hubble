import type { Route } from "next";
// 문자열을 Next.js Route 타입으로 안전하게 변환하는 헬퍼
export const route = (s: string) => s as Route;

export const PATHS = {
  /* --- 루트 / 홈 --- */
  ROOT: route("/"),
  HOME: route("/"),

  /* --- 회원가입, 로그인 --- */
  AUTH_LOGIN: route("/login"),
  AUTH_SIGNUP: route("/signup"),

  /* --- 노트북 --- */
  NOTEBOOK: route("/notebook"),
  /* --- 노트생성 --- */
  NOTEBOOK_NEW: route("/notebook/new"),
  /* --- 노트상세 --- */
  NOTEBOOK_DETAIL: (id: string | number): Route => `/notebook/${id}`,
  /* --- 노트편집 --- */
  NOTEBOOK_EDIT: (id: string | number): Route => `/notebook/${id}/edit`,

  /* --- 대시보드 --- */
  DASHBOARD: route("/dashboard"),

  /* --- 그래프 --- */
  GRAPH: route("/graph"),

  /* --- 스레드 --- */
  THREAD: route("/thread"),

  /* --- 스토리북 --- */
  STORYBOOK: route("/storybook"),

  /* --- 검색 --- */
  SEARCH: route("/search"),
  
} as const;