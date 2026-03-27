import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ILDEX Vietnam 2026 and Horti & Agri Vietnam 2026 — Event Management Platform",
  description: "Manage exhibitions, conferences, organizers, and registrations seamlessly with ILDEX Vietnam 2026 and Horti & Agri Vietnam 2026.",
  icons: {
    icon: "https://static.thedeft.co/expoflow/ILDEX_VN_LOGO.jpg",
    apple: "https://static.thedeft.co/expoflow/ILDEX_VN_LOGO.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
