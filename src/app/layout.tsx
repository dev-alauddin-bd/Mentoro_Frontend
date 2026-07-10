import type { Metadata } from "next";
import "./globals.css";

import { cookies } from 'next/headers';
import { Toaster } from "react-hot-toast";
import LenisProvider from "./LenisProvider";

export const metadata: Metadata = {
  title: "Mentoro - Learn Better",
  description: "Best platform for online learning and courses",
  keywords: ["online courses", "learning platform", "masterclass", "education", "skill development"],
  
};

import AiAssistant from "@/components/shared/AiAssistant";

import { ReduxProvider } from "@/components/ReduxProvider";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read lang from cookie (set by i18n on client)
  const lang = (await cookies()).get('i18next')?.value || 'en';

  const isRtl = lang === 'ar';

  return (
    <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning data-scroll-behavior="smooth">
      <head />
      <body>
        <ReduxProvider>
          <LenisProvider>{children}</LenisProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <AiAssistant />
        </ReduxProvider>


      </body>
    </html>
  );
}
