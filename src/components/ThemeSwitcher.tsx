import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "sakura" | "forest" | "midnight";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("blog-theme") as Theme;
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "sakura", "forest", "midnight");
    root.classList.add(newTheme);
    setTheme(newTheme);
    localStorage.setItem("blog-theme", newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-2">
          {theme === "dark" || theme === "midnight" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-2">
        <DropdownMenuItem onClick={() => applyTheme("light")}>
          ☀️ Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("dark")}>
          🌙 Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("sakura")}>
          🌸 Sakura
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("forest")}>
          🌲 Forest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("midnight")}>
          🌌 Midnight
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
