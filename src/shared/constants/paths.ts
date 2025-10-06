import type { Route } from "next";
export const route = (s: string) => s as Route;

export const PATHS = {
  ROOT: route("/"),
  HOME: route("/"),

  AUTH_LOGIN: route("/auth/login"),
  AUTH_SIGNUP: route("/auth/signup"),

  NOTEBOOK: route("/notebook"),
  NOTEBOOK_NEW: route("/notebook/new"),
  NOTEBOOK_DETAIL: (id: string | number): Route => `/notebook/${id}`,
  NOTEBOOK_EDIT:   (id: string | number): Route => `/notebook/${id}/edit`,

  DASHBOARD: route("/dashboard"),
  GRAPH: route("/graph"),
  THREAD: route("/thread"),

  STORYBOOK: route("/storybook"),
  SEARCH: route("/search")
  
} as const;