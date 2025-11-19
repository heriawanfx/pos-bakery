import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme, type Theme } from "../utils/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm hover:bg-muted"
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]"
        aria-hidden="true"
      >
        {theme === "light" ? "🌞" : "🌙"}
      </span>
      <span>{theme === "light" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
