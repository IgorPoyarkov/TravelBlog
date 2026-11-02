import { create } from "zustand";

interface PageState {
  currentRef: HTMLElement | null;
  setCurrentRef: (element: HTMLElement | null) => void;
}

export const usePageStore = create<PageState>((set) => ({
  currentRef: null,
  setCurrentRef: (element) => set({ currentRef: element }),
}));
