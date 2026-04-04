"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { getTheme, setTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme"; // export type Theme ด้วย
import { Button } from "../ui/button";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  function handleToggle() {
    const next: Theme =
      theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
    setTheme(next);
    setThemeState(next);
  }

  return (
    <Button
      variant={"ghost"}
      className="text-muted-foreground h-8 w-8 rounded-full"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {theme === "dark" && <Moon className="h-4 w-4" />}
      {theme === "light" && <Sun className="h-4 w-4" />}
      {theme === "system" && <Monitor className="h-4 w-4" />}
    </Button>
  );
}
