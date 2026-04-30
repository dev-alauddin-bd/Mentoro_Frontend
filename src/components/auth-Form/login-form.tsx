"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AppDispatch } from "@/redux/store";
import {
  setUser,
} from "@/redux/features/auth/authSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useLoginMutation, useSyncFirebaseMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
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
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const [syncFirebase] = useSyncFirebaseMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with backend
      const response = await syncFirebase({
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        role: "student", // Default role
      }).unwrap();

      dispatch(setUser({ user: response.data.user, token: response.data.accessToken }));

      toast.success("Logged in with Google!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap();
      
      dispatch(setUser({ user: response.data.user, token: response.data.accessToken }));

      toast.success("Login successful!");
      router.push("/");
    } catch (err: any) {
      const message = err?.data?.message || err?.message || "Login failed";
      toast.error(message);
    }
  };

  // Quick login helper
  const quickLogin = (role: "admin" | "student" | "instructor") => {
    const creds = {
      admin: { email: "admin@gmail.com", pass: "123456" },
      student: { email: "alauddin@gmail.com", pass: "123456" },
      instructor: { email: "instructor@gmail.com", pass: "123456" },
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

        <Button
          onClick={onGoogleLogin}
          type="button"
          variant="outline"
          className="w-full h-14 gap-3 font-bold text-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </Button>

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
