import type { Metadata } from "next";
import { geist, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";
import { QueryProvider } from "@/components/common/query-provider";

export const metadata: Metadata = {
  title: {
    default: "CodeInterview",
    template: "%s | CodeInterview",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                var dark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
              })();
            `,
          }}
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
