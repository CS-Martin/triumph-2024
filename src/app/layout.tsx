import type { Metadata } from "next";
import { Geist, Geist_Mono, Rosarivo } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme.provider";
import { LoadingProgressProvider } from "@/providers/bprogress.provider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/clerk.css";
import "@/styles/fireflies.css";

const rosarivo = Rosarivo({
  variable: "--font-rosarivo",
  subsets: ["latin"],
  weight: "400",
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
      signInFallbackRedirectUrl={`/`}
      signUpFallbackRedirectUrl={`/`}
      signUpForceRedirectUrl={`/`}
      signInForceRedirectUrl={`/`}
      afterSignOutUrl={`/`}
      appearance={{
        elements: {
          card: '!bg-transparent shadow-none',
          header: '!hidden',
          footer: '!mt-0 !hidden',
          form: '!gap-4',
          formButtonPrimary: '!bg-[#F4E590] !text-black hover:bg-yellow-600 !rounded-full !2xl:py-2.5 !py-2',
          formFieldLabel: '!text-[#F4E590]',
          input: '!border-[#F4E590] !border-4 !bg-[#343434] !text-white !rounded-full  !2xl:py-4 !py-3',
        },
      }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${rosarivo.className} ${rosarivo.variable} antialiased`}
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
