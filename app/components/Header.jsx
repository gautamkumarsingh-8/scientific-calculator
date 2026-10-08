
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  ["Calculator", "/#calculator", true],
  ["How It Works", "/#how", false],
  ["FAQ", "/#faq", false],
];

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !darkMode;

    setDarkMode(nextTheme);

    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
      }}
      className="
        sticky top-0 z-50
        border-b border-slate-200/70
        bg-white/90
        backdrop-blur-xl
        transition-colors duration-300

        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      <div
        className="
          mx-auto flex max-w-6xl
          items-center justify-between
          gap-3
          px-3 py-3
          sm:px-6
        "
      >

        {/* ================= LOGO ================= */}

        <Link
          href="/"
          className="
            flex shrink-0
            items-center gap-2
          "
        >
          <span
            className="
              grid h-9 w-9
              place-items-center
              rounded-xl
              bg-blue-600
              text-white
              shadow-md
              shadow-blue-600/30

              sm:h-10 sm:w-10
            "
          >
            <Calculator className="h-5 w-5" />
          </span>

          <span
            className="
              text-lg
              font-extrabold
              tracking-tight
              text-slate-900

              sm:text-2xl

              dark:text-white
            "
          >
            CALC<span className="text-blue-600">POCKET</span>
          </span>
        </Link>

        {/* ================= RIGHT SIDE ================= */}

        <div
          className="
            flex
            items-center
            gap-2

            sm:gap-4
            lg:gap-8
          "
        >

          {/* ================= NAVIGATION ================= */}

          <nav
            className="
              hidden
              items-center
              gap-6
              text-sm
              font-medium
              text-slate-600

              md:flex
              lg:gap-8

              dark:text-slate-300
            "
          >
            {NAV.map(([label, href, active]) => (
              <Link
                key={label}
                href={href}
                className={
                  active
                    ? `
                      border-b-2
                      border-blue-600
                      pb-1
                      text-blue-600
                    `
                    : `
                      pb-1
                      transition-colors
                      hover:text-blue-600
                      dark:hover:text-blue-400
                    `
                }
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ================= PRIVATE BADGE ================= */}

          <div
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-2.5
              py-1.5
              text-[10px]
              font-bold
              text-emerald-700
              whitespace-nowrap

              sm:px-3
              sm:text-xs

              dark:border-emerald-900
              dark:bg-emerald-950/60
              dark:text-emerald-400
            "
          >
            <ShieldCheck
              className="
                h-4 w-4
                shrink-0
                fill-emerald-500
                text-white

                sm:h-4.5
                sm:w-4.5
              "
            />

            <span>100% Private</span>
          </div>

          {/* ================= THEME BUTTON ================= */}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-xl

              border
              border-slate-200
              bg-slate-100
              text-slate-700

              shadow-sm

              transition-all
              duration-200

              hover:scale-105
              hover:bg-slate-200

              sm:h-10
              sm:w-10

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-yellow-300
              dark:hover:bg-slate-700
            "
          >
            <motion.div
              key={darkMode ? "moon" : "sun"}
              initial={{
                rotate: -90,
                scale: 0,
              }}
              animate={{
                rotate: 0,
                scale: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 15,
              }}
            >
              {darkMode ? (
                <Moon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              )}
            </motion.div>
          </button>

        </div>
      </div>
    </motion.header>
  );
}

