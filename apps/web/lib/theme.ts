import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) ?? "system";
}

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");

  useEffect(() => {
    // initial value
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") as "light" | "dark";
    if (current) setThemeState(current);

    // observer
    const observer = new MutationObserver(() => {
      const updated = root.getAttribute("data-theme") as "light" | "dark";
      if (updated) setThemeState(updated);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

export function setTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "system") {
    localStorage.removeItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.setAttribute("data-theme", systemDark ? "dark" : "light");
  } else {
    localStorage.setItem("theme", theme);
    root.setAttribute("data-theme", theme);
  }
}
// ... rest of initTheme stays the same ...
export function initTheme() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("theme") as Theme | null;

  if (stored === "dark" || stored === "light") {
    document.documentElement.setAttribute("data-theme", stored);
    return;
  }

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute(
    "data-theme",
    systemDark ? "dark" : "light",
  );

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.setAttribute(
          "data-theme",
          e.matches ? "dark" : "light",
        );
      }
    });
}
