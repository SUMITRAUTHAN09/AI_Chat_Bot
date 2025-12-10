"use client";

import { Typography } from "@/components/custom/Typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 text-gray-100">

    

      {/* Technical Background Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Soft Glow Blobs */}
      <div className="absolute w-[450px] h-[450px] bg-neutral-700/10 rounded-full blur-3xl top-32 left-32 animate-pulse" />
      <div className="absolute w-[600px] h-[600px] rounded-full border border-neutral-700/20 animate-pulse bottom-20 right-20" />
      <div className="absolute w-[900px] h-[900px] rounded-full border border-neutral-700/10 animate-pulse animation-delay-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Welcome Card */}
      <Card className="relative w-full max-w-md bg-neutral-900/70 backdrop-blur-xl border border-neutral-700 shadow-[0_0_35px_rgba(0,0,0,0.5)] rounded-2xl px-6 py-8">

        <CardHeader className="text-center space-y-4 pb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-800 rounded-2xl mb-2 shadow-lg shadow-black/50 mx-auto">
            <Bot className="w-10 h-10 text-gray-100" />
          </div>

          <CardTitle className="text-3xl font-bold">
            <Typography variant="h2" align="center" className="text-gray-100">
              Welcome
            </Typography>
          </CardTitle>

          <CardDescription>
            <Typography variant="muted" align="center" className="text-gray-400">
              Start your AI journey
            </Typography>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="flex flex-col gap-4">

            {/* Login Button */}
            <Button
              onClick={() => router.push("/LogIn")}
              className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-gray-100 font-semibold transition-all rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Login
            </Button>

            {/* Sign Up Button */}
            <Button
              onClick={() => router.push("/SignUp")}
              className="w-full h-12 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold transition-all rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Sign Up
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-10 opacity-70 text-center w-full">
        <Typography variant="small" className="text-gray-500">
          © 2025 AI Chat Bot By SumNex Tech. All rights reserved.
        </Typography>
      </div>

    </div>
  );
}
