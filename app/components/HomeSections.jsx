
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ban,
  Calculator,
  Check,
  ChevronDown,
  HelpCircle,
  Infinity as Inf,
  ShieldHalf,
  Smartphone,
  Zap,
} from "lucide-react";

/* =========================================================
   HERO
========================================================= */

export function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 text-center sm:py-10"
    >
      {/* Calculator icon */}
      <span
        aria-hidden="true"
        className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30"
      >
        <Calculator className="h-7 w-7" />
      </span>

      {/* Main SEO heading */}
      <h1
        id="main-heading"
        className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl"
      >
        Free Scientific Calculator Online
      </h1>

      {/* Brand */}
      <p className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        CALC<span className="text-blue-600">POCKET</span>
      </p>

      {/* Supporting description */}
      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
        A fast and easy online scientific calculator for math,
        trigonometry, powers, roots, logarithms, percentages, and
        everyday calculations.
      </p>

      {/* Trust points */}
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-slate-700 dark:text-slate-300">
        {["Fast", "Accurate", "No Signup", "Private"].map((item, index) => (
          <li key={item} className="flex items-center gap-3">
            {index > 0 && (
              <span
                aria-hidden="true"
                className="text-slate-300 dark:text-slate-700"
              >
                •
              </span>
            )}

            <span className="flex items-center gap-1.5 font-medium">
              <Check
                className="h-5 w-5 text-emerald-500"
                strokeWidth={3}
                aria-hidden="true"
              />
              {item}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* =========================================================
   FEATURES
========================================================= */

const FEATURES = [
  {
    icon: Zap,
    bg: "bg-emerald-500",
    title: "Fast & Reliable",
    text: "Get accurate results instantly with a smooth and simple calculator experience.",
  },
  {
    icon: ShieldHalf,
    bg: "bg-blue-600",
    title: "Private Calculations",
    text: "Your calculations are processed in your browser and are not stored on our server.",
  },
  {
    icon: Ban,
    bg: "bg-violet-600",
    title: "No Signup Required",
    text: "Open CALCPOCKET and start calculating immediately. No account is required.",
  },
  {
    icon: Smartphone,
    bg: "bg-amber-500",
    title: "Works on Every Device",
    text: "Use the scientific calculator on desktop, laptop, tablet, or mobile.",
  },
  {
    icon: Inf,
    bg: "bg-teal-500",
    title: "Scientific Functions",
    text: "Calculate trigonometry, logarithms, powers, roots, percentages, constants, and more.",
  },
];

export function Features() {
  return (
    <aside
      id="how"
      aria-labelledby="features-heading"
      className="rounded-3xl bg-blue-50/70 p-6 dark:bg-blue-950/20 sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
        Why CALCPOCKET
      </p>

      <h2
        id="features-heading"
        className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white"
      >
        Powerful. Simple.
        <br />
        Always Free.
      </h2>

      <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
        Your pocket calculator for everyday math and advanced
        calculations.
      </p>

      <motion.ul
        className="mt-6 space-y-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          show: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {FEATURES.map(({ icon: Icon, bg, title, text }) => (
          <motion.li
            key={title}
            variants={{
              hidden: {
                opacity: 0,
                x: 20,
              },
              show: {
                opacity: 1,
                x: 0,
              },
            }}
            className="flex items-center gap-4"
          >
            <span
              aria-hidden="true"
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-full text-white ${bg}`}
            >
              <Icon className="h-6 w-6" />
            </span>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                {text}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </aside>
  );
}

/* =========================================================
   FAQ
========================================================= */

const FAQS = [
  {
    question: "Is CALCPOCKET really free?",
    answer:
      "Yes. CALCPOCKET is a free online scientific calculator. You can use it without creating an account or paying a subscription.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. You can open the calculator and start calculating immediately. No signup or account is required.",
  },
  {
    question: "Is my data safe and private?",
    answer:
      "Calculations are processed in your browser. CALCPOCKET does not require you to submit calculations to an account or save them on a server.",
  },
  {
    question: "What calculations can I perform?",
    answer:
      "You can perform basic arithmetic as well as trigonometry in DEG or RAD mode, logarithms, powers, square roots, percentages, and calculations using constants such as π and e.",
  },
  {
    question: "Can I use the scientific calculator on my phone?",
    answer:
      "Yes. CALCPOCKET is responsive and works on smartphones, tablets, laptops, and desktop computers.",
  },
  {
    question: "Does CALCPOCKET work offline?",
    answer:
      "After the calculator page and its required files have already loaded, the calculation interface can continue working without an active connection. A fresh visit may still require an internet connection to load the website.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto max-w-5xl py-10 text-center"
    >
      {/* FAQ icon */}
      <span
        aria-hidden="true"
        className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-white"
      >
        <HelpCircle className="h-6 w-6" />
      </span>

      <h2
        id="faq-heading"
        className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white"
      >
        Frequently Asked Questions
      </h2>

      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Find answers to common questions about the free scientific
        calculator.
      </p>

      <div className="mt-6 space-y-3 text-left">
        {FAQS.map(({ question, answer }, index) => {
          const isOpen = open === index;

          return (
            <div
              key={question}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() =>
                  setOpen(isOpen ? null : index)
                }
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-slate-800 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800/70"
              >
                <span>{question}</span>

                <motion.span
                  animate={{
                    rotate: isOpen ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-slate-500 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-100 px-5 pt-3 dark:border-slate-800">
                      <p className="pb-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
