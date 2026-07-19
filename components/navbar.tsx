"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { navigationLinks } from "@/lib/constants";
import { Logo } from "@/components/logo";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      for (const link of navigationLinks) {
        const section = document.querySelector(link.href);

        if (!section) continue;

        const top = (section as HTMLElement).offsetTop - 120;
        const bottom = top + (section as HTMLElement).offsetHeight;

        if (window.scrollY >= top && window.scrollY < bottom) {
          setActiveLink(link.href);
        }
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
     <header className="fixed top-[52px] left-0 z-50 w-full px-4 lg:px-6">
        <div
          className={`mx-auto flex h-[60px] max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-300 ${
            scrolled
              ? "border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl"
              : "border-white/40 bg-white/80 shadow-xl backdrop-blur-xl"
          }`}
        >
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3">
            <Logo compact mode="dark" size={36} />

            <span className="whitespace-nowrap text-xl font-bold tracking-tight text-slate-900">
              CICA Institute
            </span>
          </Link>

          {/* Navigation */}
          <nav
            className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100/70 p-1"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navigationLinks.map((link) => {
              const active =
                hoveredLink === link.href ||
                (!hoveredLink && activeLink === link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  className="relative px-4 py-1.5 text-sm font-medium"
                >
                  {active && (
                    <motion.span
                      layoutId="navbar-pill"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                      className="absolute inset-0 rounded-full bg-blue-600"
                    />
                  )}

                  <span
                    className={`relative z-10 transition-colors ${
                      active ? "text-white" : "text-slate-700"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
                    {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-slate-100"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <Link
              href="/bms"
              className="rounded-full border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              BMS
            </Link>

            <Link
              href="/admin"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl lg:hidden">
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 transition ${
                    activeLink === link.href
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/bms"
                onClick={() => setMobileOpen(false)}
                className="mt-3 rounded-xl border border-blue-600 px-4 py-3 text-center font-semibold text-blue-600"
              >
                BMS
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}