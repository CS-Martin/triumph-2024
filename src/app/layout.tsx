import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme.provider";
import { LoadingProgressProvider } from "@/providers/bprogress.provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Triumph Yearbook 2024",
  description: "Triumph Yearboowk 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl={`/sign-in`}
      signUpUrl={`/sign-up`}
      signInFallbackRedirectUrl={`/dashboard`}
      signUpFallbackRedirectUrl={`/dashboard`}
      signUpForceRedirectUrl={`/dashboard`}
      signInForceRedirectUrl={`/dashboard`}
      afterSignOutUrl={`/`}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem>
            <LoadingProgressProvider>
              {children}
              <Toaster
                position='top-right'
                richColors
              />
            </LoadingProgressProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
