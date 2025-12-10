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
import { useFormik } from "formik";
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const signupSchema = Yup.object({
  name: Yup.string().min(2, "Name is too short").required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[0-9]/, "Must contain a number")
    .matches(/[@$!%*?&#^()\-_=+{}[\]|;:'",.<>/~`]/, "Must contain a special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function SignupPage() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      console.log(values);
      setToastMessage("Signup successful!");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        router.push("/ChatWindow");
      }, 1500);
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 text-gray-100">

      {/* Logo */}
      <div className="absolute top-10 left-10 opacity-80">
        <Logo />
      </div>

      {/* Technical Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Technical Rings */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-neutral-700/20 animate-pulse blur-sm" />
      <div className="absolute w-[900px] h-[900px] rounded-full border border-neutral-700/10 animate-pulse animation-delay-700" />

      {/* Soft Glow */}
      <div className="absolute w-[450px] h-[450px] bg-neutral-700/10 rounded-full blur-3xl" />

      {/* Signup Card */}
      <Card className="relative w-full max-w-md bg-neutral-900/70 backdrop-blur-xl border border-neutral-700 shadow-[0_0_35px_rgba(0,0,0,0.5)] rounded-2xl px-2">

        <CardHeader className="text-center space-y-4 pb-5 pt-8">
          <div>
            <CardTitle className="text-3xl font-bold">
              <Typography variant="h2" align="center" className="text-gray-100">
                Create Account
              </Typography>
            </CardTitle>
            <CardDescription>
              <Typography variant="muted" align="center" className="text-gray-400">
                Start your AI journey
              </Typography>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-10">

          {/* Form */}
          <div className="space-y-5">

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                <Typography variant="label" className="text-gray-300">
                  Full Name
                </Typography>
              </Label>

              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gray-300" />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Your Name"
                  className="h-12 pl-11 bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>

              {formik.touched.name && formik.errors.name && (
                <Typography variant="small" className="text-red-400 mt-1">
                  {formik.errors.name}
                </Typography>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                <Typography variant="label" className="text-gray-300">
                  Email Address
                </Typography>
              </Label>

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gray-300" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Email"
                  className="h-12 pl-11 bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <Typography variant="small" className="text-red-400 mt-1">
                  {formik.errors.email}
                </Typography>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                <Typography variant="label" className="text-gray-300">
                  Password
                </Typography>
              </Label>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gray-300" />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Create password"
                  className="h-12 pl-11 pr-11 bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <Typography variant="small" className="text-red-400 mt-1">
                  {formik.errors.password}
                </Typography>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                <Typography variant="label" className="text-gray-300">
                  Confirm Password
                </Typography>
              </Label>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Re-enter password"
                  className="h-12 pl-11 pr-11 bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>

              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <Typography variant="small" className="text-red-400 mt-1">
                    {formik.errors.confirmPassword}
                  </Typography>
                )}
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formik.values.agreeToTerms}
                onCheckedChange={(value) =>
                  formik.setFieldValue("agreeToTerms", value)
                }
                className="border-gray-700 data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400"
              />
              <Label htmlFor="agreeToTerms" className="text-gray-400 text-sm cursor-pointer">
                I agree to the Terms & Conditions
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={() => formik.handleSubmit()}
              disabled={
                !formik.values.name ||
                !formik.values.email ||
                !formik.values.password ||
                !formik.values.confirmPassword ||
                !formik.values.agreeToTerms
              }
              className="w-full h-12 bg-gray-200 hover:bg-gray-300 text-black font-semibold transition-all rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </div>

          {/* Already Have an Account */}
          <div className="text-center">
            <Typography variant="small" className="text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-gray-300 hover:text-white font-semibold"
              >
                Sign in
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

          {/* Social Button */}
          <Button
            variant="outline"
            className="h-12 bg-neutral-800/60 hover:bg-neutral-700 border-neutral-700 text-gray-200 rounded-xl"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-10 opacity-70">
        <Typography variant="small" className="text-gray-500">
          © 2025 AI Chat Bot By SumNex Tech. All rights reserved.
        </Typography>
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all bg-green-600 duration-500 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {toastMessage}
      </div>

    </div>
  );
}
