
"use client";

import Link from "next/link";
import { Calculator, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return (
    <footer className="mx-auto mt-10 w-full max-w-6xl px-4 pb-8 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/70">

        {/* Top */}
        <div className="flex flex-col items-center justify-between gap-5 px-5 py-5 sm:flex-row sm:px-6">

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Calculator className="h-4 w-4" />
            </span>

            <div>
              <div className="text-sm font-black tracking-[0.12em] text-slate-800 dark:text-white">
                CALC<span className="text-blue-600">POCKET</span>
              </div>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                Simple. Fast. Private.
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/#calculator"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Calculator
            </Link>

            <span className="h-3.5 w-px bg-slate-200 dark:bg-slate-700" />

            <Link
              href="/#how"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              How It Works
            </Link>

            <span className="h-3.5 w-px bg-slate-200 dark:bg-slate-700" />

            <Link
              href="/#faq"
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              FAQ
            </Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 px-5 py-4 text-[11px] sm:flex-row sm:px-6">

          {/* Copyright */}
          <p className="text-slate-400 dark:text-slate-500">
            &copy; {year || "2026"} CALCPOCKET. All rights reserved.
          </p>

          {/* Creator */}
          <p className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            Created with
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            by
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Gautam Singh
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

