import { ComponentType,SVGProps } from "react";
import HomeIcon from "@/shared/assets/icons/gnb-nav/home.svg";
import ThreadIcon from "@/shared/assets/icons/gnb-nav/threads.svg";
import GraphIcon from "@/shared/assets/icons/gnb-nav/node-graph.svg";
import SearchIcon from "@/shared/assets/icons/gnb-nav/search.svg";
import DashboardIcon from "@/shared/assets/icons/gnb-nav/dashboard.svg";
import StoryIcon from "@/shared/assets/icons/gnb-nav/storybook.svg";
import NoteIcon from "@/shared/assets/icons/gnb-nav/notebook.svg";
import { PATHS } from "@/shared/constants/paths";

interface RouteConfig {
  href: typeof PATHS[keyof typeof PATHS];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
};

export const NAV_ITEMS_PRIMARY: RouteConfig[] = [
  { href: PATHS.HOME, icon: HomeIcon, label: "Home" },
  { href: PATHS.THREAD, icon: ThreadIcon, label: "Threads" },
  { href: PATHS.GRAPH, icon: GraphIcon, label: "Node Graph" },
  { href: PATHS.SEARCH, icon: SearchIcon, label: "Search" },
];

export const NAV_ITEMS_SECONDARY: RouteConfig[] = [
  { href: PATHS.DASHBOARD, icon: DashboardIcon, label: "Dashboard" },
  { href: PATHS.STORYBOOK, icon: StoryIcon, label: "Story Book" },
  { href: PATHS.NOTEBOOK, icon: NoteIcon, label: "Note Book" },
];
