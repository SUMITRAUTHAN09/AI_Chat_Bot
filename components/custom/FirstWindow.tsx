"use client";
import { useState } from 'react';
import { AIAssistantCard } from "../home/AiAssistantCard";
import { Header } from '../home/Header';
import { QuickActions } from '../home/QuickActionButton';
import { WelcomeSection } from '../home/WelcomSection';

export default function FirstWindow() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications] = useState(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Sidebar */}

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <Header notifications={notifications} />

        {/* Content Area */}
        <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <WelcomeSection />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <AIAssistantCard />
          </div>
        </div>
      </main>
    </div>
  );
}