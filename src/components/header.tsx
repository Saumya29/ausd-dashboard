"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-border flex-shrink-0">
            <Image
              src="/ausd-logo.jpg"
              alt="AUSD logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-foreground font-sans">
              AUSD
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground font-sans">
              by Agora
            </span>
          </div>
          {/* Divider + page title */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-muted-foreground font-sans tracking-wide uppercase">
              Dashboard
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.agora.finance/product/ausd"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-sans"
          >
            agora.finance
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
