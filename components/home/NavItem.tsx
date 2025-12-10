import React from 'react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  sidebarOpen: boolean;
  badge?: string | null;
}

export const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label, 
  active = false, 
  sidebarOpen, 
  badge = null 
}) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
        active
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          : 'hover:bg-slate-800 text-slate-400 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {sidebarOpen && (
        <>
          <span className="flex-1 text-left font-medium">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-semibold">
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
};