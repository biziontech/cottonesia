import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import "./fonts.css";
import "./panel.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Alex AC Mobil",
  description: "Spesialis AC Mobil Semarang",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </AuthProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
