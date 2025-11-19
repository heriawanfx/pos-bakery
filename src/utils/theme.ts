export type Theme = "light" | "dark";

const STORAGE_KEY = "pos-theme";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  // 1. Cek dari localStorage dulu
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  // 2. Kalau belum ada, ikut system preference
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  window.localStorage.setItem(STORAGE_KEY, theme);
}
