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
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    isSpeaking,
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

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-semibold">AI Assistant Call</h2>
            <p className="text-slate-400 text-sm">
              Model: {aiModel} • {formatDuration(callDuration)}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {error && (
              <div className="text-red-300 text-sm bg-red-500/20 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="text-white hover:bg-white/10"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video/Avatar Area */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900 shadow-2xl">
                {callType === 'video' ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white text-sm font-medium">Live</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl border-4 border-white/30 mb-4">
                        <Bot className="w-16 h-16 text-white" />
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full inline-flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isListening ? 'bg-red-500 animate-pulse' : 
                          isSpeaking ? 'bg-blue-500 animate-pulse' : 
                          'bg-green-500'
                        }`} />
                        <span className="text-white text-base font-medium">
                          {isListening ? 'Listening...' : 
                           isSpeaking ? 'AI Speaking...' : 
                           'Ready to listen'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Overlays */}
                {isListening && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-full flex items-center justify-center gap-2">
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span className="font-medium">Listening to you...</span>
                    </div>
                  </div>
                )}

                {isSpeaking && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-blue-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-full flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-medium">AI is responding...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl h-full flex flex-col overflow-hidden">
                <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
                  <h3 className="text-white font-semibold text-lg">Conversation</h3>
                  <p className="text-slate-400 text-sm">{messages.length} messages</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400">
                        <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Conversation will appear here</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.type === 'ai' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-lg ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-800 text-white border border-slate-700'
                          }`}>
                            <p className="text-sm leading-relaxed break-words">{message.text}</p>
                            <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                              {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {message.type === 'user' && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className={`rounded-full w-16 h-16 ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>

            <Button
              size="lg"
              onClick={handleEndCall}
              className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600 text-white shadow-lg"
            >
              <PhoneOff className="w-8 h-8" />
            </Button>

            <div className="w-16" /> {/* Spacer for symmetry */}
          </div>

          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">
              {isListening ? '🎤 Listening to your voice...' : 
               isSpeaking ? '🤖 AI is speaking...' : 
               '💬 Speak naturally - AI will respond automatically'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}