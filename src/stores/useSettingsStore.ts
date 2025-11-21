import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings } from "../types/settings";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { setupZustandStorageSync } from "../utils/zustandSync";

interface SettingsStoreState {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  siteName: "PoS Bakery",
  appName: "PoS Bakery",
  tagline: "Bakery Point of Sales Management",
  businessName: "PoS Bakery",
  ownerName: "",
  lowStockThreshold: 200,
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      updateSettings: (patch) =>
        set({ settings: { ...get().settings, ...patch } }),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: STORAGE_KEYS.settings,
    }
  )
);

// sync antar tab
setupZustandStorageSync(STORAGE_KEYS.settings, useSettingsStore);
