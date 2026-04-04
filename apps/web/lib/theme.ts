export type Theme = "light" | "dark" | "system";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) ?? "system";
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

export function initTheme() {
  const stored = localStorage.getItem("theme") as Theme | null;

  if (stored === "dark" || stored === "light") {
    document.documentElement.setAttribute("data-theme", stored);
    return;
  }

  // system preference
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute(
    "data-theme",
    systemDark ? "dark" : "light",
  );

  // listen for system preference changes
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
