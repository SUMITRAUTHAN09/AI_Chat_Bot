"use client";

import Logo from "@/components/custom/Logo";
import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/lib/authService";
import { useFormik } from "formik";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import FooterLink from "./FooterLink";
import GoogleSignInButton from "./GoogleSignInButton";

const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setErrors }) => {
      setIsLoading(true);

      try {
        const response = await authService.login(values);

        if (!response.success) {
          if (response.errors) {
            const formikErrors: any = {};
            response.errors.forEach((error: any) => {
              formikErrors[error.field] = error.message;
            });
            setErrors(formikErrors);
          }

          setToastMessage(response.message || "Login failed");
          setShowToast(true);
          setIsLoading(false);
          setTimeout(() => setShowToast(false), 3000);
          return;
        }

        setToastMessage("Login successful!");
        setShowToast(true);

        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        setTimeout(() => {
          setShowToast(false);
          router.push("/ChatWindow");
        }, 1500);
      } catch (error) {
        console.error("Login error:", error);
        setToastMessage("An error occurred. Please try again.");
        setShowToast(true);
        setIsLoading(false);
        setTimeout(() => setShowToast(false), 3000);
      }
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 text-gray-100 p-4">
      {/* Logo */}
      <div className="absolute top-10 left-10 opacity-80 pointer-events-none">
        <Logo />
      </div>

      {/* Technical Background Grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Technical Circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-gray-700/20 animate-floating1 pointer-events-none" />
      <div className="absolute w-[700px] h-[700px] rounded-full border border-gray-700/10 animate-floating2 pointer-events-none" />

      {/* Soft glow */}
      <div className="absolute w-[400px] h-[400px] bg-gray-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <Card className="relative z-40 w-full max-w-md bg-neutral-900/70 backdrop-blur-xl border border-neutral-700 shadow-[0_0_40px_rgba(0,0,0,0.6)] rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div>
            <CardTitle className="text-3xl font-bold">
              <Typography variant="h2" align="center" className="text-gray-100">
                Welcome Back
              </Typography>
            </CardTitle>

            <CardDescription className="mt-2">
              <Typography
                variant="muted"
                align="center"
                className="text-gray-400"
              >
                Sign in to continue your journey
              </Typography>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">
                <Typography variant="label" className="text-gray-300">
                  Email Address
                </Typography>
              </Label>

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within:text-gray-300" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Email"
                  disabled={isLoading}
                  className="h-12 pl-11 bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <Typography variant="small" className="text-red-400 mt-1">
                  {formik.errors.email}
                </Typography>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">
                <Typography variant="label" className="text-gray-300">
                  Password
                </Typography>
              </Label>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gray-300 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="h-12 pl-11 pr-11 bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <Typography variant="small" className="text-red-400 mt-1">
                  {formik.errors.password}
                </Typography>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onCheckedChange={(value) =>
                    formik.setFieldValue("rememberMe", value)
                  }
                  disabled={isLoading}
                  className="border-gray-700 data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400 disabled:opacity-50"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-400 cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="button"
                variant="link"
                className="text-sm text-gray-400 hover:text-gray-200 p-0"
                disabled={isLoading}
              >
                Forgot password?
              </Button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formik.values.email ||
                !formik.values.password
              }
              className="w-full h-12 bg-gray-200 hover:bg-gray-300 text-black font-semibold transition-all rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Toggle to Signup */}
          <div className="text-center">
            <Typography variant="small" className="text-gray-400">
              {"Don't have an account? "}
              <button
                onClick={() => router.push("/SignUp")}
                disabled={isLoading}
                className="text-gray-300 hover:text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign Up
              </button>
            </Typography>
          </div>

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-neutral-700" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-3">
              <Typography variant="small" className="text-gray-500">
                Or continue with
              </Typography>
            </div>
          </div>

          {/* Google login */}
          <GoogleSignInButton mode="signin" disabled={isLoading} />
        </CardContent>
      </Card>

      <FooterLink />

      {/* Toast */}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all duration-500 ${
          toastMessage.toLowerCase().includes("success") ||
          toastMessage.toLowerCase().includes("successful")
            ? "bg-green-600"
            : "bg-red-600"
        } ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {toastMessage}
      </div>
    </div>
  );
}