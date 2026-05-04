"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="text-[10rem] font-black leading-none bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-violet-600/10 blur-3xl animate-pulse" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            ← Go Back
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all text-sm font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
