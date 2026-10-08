
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://YOUR-DOMAIN.com"),

  title: {
    default: "Scientific Calculator Online | Free Math Calculator",
    template: "%s | CALCPOCKET",
  },

  description:
    "Use CALCPOCKET, a free scientific calculator online for math, trigonometry, percentages, powers, roots, logarithms, and more. Fast, accurate, private, and easy to use.",

  keywords: [
    "scientific calculator",
    "scientific calculator online",
    "online scientific calculator",
    "free scientific calculator",
    "free online scientific calculator",
    "scientific calculator free",
    "math calculator",
    "online math calculator",
    "free math calculator",
    "calculator online",
    "free calculator online",
    "advanced calculator",
    "advanced math calculator",
    "trigonometry calculator",
    "trigonometric calculator",
    "sin cos tan calculator",
    "degree calculator",
    "radian calculator",
    "degrees radians calculator",
    "logarithm calculator",
    "log calculator",
    "ln calculator",
    "square root calculator",
    "root calculator",
    "power calculator",
    "exponent calculator",
    "percentage calculator",
    "percent calculator",
    "algebra calculator",
    "math calculator for students",
    "calculator for math",
    "calculator for trigonometry",
    "browser calculator",
    "online math tool",
    "free math tool",
    "scientific calculator no signup",
    "scientific calculator without signup",
    "scientific calculator online free",
    "calculator for students",
    "calculator for school",
    "calculator for college",
    "calculator for homework",
    "calculator for equations",
    "calculator for powers",
    "calculator for roots",
    "calculator for logarithms",
  ],

  authors: [
    {
      name: "Gautam Singh",
    },
  ],

  creator: "Gautam Singh",
  publisher: "CALCPOCKET",

  applicationName: "CALCPOCKET",

  category: "education",

  alternates: {
    canonical: "https://YOUR-DOMAIN.com/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://YOUR-DOMAIN.com/",
    siteName: "CALCPOCKET",

    title: "Scientific Calculator Online | Free Math Calculator",

    description:
      "Free online scientific calculator for math, trigonometry, percentages, powers, roots, logarithms, and more.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CALCPOCKET Scientific Calculator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Scientific Calculator Online | CALCPOCKET",

    description:
      "Free scientific calculator online for math, trigonometry, powers, roots, logarithms, and percentages.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

