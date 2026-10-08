
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Delete,
  History,
  Trash2,
  X,
  Copy,
  Check,
} from "lucide-react";

/* =========================================================
   MATH ENGINE
========================================================= */

const FUNCTIONS = ["sin", "cos", "tan", "log", "ln"];

function tokenize(expression) {
  const tokens = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    if (char === " ") {
      i++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let raw = "";

      while (
        i < expression.length &&
        /[0-9.]/.test(expression[i])
      ) {
        raw += expression[i];
        i++;
      }

      if (
        (raw.match(/\./g) || []).length > 1 ||
        raw === "."
      ) {
        throw new Error("Invalid number");
      }

      tokens.push({
        type: "number",
        value: Number(raw),
      });

      continue;
    }

    if ("+-−×÷*/^%()".includes(char)) {
      const map = {
        "−": "-",
        "×": "*",
        "÷": "/",
      };

      tokens.push({
        type: "op",
        value: map[char] || char,
      });

      i++;
      continue;
    }

    if (char === "π") {
      tokens.push({
        type: "number",
        value: Math.PI,
      });

      i++;
      continue;
    }

    if (char === "e") {
      tokens.push({
        type: "number",
        value: Math.E,
      });

      i++;
      continue;
    }

    if (char === "√") {
      tokens.push({
        type: "func",
        value: "sqrt",
      });

      i++;
      continue;
    }

    const fn = FUNCTIONS.find((f) =>
      expression.startsWith(f, i)
    );

    if (fn) {
      tokens.push({
        type: "func",
        value: fn,
      });

      i += fn.length;
      continue;
    }

    throw new Error(`Invalid character: ${char}`);
  }

  return tokens;
}

function calculateExpression(
  expression,
  angleMode = "DEG"
) {
  const tokens = tokenize(expression);
  let position = 0;

  const peek = () => tokens[position];

  const consume = () => tokens[position++];

  const isOp = (value) =>
    peek()?.type === "op" &&
    peek()?.value === value;

  function parseExpression() {
    let value = parseTerm();

    while (isOp("+") || isOp("-")) {
      const operator = consume().value;
      const right = parseTerm();

      value =
        operator === "+"
          ? value + right
          : value - right;
    }

    return value;
  }

  function parseTerm() {
    let value = parseUnary();

    while (true) {
      if (isOp("*")) {
        consume();
        value *= parseUnary();
      } else if (isOp("/")) {
        consume();

        const right = parseUnary();

        if (right === 0) {
          throw new Error(
            "Cannot divide by zero"
          );
        }

        value /= right;
      } else if (
        peek() &&
        (
          peek().type === "number" ||
          peek().type === "func" ||
          isOp("(")
        )
      ) {
        value *= parseUnary();
      } else {
        break;
      }
    }

    return value;
  }

  function parseUnary() {
    if (isOp("+")) {
      consume();
      return parseUnary();
    }

    if (isOp("-")) {
      consume();
      return -parseUnary();
    }

    return parsePower();
  }

  function parsePower() {
    const base = parsePostfix();

    if (isOp("^")) {
      consume();

      const exponent = parseUnary();

      return Math.pow(base, exponent);
    }

    return base;
  }

  function parsePostfix() {
    let value = parsePrimary();

    while (isOp("%")) {
      consume();
      value /= 100;
    }

    return value;
  }

  function parsePrimary() {
    const token = peek();

    if (!token) {
      throw new Error(
        "Incomplete expression"
      );
    }

    if (token.type === "number") {
      consume();
      return token.value;
    }

    if (token.type === "func") {
      const fn = consume().value;

      let value;

      if (isOp("(")) {
        consume();

        value = parseExpression();

        if (!isOp(")")) {
          throw new Error(
            "Missing )"
          );
        }

        consume();
      } else {
        value = parsePostfix();
      }

      if (fn === "sqrt") {
        if (value < 0) {
          throw new Error(
            "Invalid square root"
          );
        }

        return Math.sqrt(value);
      }

      if (fn === "log") {
        if (value <= 0) {
          throw new Error(
            "Invalid log"
          );
        }

        return Math.log10(value);
      }

      if (fn === "ln") {
        if (value <= 0) {
          throw new Error(
            "Invalid ln"
          );
        }

        return Math.log(value);
      }

      const radians =
        angleMode === "DEG"
          ? (value * Math.PI) / 180
          : value;

      if (fn === "sin") {
        return Math.sin(radians);
      }

      if (fn === "cos") {
        return Math.cos(radians);
      }

      if (fn === "tan") {
        if (
          Math.abs(
            Math.cos(radians)
          ) < 1e-10
        ) {
          throw new Error(
            "Undefined tan"
          );
        }

        return Math.tan(radians);
      }
    }

    if (isOp("(")) {
      consume();

      const value =
        parseExpression();

      if (!isOp(")")) {
        throw new Error(
          "Missing )"
        );
      }

      consume();

      return value;
    }

    throw new Error(
      "Invalid expression"
    );
  }

  const result =
    parseExpression();

  if (position < tokens.length) {
    throw new Error(
      "Invalid expression"
    );
  }

  if (!Number.isFinite(result)) {
    throw new Error(
      "Math error"
    );
  }

  return result;
}

/* =========================================================
   HELPERS
========================================================= */

function closeBrackets(expression) {
  const open =
    (expression.match(/\(/g) || [])
      .length;

  const close =
    (expression.match(/\)/g) || [])
      .length;

  return open > close
    ? expression +
        ")".repeat(
          open - close
        )
    : expression;
}

function formatNumber(value) {
  if (Math.abs(value) < 1e-12) {
    return "0";
  }

  if (
    Number.isInteger(value) &&
    Math.abs(value) < 1e15
  ) {
    return String(value);
  }

  const abs = Math.abs(value);

  if (
    abs >= 1e15 ||
    abs < 1e-7
  ) {
    return value
      .toExponential(8)
      .replace(/\.?0+e/, "e");
  }

  return String(
    Number(value.toPrecision(12))
  );
}

/* =========================================================
   BUTTON
========================================================= */

const VARIANTS = {
  number: `
    border-slate-200
    bg-slate-50
    text-slate-800
    hover:bg-slate-100

    dark:border-white/10
    dark:bg-white/[0.055]
    dark:text-white
    dark:hover:bg-white/[0.11]
  `,

  function: `
    border-cyan-200
    bg-cyan-50
    text-cyan-700
    hover:bg-cyan-100

    dark:border-cyan-300/10
    dark:bg-cyan-400/[0.08]
    dark:text-cyan-100
    dark:hover:bg-cyan-400/[0.16]
  `,

  operator: `
    border-blue-200
    bg-blue-50
    text-blue-700
    hover:bg-blue-100

    dark:border-blue-300/10
    dark:bg-blue-500/[0.16]
    dark:text-blue-100
    dark:hover:bg-blue-500/[0.25]
  `,

  danger: `
    border-red-200
    bg-red-50
    text-red-600
    hover:bg-red-100

    dark:border-red-300/10
    dark:bg-red-500/[0.10]
    dark:text-red-200
    dark:hover:bg-red-500/[0.20]
  `,

  equal: `
    border-cyan-200/20
    bg-gradient-to-br
    from-cyan-400
    to-blue-600
    text-white
    shadow-lg
    shadow-cyan-500/20
  `,

  utility: `
    border-slate-200
    bg-slate-100
    text-slate-700
    hover:bg-slate-200

    dark:border-white/10
    dark:bg-white/[0.07]
    dark:text-white/80
    dark:hover:bg-white/[0.13]
  `,
};

function CalcButton({
  children,
  onClick,
  variant = "number",
  className = "",
  ariaLabel,
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{
        scale: 0.94,
      }}
      className={`
        h-12
        select-none
        rounded-2xl
        border
        text-base
        font-semibold
        transition-colors
        duration-150

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-400

        focus-visible:ring-offset-2
        focus-visible:ring-offset-slate-50

        dark:focus-visible:ring-offset-slate-950

        sm:h-14
        sm:text-lg

        lg:h-[54px]

        ${VARIANTS[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

/* =========================================================
   CALCULATOR
========================================================= */

const OPERATORS = [
  "+",
  "×",
  "÷",
  "−",
  "^",
];

export default function Calculator() {
  const [expression, setExpression] =
    useState("");

  const [result, setResult] =
    useState("0");

  const [justEvaluated, setJustEvaluated] =
    useState(false);

  const [angleMode, setAngleMode] =
    useState("DEG");

  const [history, setHistory] =
    useState([]);

  const [showHistory, setShowHistory] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  /* =========================================================
     LIVE PREVIEW
  ========================================================= */

  const preview = useMemo(() => {
    if (
      !expression ||
      justEvaluated
    ) {
      return "";
    }

    try {
      const value =
        calculateExpression(
          closeBrackets(expression),
          angleMode
        );

      return formatNumber(value);
    } catch {
      return "";
    }
  }, [
    expression,
    angleMode,
    justEvaluated,
  ]);

  /* =========================================================
     APPEND
  ========================================================= */

  const append = useCallback(
    (value) => {
      setError("");

      const isOperator =
        OPERATORS.includes(value) ||
        value === "%";

      setExpression((prev) => {
        if (justEvaluated) {
          if (
            isOperator &&
            result !== "Error"
          ) {
            return (
              result.replace(
                "-",
                "−"
              ) + value
            );
          }

          return value;
        }

        if (
          !prev &&
          isOperator &&
          value !== "−"
        ) {
          return prev;
        }

        if (
          OPERATORS.includes(value) &&
          OPERATORS.includes(
            prev.slice(-1)
          ) &&
          !(
            value === "−" &&
            prev.slice(-1) !==
              "−"
          )
        ) {
          return (
            prev.slice(0, -1) +
            value
          );
        }

        return prev + value;
      });

      setJustEvaluated(false);
    },
    [
      justEvaluated,
      result,
    ]
  );

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearAll = useCallback(() => {
    setExpression("");
    setResult("0");
    setError("");
    setJustEvaluated(false);
  }, []);

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteLast = useCallback(() => {
    setError("");

    if (justEvaluated) {
      clearAll();
      return;
    }

    setExpression((prev) => {
      const tokens = [
        "sin(",
        "cos(",
        "tan(",
        "log(",
        "ln(",
        "√(",
      ];

      for (const token of tokens) {
        if (prev.endsWith(token)) {
          return prev.slice(
            0,
            -token.length
          );
        }
      }

      return prev.slice(0, -1);
    });
  }, [
    justEvaluated,
    clearAll,
  ]);

  /* =========================================================
     CALCULATE
  ========================================================= */

  const calculate = useCallback(() => {
    if (
      !expression.trim() ||
      justEvaluated
    ) {
      return;
    }

    const closed =
      closeBrackets(expression);

    try {
      const value =
        calculateExpression(
          closed,
          angleMode
        );

      const formatted =
        formatNumber(value);

      setResult(formatted);
      setExpression(closed);
      setJustEvaluated(true);
      setError("");

      setHistory((prev) =>
        [
          {
            id:
              `${Date.now()}-${Math.random()}`,
            expression: closed,
            result: formatted,
          },
          ...prev,
        ].slice(0, 50)
      );
    } catch (err) {
      setError(
        err.message ||
          "Invalid expression"
      );

      setResult("Error");
      setJustEvaluated(true);
    }
  }, [
    expression,
    angleMode,
    justEvaluated,
  ]);

  /* =========================================================
     COPY
  ========================================================= */

  const copyResult = async () => {
    if (
      !result ||
      result === "Error"
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        result
      );

      setCopied(true);

      setTimeout(
        () => setCopied(false),
        1400
      );
    } catch {
      /* Clipboard unavailable */
    }
  };

  /* =========================================================
     KEYBOARD
  ========================================================= */

  const keyHandlerRef =
    useRef(null);

  keyHandlerRef.current =
    (event) => {
      if (showHistory) {
        if (
          event.key === "Escape"
        ) {
          setShowHistory(false);
        }

        return;
      }

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      const key = event.key;

      if (/^[0-9.]$/.test(key)) {
        event.preventDefault();
        append(key);
        return;
      }

      const operatorMap = {
        "+": "+",
        "-": "−",
        "*": "×",
        x: "×",
        "/": "÷",
        "^": "^",
        "%": "%",
        "(": "(",
        ")": ")",
        p: "π",
      };

      if (operatorMap[key]) {
        event.preventDefault();
        append(operatorMap[key]);
        return;
      }

      if (
        key === "Enter" ||
        key === "="
      ) {
        event.preventDefault();
        calculate();
        return;
      }

      if (
        key === "Backspace"
      ) {
        event.preventDefault();
        deleteLast();
        return;
      }

      if (
        key === "Delete" ||
        key === "Escape"
      ) {
        event.preventDefault();
        clearAll();
      }
    };

  useEffect(() => {
    const listener = (event) =>
      keyHandlerRef.current?.(
        event
      );

    window.addEventListener(
      "keydown",
      listener
    );

    return () =>
      window.removeEventListener(
        "keydown",
        listener
      );
  }, []);

  /* =========================================================
     SCIENTIFIC BUTTONS
  ========================================================= */

  const scientificButtons = [
    {
      label: "sin",
      action: () =>
        append("sin("),
    },
    {
      label: "cos",
      action: () =>
        append("cos("),
    },
    {
      label: "tan",
      action: () =>
        append("tan("),
    },
    {
      label: "log",
      action: () =>
        append("log("),
    },
    {
      label: "ln",
      action: () =>
        append("ln("),
    },
    {
      label: "√",
      action: () =>
        append("√("),
    },
    {
      label: "π",
      action: () =>
        append("π"),
    },
    {
      label: "e",
      action: () =>
        append("e"),
    },
    {
      label: "xʸ",
      action: () =>
        append("^"),
      aria: "Power",
    },
    {
      label: "%",
      action: () =>
        append("%"),
    },
  ];

  const mainDisplay =
    justEvaluated
      ? result
      : preview || "0";

  const isError =
    result === "Error" &&
    justEvaluated;

  const mainFontClass =
    mainDisplay.length > 14
      ? "text-2xl sm:text-3xl"
      : mainDisplay.length > 9
      ? "text-3xl sm:text-4xl"
      : "text-4xl sm:text-5xl";

  /* =========================================================
     UI
  ========================================================= */

  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden

        bg-slate-50
        px-3
        py-4
        text-slate-900

        transition-colors
        duration-300

        dark:bg-[#050811]
        dark:text-white

        sm:px-5
        lg:px-8
      "
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-[10%]
            top-[10%]
            h-72
            w-72
            rounded-full

            bg-cyan-500/5

            blur-[100px]

            dark:bg-cyan-500/10
          "
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-[5%]
            right-[5%]
            h-80
            w-80
            rounded-full

            bg-blue-600/5

            blur-[110px]

            dark:bg-blue-600/10
          "
        />

      </div>

      {/* =====================================================
          MAIN CALCULATOR
      ===================================================== */}

      <div
        className="
          relative
          flex
          min-h-[calc(100vh-2rem)]
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full
            max-w-[980px]
            lg:max-w-[1080px]
          "
        >

          {/* CALCULATOR CARD */}

          <div
            className="
              overflow-hidden
              rounded-[28px]

              border
              border-slate-200

              bg-white

              shadow-xl
              shadow-slate-200/60

              transition-colors
              duration-300

              dark:border-white/10
              dark:bg-white/[0.035]
              dark:shadow-black/40
              dark:backdrop-blur-xl
            "
          >

            {/* =================================================
                CALCULATOR HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3

                border-b
                border-slate-200

                px-4
                py-3

                dark:border-white/10

                sm:px-6
              "
            >

              {/* BRAND */}

              <div className="min-w-0">

                <h1
                  className="
                    text-xs
                    font-black
                    tracking-[0.16em]

                    text-slate-800

                    dark:text-slate-100

                    sm:text-sm
                  "
                >
                  CALC
                  <span className="text-blue-600">
                    POCKET
                  </span>
                </h1>

                <p
                  className="
                    mt-0.5
                    truncate

                    text-[10px]
                    font-medium

                    text-slate-400

                    dark:text-white/40

                    sm:text-[11px]
                  "
                >
                  Scientific Calculator
                </p>

              </div>

              {/* HISTORY BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setShowHistory(true)
                }
                aria-label="Open history"
                className="
                  relative
                  flex
                  h-9
                  shrink-0
                  items-center
                  gap-2

                  rounded-xl
                  border

                  border-slate-200
                  bg-slate-50

                  px-3

                  text-sm
                  text-slate-600

                  transition

                  hover:bg-slate-100
                  hover:text-slate-900

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan-400

                  dark:border-white/10
                  dark:bg-white/[0.05]
                  dark:text-white/70
                  dark:hover:bg-white/[0.10]
                  dark:hover:text-white
                "
              >

                <History size={16} />

                <span className="hidden sm:inline">
                  History
                </span>

                {history.length > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1

                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center

                      rounded-full
                      bg-cyan-400

                      px-1

                      text-[10px]
                      font-bold
                      text-black
                    "
                  >
                    {history.length}
                  </span>
                )}

              </button>

            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="p-3 sm:p-5">

              {/* =================================================
                  DISPLAY
              ================================================= */}

              <div
                className="
                  relative
                  overflow-hidden

                  rounded-3xl

                  border

                  border-slate-200

                  bg-slate-50

                  p-4

                  transition-colors
                  duration-300

                  dark:border-white/10
                  dark:bg-[#080d18]

                  sm:p-5
                "
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-0
                    top-0

                    h-32
                    w-32

                    rounded-full

                    bg-cyan-500/5

                    blur-3xl

                    dark:bg-cyan-500/10
                  "
                />

                <div className="relative">

                  {/* DISPLAY CONTROLS */}

                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                    "
                  >

                    {/* COPY */}

                    <button
                      type="button"
                      onClick={copyResult}
                      aria-label="Copy result"
                      className="
                        flex
                        h-8
                        items-center
                        gap-1.5

                        rounded-lg
                        border

                        border-slate-200
                        bg-white

                        px-2.5

                        text-xs
                        text-slate-500

                        transition

                        hover:bg-slate-100
                        hover:text-slate-900

                        dark:border-white/10
                        dark:bg-white/[0.04]
                        dark:text-white/50
                        dark:hover:text-white
                      "
                    >

                      {copied ? (
                        <>
                          <Check
                            size={13}
                            className="text-cyan-500"
                          />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          Copy
                        </>
                      )}

                    </button>

                    {/* DEG / RAD */}

                    <div
                      className="
                        flex
                        rounded-xl
                        border

                        border-slate-200
                        bg-white

                        p-1

                        dark:border-white/10
                        dark:bg-white/[0.04]
                      "
                    >

                      {["DEG", "RAD"].map(
                        (mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() =>
                              setAngleMode(
                                mode
                              )
                            }
                            className={`
                              rounded-lg
                              px-3
                              py-1

                              text-xs
                              font-bold

                              transition

                              ${
                                angleMode ===
                                mode
                                  ? "bg-cyan-400 text-black"
                                  : `
                                    text-slate-400
                                    hover:text-slate-800

                                    dark:text-white/50
                                    dark:hover:text-white
                                  `
                              }
                            `}
                          >
                            {mode}
                          </button>
                        )
                      )}

                    </div>

                  </div>

                  {/* EXPRESSION */}

                  <div
                    className="
                      mb-2
                      min-h-7
                      break-all

                      text-right
                      text-base

                      text-slate-400

                      dark:text-white/45

                      sm:text-lg
                    "
                  >
                    {expression ||
                      "\u00A0"}
                  </div>

                  {/* RESULT */}

                  <div
                    className={`
                      min-h-14
                      break-all

                      text-right
                      font-bold
                      tracking-tight

                      sm:min-h-16

                      ${mainFontClass}

                      ${
                        isError
                          ? "text-red-500 dark:text-red-400"
                          : justEvaluated
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-500 dark:text-white/70"
                      }
                    `}
                  >
                    {mainDisplay}
                  </div>

                  {/* ERROR */}

                  <div
                    className="
                      mt-1
                      min-h-4

                      text-right
                      text-xs
                      font-medium

                      text-red-500

                      dark:text-red-400
                    "
                  >
                    {error}
                  </div>

                </div>
              </div>

              {/* =================================================
                  SCIENTIFIC BUTTONS
              ================================================= */}

              <div
                className="
                  mt-3
                  grid
                  grid-cols-5

                  gap-1.5

                  sm:gap-2
                  lg:gap-3
                "
              >
                {scientificButtons.map(
                  (button) => (
                    <CalcButton
                      key={button.label}
                      variant="function"
                      onClick={
                        button.action
                      }
                      ariaLabel={
                        button.aria
                      }
                      className="
                        !h-10
                        !text-xs

                        sm:!h-12
                        sm:!text-sm

                        lg:!h-[46px]
                      "
                    >
                      {button.label}
                    </CalcButton>
                  )
                )}
              </div>

              {/* =================================================
                  MAIN KEYPAD
              ================================================= */}

              <div
                className="
                  mt-2.5
                  grid
                  grid-cols-4

                  gap-1.5

                  sm:gap-2
                  lg:gap-3
                "
              >

                <CalcButton
                  variant="danger"
                  onClick={clearAll}
                >
                  AC
                </CalcButton>

                <CalcButton
                  variant="utility"
                  onClick={deleteLast}
                  ariaLabel="Backspace"
                >
                  <Delete
                    size={20}
                    className="mx-auto"
                  />
                </CalcButton>

                <CalcButton
                  variant="operator"
                  onClick={() =>
                    append("(")
                  }
                >
                  (
                </CalcButton>

                <CalcButton
                  variant="operator"
                  onClick={() =>
                    append(")")
                  }
                >
                  )
                </CalcButton>

                {["7", "8", "9"].map(
                  (number) => (
                    <CalcButton
                      key={number}
                      onClick={() =>
                        append(number)
                      }
                    >
                      {number}
                    </CalcButton>
                  )
                )}

                <CalcButton
                  variant="operator"
                  onClick={() =>
                    append("÷")
                  }
                >
                  ÷
                </CalcButton>

                {["4", "5", "6"].map(
                  (number) => (
                    <CalcButton
                      key={number}
                      onClick={() =>
                        append(number)
                      }
                    >
                      {number}
                    </CalcButton>
                  )
                )}

                <CalcButton
                  variant="operator"
                  onClick={() =>
                    append("×")
                  }
                >
                  ×
                </CalcButton>

                {["1", "2", "3"].map(
                  (number) => (
                    <CalcButton
                      key={number}
                      onClick={() =>
                        append(number)
                      }
                    >
                      {number}
                    </CalcButton>
                  )
                )}

                <CalcButton
                  variant="operator"
                  onClick={() =>
                    append("−")
                  }
                >
                  −
                </CalcButton>

                <CalcButton
                  onClick={() =>
                    append("0")
                  }
                >
                  0
                </CalcButton>

                <CalcButton
                  onClick={() =>
                    append(".")
                  }
                >
                  .
                </CalcButton>

                <CalcButton
                  variant="operator"
                  onClick={() =>
                    append("+")
                  }
                >
                  +
                </CalcButton>

                <CalcButton
                  variant="equal"
                  onClick={calculate}
                  className="font-black"
                  ariaLabel="Calculate"
                >
                  =
                </CalcButton>

              </div>

              {/* =================================================
                  SCROLLING TAGLINE
              ================================================= */}

              <div
                className="
                  relative
                  mt-4
                  overflow-hidden

                  rounded-xl

                  border

                  border-slate-200

                  bg-slate-100/70

                  py-2.5

                  dark:border-white/5
                  dark:bg-white/[0.025]
                "
              >

                <motion.div
                  className="
                    flex
                    w-max
                    items-center
                    whitespace-nowrap
                  "
                  animate={{
                    x: [
                      "0%",
                      "-50%",
                    ],
                  }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >

                  {Array.from({
                    length: 6,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="
                          flex
                          items-center
                          gap-6
                          px-4
                        "
                      >

                        <span
                          className="
                            text-[10px]
                            font-semibold
                            tracking-[0.18em]

                            text-slate-400

                            dark:text-white/35

                            sm:text-xs
                          "
                        >
                          Powerful.
                        </span>

                        <span
                          className="
                            h-1
                            w-1
                            rounded-full

                            bg-cyan-500/60
                          "
                        />

                        <span
                          className="
                            text-[10px]
                            font-semibold
                            tracking-[0.18em]

                            text-slate-400

                            dark:text-white/35

                            sm:text-xs
                          "
                        >
                          Simple.
                        </span>

                        <span
                          className="
                            h-1
                            w-1
                            rounded-full

                            bg-cyan-500/60
                          "
                        />

                        <span
                          className="
                            text-[10px]
                            font-semibold
                            tracking-[0.18em]

                            text-cyan-600/70

                            dark:text-cyan-300/50

                            sm:text-xs
                          "
                        >
                          Always Free.
                        </span>

                        <span
                          className="
                            h-1
                            w-1
                            rounded-full

                            bg-cyan-500/60
                          "
                        />

                      </div>
                    )
                  )}

                </motion.div>

                {/* LEFT FADE */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    w-12

                    bg-gradient-to-r
                    from-slate-100
                    to-transparent

                    dark:from-[#080c16]
                  "
                />

                {/* RIGHT FADE */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    right-0
                    w-12

                    bg-gradient-to-l
                    from-slate-100
                    to-transparent

                    dark:from-[#080c16]
                  "
                />

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          HISTORY DRAWER
      ========================================================= */}

      <AnimatePresence>
        {showHistory && (
          <>
            {/* OVERLAY */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setShowHistory(false)
              }
              className="
                fixed
                inset-0
                z-40

                bg-black/40

                backdrop-blur-sm

                dark:bg-black/60
              "
            />

            {/* DRAWER */}

            <motion.aside
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 25,
              }}
              className="
                fixed
                right-0
                top-0
                z-50

                flex
                h-full
                w-full
                max-w-md
                flex-col

                border-l

                border-slate-200

                bg-white

                shadow-2xl

                dark:border-white/10
                dark:bg-[#080c16]
              "
            >

              {/* HISTORY HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between

                  border-b

                  border-slate-200

                  px-5
                  py-4

                  dark:border-white/10
                "
              >

                <div>

                  <h3
                    className="
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    History
                  </h3>

                  <p
                    className="
                      mt-1
                      text-xs

                      text-slate-400

                      dark:text-white/40
                    "
                  >
                    Tap a calculation
                    to reuse it
                  </p>

                </div>

                <div className="flex gap-2">

                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setHistory([])
                      }
                      className="
                        flex
                        h-9
                        items-center
                        gap-2

                        rounded-lg
                        border

                        border-red-200
                        bg-red-50

                        px-3

                        text-xs
                        text-red-600

                        hover:bg-red-100

                        dark:border-red-500/20
                        dark:bg-red-500/10
                        dark:text-red-300
                        dark:hover:bg-red-500/20
                      "
                    >
                      <Trash2 size={14} />
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setShowHistory(
                        false
                      )
                    }
                    aria-label="Close history"
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center

                      rounded-lg
                      border

                      border-slate-200
                      bg-slate-50

                      text-slate-500

                      hover:text-slate-900

                      dark:border-white/10
                      dark:bg-white/[0.05]
                      dark:text-white/60
                      dark:hover:text-white
                    "
                  >
                    <X size={18} />
                  </button>

                </div>
              </div>

              {/* HISTORY CONTENT */}

              <div
                className="
                  flex-1
                  overflow-y-auto
                  p-5
                "
              >

                {history.length === 0 ? (
                  <div
                    className="
                      flex
                      h-full
                      flex-col
                      items-center
                      justify-center
                      text-center
                    "
                  >

                    <History
                      size={42}
                      className="
                        mb-4
                        text-slate-200
                        dark:text-white/20
                      "
                    />

                    <p
                      className="
                        font-semibold

                        text-slate-500

                        dark:text-white/50
                      "
                    >
                      No calculations yet
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs

                        text-slate-400

                        dark:text-white/30
                      "
                    >
                      Press = and your
                      results will show
                      up here.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-3">

                    {history.map(
                      (item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setExpression(
                              item.expression
                            );

                            setResult(
                              item.result
                            );

                            setJustEvaluated(
                              true
                            );

                            setError("");

                            setShowHistory(
                              false
                            );
                          }}
                          className="
                            w-full
                            rounded-2xl
                            border

                            border-slate-200
                            bg-slate-50

                            p-4
                            text-left

                            transition

                            hover:bg-slate-100

                            dark:border-white/10
                            dark:bg-white/[0.04]
                            dark:hover:bg-white/[0.08]
                          "
                        >

                          <div
                            className="
                              break-all
                              text-sm

                              text-slate-400

                              dark:text-white/45
                            "
                          >
                            {item.expression}
                          </div>

                          <div
                            className="
                              mt-2
                              break-all

                              text-xl
                              font-bold

                              text-cyan-600

                              dark:text-cyan-300
                            "
                          >
                            = {item.result}
                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}

              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
