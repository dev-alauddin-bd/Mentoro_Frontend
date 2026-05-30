"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Script from "next/script";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GA_MEASUREMENT_ID, pageview } from "@/lib/gtag";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useSelector((state: RootState) => state.mentoroAuth);

  useEffect(() => {
    if (pathname && GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if ((window as any).gtag) {
      if (!loading && user && user?.id) {
        // Set User ID for logged-in users
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
          user_id: user.id,
        });
      } else {
        // Clear User ID for guest sessions
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
          user_id: null,
        });
      }
    }
  }, [loading, user, user?.id]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
