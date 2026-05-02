import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { LenisProvider } from "@/components/shared/LenisProvider";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ReactQueryProvider } from "@/components/shared/ReactQueryProvider";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: {
    default: "Kayes | Code. Create. Illuminate.",
    template: "%s | Kayes.Lab",
  },
  description:
    "Full-Stack Developer specializing in Next.js, React, TypeScript and Node.js. Building precision-engineered digital experiences.",
  keywords: ["Full Stack Developer", "Next.js", "React", "TypeScript", "Portfolio"],
  authors: [{ name: "Kayes" }],
  creator: "Kayes",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Kayes | Code. Create. Illuminate.",
    description: "Full-Stack Developer — Precision. Creativity. Excellence.",
    siteName: "Kayes.Lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kayes | Code. Create. Illuminate.",
    description: "Full-Stack Developer — Precision. Creativity. Excellence.",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider>
          <ReactQueryProvider>
            <LenisProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                }}
              />
              <ThemeToggle />
              <ChatWidget />
            </LenisProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
