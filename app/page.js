
import Header from "../app/components/Header";
import Calculator from "../app/components/Calculator";
import Footer from "../app/components/Footer";
import { Hero, Features, Faq } from "../app/components/HomeSections";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        {/* =========================
            HERO / MAIN SEO CONTENT
        ========================== */}
        <section
          aria-labelledby="main-heading"
          className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12"
        >
          <Hero />
        </section>

        {/* =========================
            CALCULATOR + FEATURES
        ========================== */}
        <section
          id="calculator"
          aria-labelledby="calculator-heading"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-6 sm:px-6"
        >
          <h2
            id="calculator-heading"
            className="sr-only"
          >
            Free Scientific Calculator Online
          </h2>

          <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
            <Calculator />
            <Features />
          </div>
        </section>

        {/* =========================
            INFORMATION / SEO CONTENT
        ========================== */}
        <section
          id="how"
          className="mx-auto max-w-4xl scroll-mt-24 px-4 py-14 sm:px-6"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
              Scientific Calculator
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
              Free Scientific Calculator Online
            </h2>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              CALCPOCKET is a free online scientific calculator designed
              for everyday mathematics and advanced calculations. You
              can calculate powers, square roots, percentages,
              logarithms, trigonometric functions, and mathematical
              expressions directly in your browser.
            </p>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              The calculator works on desktop, laptop, tablet, and
              mobile devices. No account or software download is
              required.
            </p>

            <h3 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">
              How to Use a Scientific Calculator
            </h3>

            <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-900 dark:text-white">
                  1. Enter your calculation:
                </strong>{" "}
                Type numbers and mathematical operators into the
                calculator.
              </li>

              <li>
                <strong className="text-slate-900 dark:text-white">
                  2. Select a function:
                </strong>{" "}
                Use functions such as square root, powers,
                logarithms, sine, cosine, and tangent.
              </li>

              <li>
                <strong className="text-slate-900 dark:text-white">
                  3. Choose DEG or RAD:
                </strong>{" "}
                Select degree or radian mode when performing
                trigonometric calculations.
              </li>

              <li>
                <strong className="text-slate-900 dark:text-white">
                  4. Get your result:
                </strong>{" "}
                Your answer is calculated instantly.
              </li>
            </ol>
          </div>
        </section>

        {/* =========================
            FAQ
        ========================== */}
        <section
          id="faq"
          aria-labelledby="faq-heading"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6"
        >
          <Faq />
        </section>
      </main>

      <Footer />
    </>
  );
}
