"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AppDispatch } from "@/redux/store";
import {
  setUser,
} from "@/redux/features/auth/authSlice";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/gtag";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap();
      console.log("Login response:", response.data.user);

      dispatch(setUser({ user: response.data.user, token: response.data.accessToken }));

      trackEvent('login', { method: 'Email' });
      toast.success("Login successful!");
      router.push(callbackUrl);
    } catch (err: any) {
      const message = err?.data?.message || err?.message || "Login failed";
      toast.error(message);
    }
  };

  // Quick login helper
  const quickLogin = (role: "admin" | "student" | "instructor") => {
    const creds = {
      admin: {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
        pass: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "",
      },
      student: {
        email: process.env.NEXT_PUBLIC_STUDENT_EMAIL || "",
        pass: process.env.NEXT_PUBLIC_STUDENT_PASSWORD || "",
      },
      instructor: {
        email: process.env.NEXT_PUBLIC_INSTRUCTOR_EMAIL || "",
        pass: process.env.NEXT_PUBLIC_INSTRUCTOR_PASSWORD || "",
      },
    };


    setValue("email", creds[role].email);
    setValue("password", creds[role].pass);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Quick Login Section */}
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Quick Login</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickLogin("admin")}
              className="py-2.5 bg-blue-600/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              Admin
            </button>
            <button
              onClick={() => quickLogin("instructor")}
              className="py-2.5 bg-purple-600/10 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-purple-600 hover:text-white transition-all shadow-sm"
            >
              Instructor
            </button>
            <button
              onClick={() => quickLogin("student")}
              className="py-2.5 bg-green-600/10 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-green-600 hover:text-white transition-all shadow-sm"
            >
              Student
            </button>
          </div>
        </div>



        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-bold">Or continue with email</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <p className="text-destructive text-xs font-bold mt-1 ml-1 tracking-tight">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" className="text-sm font-bold text-foreground">Password</label>
              <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
            </div>
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
              <p className="text-destructive text-xs font-bold mt-1 ml-1 tracking-tight">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </>
  );
}
