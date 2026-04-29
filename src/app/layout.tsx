import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/ReduxProvider";
import { cookies } from 'next/headers'; // next 13.4+
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LenisProvider from "./LenisProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseMaster - Learn Better",
  description: "Best platform for online learning and courses"
};

import FirebaseAuthProvider from "@/providers/FirebaseAuthProvider";
import AiAssistant from "@/components/shared/AiAssistant";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read lang from cookie (set by i18n on client)
  const lang = (await cookies()).get('i18next')?.value || 'en';

  const isRtl = lang === 'ar';

  return (
    <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body>
    <Providers>
      <FirebaseAuthProvider>
        <LenisProvider>{children}</LenisProvider>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <AiAssistant />
      </FirebaseAuthProvider>
  </Providers>
      </body>
    </html>
  );
}
