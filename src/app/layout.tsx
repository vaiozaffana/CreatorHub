import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToasterProvider } from "@/components/ToasterProvider";
import NavigationProgress from "@/components/NavigationProgress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CreatorHub — Sell Your Digital Products Effortlessly",
  description:
    "The easiest way to sell digital products online. Upload ebooks, templates, UI kits, courses, or source code and start earning today.",
  keywords: [
    "digital products",
    "sell online",
    "ebooks",
    "templates",
    "UI kits",
    "source code",
    "creator economy",
  ],
  openGraph: {
    title: "CreatorHub — Sell Your Digital Products Effortlessly",
    description:
      "The easiest way to sell digital products online. Upload ebooks, templates, UI kits, courses, or source code and start earning today.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-[#fafafa] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          <NavigationProgress />
          {children}
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
