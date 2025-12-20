import { NAVIGATION_ROUTES } from "@/app/Constant";
import ChatWindow from "@/components/custom/ChatWindow";
import NavBar from "@/components/custom/NavBar";
import { Home } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="w-full h-screen flex bg-background overflow-hidden">
        {/* LEFT SIDE — NAVIGATION (1/4 width) */}
        <div className="border-r border-slate-800">
          <NavBar />
        </div>

        {/* RIGHT SIDE — CHAT WINDOW (3/4 width) */}
        <div className="w-4/4">
          <header className="bg-slate-900/50 backdrop-blur-xl border-b bg-blue-600 border-slate-800 sticky top-0 z-0 ">
            <div className="flex items-center justify-end p-4 relative">
              <div className="text-white absolute left-12 text-2xl">
                AI Chat Bot
              </div>
              {/* New Chat Button */}
              <Link href={NAVIGATION_ROUTES.CHAT_WINDOW}>
                <button className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-purple-500/50 flex items-center gap-2 text-white cursor-pointer hover:pointer">
                  <Home className="w-5 h-5" />
                  New Chat
                </button>
              </Link>
            </div>
          </header>
          <ChatWindow />
        </div>
      </div>
    </>
  );
}
