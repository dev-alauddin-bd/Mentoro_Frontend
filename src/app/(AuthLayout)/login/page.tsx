"use client";



import { useTranslation } from "react-i18next";
import { LoginForm } from "@/components/auth-Form/login-form";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl p-10">
          <div className="mb-10 text-center space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                Secure Access
             </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">
                {t("auth.welcome_back") || "Welcome Back"}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
                Please enter your credentials to access your dashboard.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 font-medium">
          Don't have an account? <a href="/signup" className="text-primary font-bold hover:underline">Create an account</a>
        </p>
      </div>
    </main>
  );
}
