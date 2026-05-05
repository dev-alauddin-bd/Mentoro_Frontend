import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script'
import "./globals.css";
import { Providers } from "@/components/ReduxProvider";
import { cookies } from 'next/headers'; // next 13.4+
import { Toaster } from "react-hot-toast";
import LenisProvider from "./LenisProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseMaster - Learn Better",
  description: "Best platform for online learning and courses",
  keywords: ["online courses", "learning platform", "masterclass", "education", "skill development"],
  verification: {
    google: "VR414iWeKSX3qANinXf7vE9r6e2svLfOmALfRo_5g04",
  },
};

import FirebaseAuthProvider from "@/providers/FirebaseAuthProvider";
import AiAssistant from "@/components/shared/AiAssistant";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read lang from cookie (set by i18n on client)
  const lang = (await cookies()).get('i18next')?.value || 'en';

  const isRtl = lang === 'ar';

  return (
    <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LY3F193D6E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LY3F193D6E');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <FirebaseAuthProvider>
   
              <LenisProvider>{children}</LenisProvider>
              <Toaster position="top-center" reverseOrder={false} />
              <AiAssistant />
 
          </FirebaseAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
