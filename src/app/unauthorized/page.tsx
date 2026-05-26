"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft, Lock } from "lucide-react";

export default function UnauthorizationdPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="text-center max-w-xl relative z-10">
        {/* Animated Icon Section */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center backdrop-blur-xl">
              <ShieldAlert className="w-16 h-16 text-red-500 animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 border border-white/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl">
            Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Denied</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
            You don&apos;t have permission to access this resource. It looks like your current role doesn&apos;t grant clearance for this area.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Footer Link */}
        <p className="mt-12 text-sm text-gray-500">
          Logged in as a different user?{" "}
          <Link href="/login" className="text-red-400 hover:text-red-300 transition-colors font-medium underline underline-offset-4">
            Sign out and switch accounts
          </Link>
        </p>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
    </div>
  );
}
