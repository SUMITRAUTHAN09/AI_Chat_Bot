"use client";

import { NAVIGATION_ROUTES } from "@/app/Constant";
import FooterLink from "@/components/custom/FooterLink";
import GoogleSignInButton from "@/components/custom/GoogleSignInButton";
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
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    validationSchema: signupSchema,
    onSubmit: async (values, { setErrors }) => {
      setIsLoading(true);

      try {
        const response = await authService.signup(values);

        if (!response.success) {
          if (response.errors) {
            const formikErrors: any = {};
            response.errors.forEach((error) => {
              formikErrors[error.field] = error.message;
            });
            setErrors(formikErrors);
          }

          setToastMessage(response.message || "Signup failed");
          setShowToast(true);
          setIsLoading(false);

          setTimeout(() => setShowToast(false), 3000);
          return;
        }

        setToastMessage("Signup successful!");
        setShowToast(true);

        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        setTimeout(() => {
          setShowToast(false);
          router.push("/ChatWindow");
        }, 1500);
      } catch (error) {
        console.error("Signup error:", error);
        setToastMessage("An error occurred. Please try again.");
        setShowToast(true);
        setIsLoading(false);

        setTimeout(() => setShowToast(false), 3000);
      }
    },
  });

  const handleGoogleSuccess = () => {
    setToastMessage("Google sign-up successful!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const handleGoogleError = (error: string) => {
    setToastMessage(error);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 text-gray-100 p-3 sm:p-4 md:p-6 py-20 sm:py-24 md:py-6">

      {/* Logo - Responsive with proper z-index */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 opacity-80 z-10 pointer-events-none">
        <div className="scale-75 sm:scale-90 md:scale-100">
          <Logo />
        </div>
      </div>

      {/* Technical Background Grid - Hide on small screens */}
      <div className="hidden sm:block absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Technical Rings - Responsive sizes */}
      <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full border border-neutral-700/20 animate-floating1 pointer-events-none" />
      <div className="absolute w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] md:w-[900px] md:h-[900px] rounded-full border border-neutral-700/10 animate-floating2 pointer-events-none" />

      {/* Soft Glow - Responsive */}
      <div className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] bg-neutral-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Signup Card - Higher z-index than logo and footer */}
      <Card className="relative z-40 w-full max-w-[90%] sm:max-w-md bg-neutral-900/70 backdrop-blur-xl border border-neutral-700 shadow-[0_0_40px_rgba(0,0,0,0.6)] rounded-xl sm:rounded-2xl my-4">

        <CardHeader className="text-center space-y-3 sm:space-y-4 pb-4 sm:pb-5 pt-6 sm:pt-8 px-4 sm:px-6">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              <Typography variant="h2" align="center" className="text-gray-100">
                Create Account
              </Typography>
            </CardTitle>
            <CardDescription className="mt-1.5 sm:mt-2">
              <Typography variant="muted" align="center" className="text-gray-400 text-sm sm:text-base">
                Start your AI journey
              </Typography>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 pb-6 sm:pb-10 px-4 sm:px-6">

          {/* Form */}
          <div className="space-y-4 sm:space-y-5">

            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="name">
                <Typography variant="label" className="text-gray-300 text-sm sm:text-base">
                  Full Name
                </Typography>
              </Label>

              <div className="relative group">
                <User className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-colors group-focus-within:text-gray-300" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Your Name"
                  disabled={isLoading}
                  className="h-10 sm:h-12 pl-9 sm:pl-11 text-sm sm:text-base bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {formik.touched.name && formik.errors.name && (
                <Typography variant="small" className="text-red-400 mt-1 text-xs sm:text-sm">
                  {formik.errors.name}
                </Typography>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">
                <Typography variant="label" className="text-gray-300 text-sm sm:text-base">
                  Email Address
                </Typography>
              </Label>

              <div className="relative group">
                <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-colors group-focus-within:text-gray-300" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Email"
                  disabled={isLoading}
                  className="h-10 sm:h-12 pl-9 sm:pl-11 text-sm sm:text-base bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <Typography variant="small" className="text-red-400 mt-1 text-xs sm:text-sm">
                  {formik.errors.email}
                </Typography>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">
                <Typography variant="label" className="text-gray-300 text-sm sm:text-base">
                  Password
                </Typography>
              </Label>

              <div className="relative group">
                <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-colors group-focus-within:text-gray-300" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Create password"
                  disabled={isLoading}
                  className="h-10 sm:h-12 pl-9 sm:pl-11 pr-9 sm:pr-11 text-sm sm:text-base bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>

              {formik.touched.password && formik.errors.password && (
                <Typography variant="small" className="text-red-400 mt-1 text-xs sm:text-sm">
                  {formik.errors.password}
                </Typography>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">
                <Typography variant="label" className="text-gray-300 text-sm sm:text-base">
                  Confirm Password
                </Typography>
              </Label>

              <div className="relative group">
                <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-colors group-focus-within:text-gray-300" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder="Re-enter password"
                  disabled={isLoading}
                  className="h-10 sm:h-12 pl-9 sm:pl-11 pr-9 sm:pr-11 text-sm sm:text-base bg-neutral-800/60 border-neutral-700 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <Typography variant="small" className="text-red-400 mt-1 text-xs sm:text-sm">
                  {formik.errors.confirmPassword}
                </Typography>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start sm:items-center space-x-2 pt-1">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formik.values.agreeToTerms}
                onCheckedChange={(value) =>
                  formik.setFieldValue("agreeToTerms", value)
                }
                disabled={isLoading}
                className="border-gray-700 data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400 disabled:opacity-50 mt-0.5 sm:mt-0"
              />
              <Label htmlFor="agreeToTerms" className="text-gray-400 text-xs sm:text-sm cursor-pointer leading-tight">
                I agree to the Terms & Conditions
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
              disabled={
                isLoading ||
                !formik.values.name ||
                !formik.values.email ||
                !formik.values.password ||
                !formik.values.confirmPassword ||
                !formik.values.agreeToTerms
              }
              className="w-full h-10 sm:h-12 bg-gray-200 hover:bg-gray-300 text-black font-semibold transition-all rounded-lg sm:rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-sm sm:text-base">Creating Account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-sm sm:text-base">Create Account</span>
                </>
              )}
            </Button>
          </div>

          {/* Already Have an Account */}
          <div className="text-center">
            <Typography variant="small" className="text-gray-400 text-xs sm:text-sm">
              Already have an account?{" "}
              <button
                onClick={() => router.push(NAVIGATION_ROUTES.HOME)}
                disabled={isLoading}
                className="text-gray-300 hover:text-white font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign in
              </button>
            </Typography>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <Separator className="bg-neutral-700" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-2 sm:px-3">
              <Typography variant="small" className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                Or continue with
              </Typography>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <GoogleSignInButton
            mode="signup"
            disabled={isLoading}
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </CardContent>
      </Card>
       
      {/* Footer with proper z-index below card */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <FooterLink />
      </div>
     
      {/* Toast - Responsive */}
      <div
        className={`fixed bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-white font-medium shadow-lg transition-all duration-500 text-sm sm:text-base max-w-[90%] sm:max-w-none text-center z-50 ${
          toastMessage.toLowerCase().includes('success') || toastMessage.toLowerCase().includes('successful')
            ? 'bg-green-600' 
            : 'bg-red-600'
        } ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {toastMessage}
      </div>
    </div>
  );
}