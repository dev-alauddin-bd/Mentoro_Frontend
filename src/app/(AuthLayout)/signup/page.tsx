"use client"

import { SignupForm } from "@/components/auth-Form/signup-form"

import { useTranslation } from "react-i18next"
// import { GradientOrb } from "@/components/gradient-orb"

export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl p-10">
          <div className="mb-10 text-center space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                Join our Platform
             </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
                {t("auth.start_learning") || "Create Account"}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
                Join thousands of students and start your journey today.
            </p>
          </div>

          <SignupForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
          Already have an account? <a href="/login" className="text-primary font-bold hover:underline">Sign In here</a>
        </p>
      </div>
    </main>
  );
}
