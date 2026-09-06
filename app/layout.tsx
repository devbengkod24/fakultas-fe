import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/prosemirror.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ProfileProvider } from "@/context/profileUseContext";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constant";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body
        className={`${inter.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <main>
          <ProfileProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              <NextTopLoader />
              {children}
            </ThemeProvider>
          </ProfileProvider>
        </main>
        <Toaster position="top-right" richColors expand={true} />
      </body>
    </html>
  );
}
