
import React from 'react';
import { LayoutDashboard, PieChart, Landmark, FileText, UserCheck, Settings, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { User as UserType, DocumentStatus } from '../types';

interface SidebarProps {
  user: UserType;
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentView, setView, onLogout, onOpenProfile }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'distributions', label: 'Distributions', icon: Landmark },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'accreditation', label: 'Accreditation', icon: UserCheck },
  ];

  const userInitials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isAccredited = user.accreditation_status === DocumentStatus.VERIFIED;

  return (
    <aside className="w-64 h-screen glass-panel fixed left-0 top-0 border-r border-white/5 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 px-4 py-8 mb-4 border-b border-white/5">
        <div className="w-8 h-8 bg-[#2F80ED] rounded rotate-45"></div>
        <span className="text-xl font-bold text-white tracking-tight">DiverCfly</span>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
              currentView === item.id 
                ? 'bg-[#2F80ED]/10 text-[#2F80ED]' 
                : 'text-[#8FAEDB] hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} className={currentView === item.id ? 'text-[#2F80ED]' : 'text-[#8FAEDB] group-hover:text-white'} />
            <span className="text-sm font-semibold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        {/* User Card - Clickable to open Profile Panel */}
        <button 
          onClick={onOpenProfile}
          className="w-full text-left bg-white/5 border border-white/10 p-3 rounded-xl hover:border-[#2F80ED]/50 hover:bg-[#2F80ED]/5 transition-all group relative"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2F80ED]/20 flex items-center justify-center text-[#2F80ED] border border-[#2F80ED]/30 font-bold text-sm">
              {userInitials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[11px] font-bold text-white uppercase truncate tracking-tight">{user.full_name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isAccredited ? 'bg-[#00E0C6] cyan-glow' : 'bg-yellow-500'}`}></div>
                <p className={`text-[8px] uppercase tracking-widest font-bold ${isAccredited ? 'text-[#00E0C6]' : 'text-yellow-500'}`}>
                  {isAccredited ? 'Accredited' : 'Awaiting Review'}
                </p>
              </div>
            </div>
            <ChevronRight size={14} className="text-[#8FAEDB] group-hover:text-white transition-all" />
          </div>
        </button>

        {/* Secondary Navigation Section */}
        <div className="space-y-1 px-1">
          <button
            onClick={() => setView('accounts')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              currentView === 'accounts' 
                ? 'bg-[#2F80ED]/10 text-[#2F80ED]' 
                : 'text-[#8FAEDB] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Landmark size={16} className={currentView === 'accounts' ? 'text-[#2F80ED]' : 'text-[#8FAEDB] group-hover:text-white'} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Accounts</span>
          </button>

          <button
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              currentView === 'settings' 
                ? 'bg-[#2F80ED]/10 text-[#2F80ED]' 
                : 'text-[#8FAEDB] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings size={16} className={currentView === 'settings' ? 'text-[#2F80ED]' : 'text-[#8FAEDB] group-hover:text-white'} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Settings</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#8FAEDB] hover:text-red-400 hover:bg-red-400/5 transition-all group"
          >
            <LogOut size={16} className="group-hover:text-red-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Log Out</span>
          </button>
        </div>

        <p className="text-[8px] text-[#8FAEDB]/30 uppercase tracking-[0.3em] text-center pt-2">
          Private Capital Infrastructure
        </p>
      </div>
    </aside>
  );
};
