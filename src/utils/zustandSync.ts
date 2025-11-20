// src/utils/zustandSync.ts

import type { UseBoundStore, Mutate, StoreApi, StoreMutatorIdentifier } from "zustand";
import type {  } from "zustand";

// Simpel helper untuk sync Zustand + persist antar tab browser.
// Bekerja dengan cara listen event "storage" untuk key LocalStorage tertentu,
// lalu override state store dengan state terbaru dari storage.

const registeredKeys = new Set<string>();

export function setupZustandStorageSync<T>(
  storageKey: string,
  useStore: UseBoundStore<Mutate<StoreApi<T>, [StoreMutatorIdentifier, unknown][]>> // zustand hook (useCategoryStore, useProductStore, dst.)
) {
  if (typeof window === "undefined") return;

  // Hindari double-attach listener (misalnya karena HMR / import berulang)
  if (registeredKeys.has(storageKey)) return;
  registeredKeys.add(storageKey);

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey || !event.newValue) return;

    try {
      const parsed = JSON.parse(event.newValue);

      // Format default dari middleware persist: { state: ..., version: ... }
      if (parsed && typeof parsed === "object" && parsed.state) {
        // true → replace mode, bukan merge incremental
        useStore.setState(parsed.state, true);
      }
    } catch {
      // ignore invalid JSON
    }
  });
}
