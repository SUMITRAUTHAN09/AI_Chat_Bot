import React from 'react';
import { Typography } from "../custom/Typography";

export const WelcomeSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <Typography 
            variant="h2" 
            className="mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Welcome back, John! 👋
          </Typography>
          <Typography variant="paragraph" className="text-slate-400">
            Ready to connect with your AI assistant?
          </Typography>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Typography variant="small" className="text-green-400">
            Online
          </Typography>
        </div>
      </div>
    </div>
  );
};
