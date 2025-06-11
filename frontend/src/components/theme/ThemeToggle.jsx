import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

/**
 * Componente para cambiar entre modo claro y oscuro
 */
function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      className={`px-3 flex items-center space-x-2 ${className} ${
        isDark ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700" : "bg-white text-slate-800 hover:bg-slate-100"
      }`}
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
    >
      {isDark ? (
        <>
          <Sun className="h-5 w-5" />
          <span>Modo claro</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5" />
          <span>Modo oscuro</span>
        </>
      )}
    </Button>
  );
}

export default ThemeToggle;
