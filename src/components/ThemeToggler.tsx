"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // avoid hydration mismatch

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      variant="ghost"
      className={`${isDark ? "bg-sidebar-background text-white" : "bg-sidebar-background text-black"} hover:opacity-90`}
    >
      {isDark ? <Sun className="size-6" /> : <Moon className="size-6" />}
    </Button>
  );
};

export default ThemeToggler;
