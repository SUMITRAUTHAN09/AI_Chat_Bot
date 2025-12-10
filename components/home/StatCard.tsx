import React from 'react';
import { Typography } from "../custom/Typography";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 bg-slate-800/50 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
      <Typography variant="h3" className="mb-1 text-white">
        {value}
      </Typography>
      <Typography variant="small" className="text-slate-400">
        {label}
      </Typography>
    </div>
  );
};