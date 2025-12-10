"use client";

import { Headphones, MessageSquare, Phone, Sparkles, Video } from "lucide-react";
import React from "react";
import { Typography } from "../custom/Typography";

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  color: string;
  badge?: string | null;
}

// ----------------------
// Quick Action Button
// ----------------------
export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  color,
  badge,
}) => {
  return (
    <button className="group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95">
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-semibold text-white">
          {badge}
        </span>
      )}
      <div
        className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <Typography variant="small" className="text-left text-white">
        {label}
      </Typography>
    </button>
  );
};

export const QuickActions: React.FC = () => {
  const quickActions = [
    { icon: MessageSquare, label: "New Chat", color: "from-blue-500 to-cyan-500", badge: null },
    { icon: Phone, label: "Voice Call", color: "from-purple-500 to-pink-500", badge: null },
    { icon: Video, label: "Video Call", color: "from-orange-500 to-red-500", badge: "New" },
    { icon: Headphones, label: "Support", color: "from-green-500 to-emerald-500", badge: null },
  ];

  return (
    <div>
      <Typography variant="h3" className="mb-4 flex items-center gap-2 text-white">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        Quick Actions
      </Typography>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </div>
    </div>
  );
};
