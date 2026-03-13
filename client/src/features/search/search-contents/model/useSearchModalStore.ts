import { create } from "zustand";

interface SearchModalState {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

/**
 * 검색 모달의 열림/닫힘 상태를 관리하는 전역 스토어
 */
export const useSearchModalStore = create<SearchModalState>((set) => ({
  isOpen: false,
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false }),
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),
}));
