"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log to console (replace with Sentry/Datadog in production)
    console.error("[Route Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-red-600/5 blur-2xl" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-2 leading-relaxed">
          An unexpected error occurred. You can try again or go back home.
        </p>

        {/* Show digest in dev for debugging */}
        {process.env.NODE_ENV === "development" && error?.digest && (
          <p className="text-xs text-gray-600 mb-6 font-mono bg-white/5 rounded-lg px-3 py-2">
            digest: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all text-sm font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
