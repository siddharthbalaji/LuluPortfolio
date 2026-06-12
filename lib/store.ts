import { create } from "zustand";
import type { Media } from "./media";

type LightboxItem = Media & { kind: "image" | "video" };

interface UIState {
  lightbox: LightboxItem | null;
  open: (item: LightboxItem) => void;
  close: () => void;
}

export const useUI = create<UIState>((set) => ({
  lightbox: null,
  open: (item) => set({ lightbox: item }),
  close: () => set({ lightbox: null }),
}));
