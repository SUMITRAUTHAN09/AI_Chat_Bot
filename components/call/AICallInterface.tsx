'use client';

import { Button } from '@/components/ui/button';
import { useAICall } from '@/hooks/useAICall';
import {
  Bot,
  Loader2,
  MessageSquare,
  Mic,
  PhoneOff,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AICallInterfaceProps {
  aiModel: string;
  callType: 'voice' | 'video';
  onEndCall: () => void;
}

export default function AICallInterface({ 
  aiModel, 
  callType, 
  onEndCall 
}: AICallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aiVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    isSpeaking,
    isThinking,
    messages,
    error,
    startCall,
    endCall,
    sendMessage,
  } = useAICall({
    callId: `ai-call-${Date.now()}`,
    userId: 'user-123',
    callType,
    aiModel,
    voiceSettings: {
      voice: 'alloy',
      speed: 1.0,
    },
  });

  // Video URLs for AI states
  const VIDEO_URLS = {
    listening: "/videos/listening.mp4",
    thinking: "/videos/thinking.mp4",
    talking: "/videos/talking.mp4",
  };

  const [currentAIVideo, setCurrentAIVideo] = useState<string>("");
  const [currentState, setCurrentState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

  // Start call on mount
  useEffect(() => {
    startCall();
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [startCall]);

  // Initialize video stream for video calls
  useEffect(() => {
    if (callType === 'video' && videoRef.current) {
      initVideoStream();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [callType]);

  // Better state management for video switching
  useEffect(() => {
    let newState: 'idle' | 'listening' | 'thinking' | 'speaking' = 'idle';
    
    if (isListening) {
      newState = 'listening';
    } else if (isThinking) {
      newState = 'thinking';
    } else if (isSpeaking) {
      newState = 'speaking';
    }

    if (newState !== currentState) {
      console.log(`🎬 State changed: ${currentState} → ${newState}`);
      setCurrentState(newState);
    }
  }, [isListening, isThinking, isSpeaking, currentState]);

  // Handle video changes based on state
  useEffect(() => {
    const videoMap = {
      'idle': VIDEO_URLS.talking,
      'listening': VIDEO_URLS.listening,
      'thinking': VIDEO_URLS.thinking,
      'speaking': VIDEO_URLS.talking,
    };

    const videoToPlay = videoMap[currentState];

    if (videoToPlay !== currentAIVideo) {
      console.log(`🎥 Switching video to: ${videoToPlay}`);
      setCurrentAIVideo(videoToPlay);
      playAIVideo(videoToPlay);
    }
  }, [currentState]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playAIVideo = async (videoUrl: string) => {
    const video = aiVideoRef.current;
    if (!video) return;

    try {
      video.pause();
      video.src = videoUrl;
      await video.load();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`✅ Playing video: ${videoUrl}`);
      }
    } catch (error) {
      console.error("Error playing AI video:", error);
      
      try {
        video.src = videoUrl;
        await video.play();
      } catch (fallbackError) {
        console.error("Fallback video play failed:", fallbackError);
      }
    }
  };

  const initVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const handleEndCall = () => {
    endCall();
    onEndCall();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusInfo = () => {
    if (isListening) return { 
      text: "Listening", 
      color: "red", 
      icon: <Mic className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> 
    };
    if (isThinking) return { 
      text: "Thinking", 
      color: "yellow", 
      icon: <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> 
    };
    if (isSpeaking) return { 
      text: "Speaking", 
      color: "blue", 
      icon: <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> 
    };
    return { 
      text: "Ready", 
      color: "green", 
      icon: <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse" /> 
    };
  };

  const status = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <h2 className="text-white text-lg sm:text-xl font-semibold">AI Assistant Call</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Model: {aiModel} • {formatDuration(callDuration)}
              </p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {error && (
                <div className="text-red-300 text-xs sm:text-sm bg-red-500/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex-1 sm:flex-none">
                  {error}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="text-white hover:bg-white/10"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        <div className="max-w-9xl w-full h-full">
          {/* ✨ CHANGED: Flex column on mobile, grid on desktop */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 h-full">
            
            {/* Video/Avatar Area - BIGGER on mobile */}
            <div className="lg:col-span-2 order-1 flex-1 lg:flex-none">
              <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] lg:min-h-0 lg:aspect-video rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900 shadow-2xl">
                {callType === 'video' ? (
                  <>
                    {/* Main Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />

                    {/* Video Previews Container */}
                    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-8">
                      {/* ✨ CHANGED: Stack videos vertically on mobile for bigger display */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 w-full h-full max-w-7xl">
                        
                        {/* User Video Preview */}
                        <div className="flex-1 bg-slate-800 border-2 sm:border-3 md:border-4 border-slate-600 rounded-xl md:rounded-2xl overflow-hidden relative shadow-2xl">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-400" />
                              <span className="text-white text-xs sm:text-sm md:text-base font-medium">You</span>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 bg-green-500/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                              <span className="text-white text-xs sm:text-sm font-medium">Live</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Video Preview - BIGGER */}
                        <div className="flex-1 bg-slate-900 border-2 sm:border-3 md:border-4 border-indigo-600 rounded-xl md:rounded-2xl overflow-hidden relative shadow-2xl">
                          {currentAIVideo ? (
                            <video
                              ref={aiVideoRef}
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error("Video error:", e);
                              }}
                              onLoadedData={() => {
                                console.log("Video loaded successfully");
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                              <Bot className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white opacity-50" />
                            </div>
                          )}

                          {/* Status Badge */}
                          <div
                            className={`absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 ${
                              status.color === "red"
                                ? "bg-red-500/90"
                                : status.color === "yellow"
                                ? "bg-yellow-500/90"
                                : status.color === "blue"
                                ? "bg-blue-500/90"
                                : "bg-green-500/90"
                            } backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 sm:gap-2 shadow-lg`}
                          >
                            {status.icon}
                            <span className="text-white text-xs sm:text-sm md:text-base font-bold">
                              {status.text}
                            </span>
                          </div>

                          {/* AI Label */}
                          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 md:bottom-4 md:left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 flex items-center gap-1.5 sm:gap-2">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-indigo-400" />
                            <span className="text-white text-xs sm:text-sm md:text-base font-medium">SumNex</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-xl border-2 sm:border-3 md:border-4 border-white/30 mb-3 sm:mb-4">
                        <Bot className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm px-4 py-2 sm:px-6 sm:py-3 rounded-full inline-flex items-center gap-2 sm:gap-3">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          isListening ? 'bg-red-500 animate-pulse' : 
                          isThinking ? 'bg-yellow-500 animate-pulse' :
                          isSpeaking ? 'bg-blue-500 animate-pulse' : 
                          'bg-green-500'
                        }`} />
                        <span className="text-white text-sm sm:text-base font-medium">
                          {isListening ? 'Listening...' : 
                           isThinking ? 'Thinking...' :
                           isSpeaking ? 'SumNex Speaking...' : 
                           'Ready to listen'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Sidebar - SMALLER on mobile */}
            <div className="lg:col-span-1 order-2 flex-shrink-0">
              {/* ✨ CHANGED: Much smaller height on mobile (180px), bigger on desktop */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl md:rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden h-[180px] sm:h-[250px] md:h-[350px] lg:h-[500px]">
                {/* Header */}
                <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex-shrink-0">
                  <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg">Conversation</h3>
                  <p className="text-slate-400 text-xs sm:text-sm">{messages.length} messages</p>
                </div>

                {/* Messages Area */}
                <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 md:p-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <div className="text-center">
                        <Bot className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                        <p className="text-xs sm:text-sm">Conversation will appear here</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-end min-h-full space-y-2 sm:space-y-3 md:space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 sm:gap-3 ${
                            message.type === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {/* AI Avatar */}
                          {message.type === "ai" && (
                            <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                              <Bot className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`max-w-[80%] rounded-xl md:rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 shadow-lg break-words ${
                              message.type === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-white border border-slate-700"
                            }`}
                          >
                            <p className="text-xs sm:text-sm leading-relaxed">
                              {message.text}
                            </p>
                            <p
                              className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-right ${
                                message.type === "user"
                                  ? "text-blue-100"
                                  : "text-slate-400"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          {/* User Avatar */}
                          {message.type === "user" && (
                            <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
            </Button>

            <Button
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-red-500 hover:bg-red-600 text-white shadow-lg"
            >
              <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </Button>

            <div className="w-12 sm:w-14 md:w-16" />
          </div>

          <div className="mt-3 sm:mt-4 text-center">
            <p className="text-slate-400 text-xs sm:text-sm px-2">
              {isListening ? '🎤 Listening to your voice...' : 
               isThinking ? '🧠 SumNex is thinking...' :
               isSpeaking ? '🗣️ SumNex is speaking...' : 
               '💬 Speak naturally - SumNex will respond automatically'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}