import React from 'react';
import { LogOut, LayoutDashboard, User, Settings, Bell, Search, Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
  userProfile?: { name: string; avatar: string };
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, userProfile }) => {
  return (
    <div className="flex flex-col h-screen bg-background-dark text-gray-300 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-background-dark/95 backdrop-blur z-20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('DASHBOARD')}>
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Counselor Assistant</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
            <Bell size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
            <Settings size={20} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 cursor-pointer">
            <img 
              src={userProfile?.avatar || "https://picsum.photos/200"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;