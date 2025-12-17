"use client";
import { CallStatus, CallType } from "@/app/call.types";
import { Typography } from "@/components/custom/Typography";
import { Loader2, Mic, Phone, User } from "lucide-react";

interface VideoDisplayProps {
  callType: CallType;
  callStatus: CallStatus;
  isVideoEnabled: boolean;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export default function VideoDisplay({
  callType,
  callStatus,
  isVideoEnabled,
  isListening = false,
  isSpeaking = false,
}: VideoDisplayProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {callType === "video" && isVideoEnabled ? (
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse shadow-lg shadow-purple-500/50">
            <User className="w-16 h-16 text-white" />
          </div>
          <Typography variant="h3" className="text-white mb-2">
            AI Assistant
          </Typography>
          <Typography variant="small" className="text-slate-400">
            Video Connected
          </Typography>
          
          {/* Voice Status Indicator */}
          {isListening && (
            <div className="mt-4 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center gap-2">
              <Mic className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-300 text-sm font-medium">Listening...</span>
            </div>
          )}
          {isSpeaking && (
            <div className="mt-4 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-blue-300 text-sm font-medium">Speaking...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse shadow-lg shadow-blue-500/50">
            <Phone className="w-16 h-16 text-white" />
          </div>
          <Typography variant="h3" className="text-white mb-2">
            AI Assistant
          </Typography>
          <Typography variant="small" className="text-slate-400 mb-4">
            {callStatus === "ringing"
              ? "Connecting..."
              : "Voice Call Active"}
          </Typography>
          
          {/* Voice Status Indicator */}
          <div className="flex justify-center">
            {isListening ? (
              <div className="bg-red-500/20 backdrop-blur-sm px-6 py-3 rounded-full inline-flex items-center gap-3">
                <Mic className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-red-300 text-base font-medium">Listening to you...</span>
              </div>
            ) : isSpeaking ? (
              <div className="bg-blue-500/20 backdrop-blur-sm px-6 py-3 rounded-full inline-flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                <span className="text-blue-300 text-base font-medium">AI is speaking...</span>
              </div>
            ) : (
              <div className="bg-green-500/20 backdrop-blur-sm px-6 py-3 rounded-full inline-flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-base font-medium">Ready to listen</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}