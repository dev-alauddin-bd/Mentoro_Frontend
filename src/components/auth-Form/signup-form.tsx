"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Briefcase } from "lucide-react";
import {
  setUser,
} from "@/redux/features/auth/authSlice";
import type { AppDispatch } from "@/redux/store";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useSignUpMutation, useSyncFirebaseMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ---------------- Zod Schema ----------------
const signupSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["student", "instructor"]),
    terms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  })


type SignupFormValues = z.infer<typeof signupSchema>;

// ---------------- Signup Form Component ----------------
export function SignupForm() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [signUp] = useSignUpMutation();
  const [syncFirebase] = useSyncFirebaseMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "student" as const,
      terms: false as any,
    }
  });

  const role = watch("role");

  const onGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with backend
      const response = await syncFirebase({
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        role: "student", // Default role for social signup
      }).unwrap();

      dispatch(setUser({ user: response.data.user, token: response.data.accessToken }));
      
      toast.success("Logged in with Google!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Google signup failed");
    }
  };

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      const response = await signUp(data).unwrap();
      
      dispatch(setUser({ user: response.data.user, token: response.data.accessToken }));

      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      const message = err?.data?.message || err?.message || "Signup failed";
      toast.error(message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Path Selection */}
        <div className="space-y-3">
          <label className="block text-[10px] font-black text-center text-muted-foreground uppercase tracking-[0.2em]">
             Select Your Path
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "student")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-300",
                role === "student" 
                ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10" 
                : "border-border text-muted-foreground hover:border-primary/20 hover:bg-muted/30 opacity-60"
              )}
            >
              <GraduationCap className={cn("w-8 h-8", role === "student" && "animate-pulse")} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "instructor")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border-2 transition-all duration-300",
                role === "instructor" 
                ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10" 
                : "border-border text-muted-foreground hover:border-primary/20 hover:bg-muted/30 opacity-60"
              )}
            >
              <Briefcase className={cn("w-8 h-8", role === "instructor" && "animate-pulse")} />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Instructor</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-left">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-foreground ml-1">Full Name</label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <User className="w-5 h-5" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...register("name")}
                id="name"
                placeholder="Ex. Alauddin Ali"
                className="h-12"
              />
            </InputGroup>
            {errors.name && (
              <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-foreground ml-1">Email Address</label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Mail className="w-5 h-5" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-12"
              />
            </InputGroup>
            {errors.email && (
              <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-bold text-foreground ml-1">Secure Password</label>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Lock className="w-5 h-5" />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {errors.password && (
              <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 ml-1">
            <Checkbox 
              id="terms" 
              {...register("terms")}
              className="mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
            >
              I agree to the{" "}
              <a href="/terms" className="text-primary hover:underline font-bold">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-primary hover:underline font-bold">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-destructive text-xs font-bold mt-1 ml-1">{errors.terms.message}</p>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-bold">Or sign up with</span>
          </div>
        </div>

        <Button
          onClick={onGoogleLogin}
          type="button"
          variant="outline"
          className="w-full h-12 gap-3 font-bold text-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </Button>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 font-black text-sm uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          {isSubmitting ? "Generating Profile..." : "Create My Account"}
        </Button>
      </form>
    </>
  );
}
