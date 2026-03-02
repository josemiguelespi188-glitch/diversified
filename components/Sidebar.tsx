import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  Landmark,
  FileText,
  UserCheck,
  Settings,
  LogOut,
  MessageCircle,
  TrendingUp,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import { T } from './UIElements';
import { User as UserType, DocumentStatus } from '../types';

interface SidebarProps {
  user: UserType;
  currentView: string;
  setView: (view: string) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const NAV_MAIN = [
  { id: 'dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'portfolio',  label: 'Portfolio',       icon: PieChart },
  { id: 'accounts',   label: 'Ledger',          icon: Landmark },
];

const NAV_REPORTS = [
  { id: 'distributions', label: 'Distributions', icon: TrendingUp },
  { id: 'documents',     label: 'Documents',     icon: FileText },
  { id: 'accreditation', label: 'Accreditation', icon: UserCheck },
];

const NAV_ADMIN = [
  { id: 'calls', label: 'Calls Calendar', icon: CalendarDays },
];

const NAV_FOOTER = [
  { id: 'support',  label: 'Support',  icon: MessageCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const NavItem: React.FC<{
  item: { id: string; label: string; icon: React.FC<{ size?: number }> };
  active: boolean;
  onClick: () => void;
}> = ({ item, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-sm transition-all duration-150 group text-left"
    style={{
      background: active ? T.goldFaint : 'transparent',
      borderLeft: active ? `2px solid ${T.gold}` : '2px solid transparent',
      color: active ? T.gold : T.textDim,
    }}
  >
    <item.icon size={15} />
    <span
      className="text-[10px] font-bold uppercase tracking-widest transition-colors group-hover:text-amber-400"
      style={{ color: active ? T.gold : T.textDim }}
    >
      {item.label}
    </span>
  </button>
);

const NavGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-0.5">
    <p
      className="px-4 pt-4 pb-2 text-[9px] font-black uppercase tracking-[0.3em]"
      style={{ color: T.textDim }}
    >
      {label}
    </p>
    {children}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  currentView,
  setView,
  onLogout,
  onOpenProfile,
}) => {
  const initials = user.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const isAccredited = user.accreditation_status === DocumentStatus.VERIFIED;

  return (
    <aside
      className="w-56 h-screen fixed left-0 top-0 flex flex-col z-40"
      style={{
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 py-5"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <div className="relative w-6 h-6 flex-shrink-0">
          <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
          <div className="absolute inset-1 rotate-45 rounded-sm" style={{ background: T.surface }} />
        </div>
        <span className="text-sm font-black tracking-[0.18em] uppercase" style={{ color: T.text }}>
          Diversify
        </span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2">
        <NavGroup label="Main">
          {NAV_MAIN.map((item) => (
            <NavItem key={item.id} item={item} active={currentView === item.id} onClick={() => setView(item.id)} />
          ))}
        </NavGroup>

        <NavGroup label="Reports">
          {NAV_REPORTS.map((item) => (
            <NavItem key={item.id} item={item} active={currentView === item.id} onClick={() => setView(item.id)} />
          ))}
        </NavGroup>

        <NavGroup label="Admin">
          {NAV_ADMIN.map((item) => (
            <NavItem key={item.id} item={item} active={currentView === item.id} onClick={() => setView(item.id)} />
          ))}
        </NavGroup>

        <NavGroup label="System">
          {NAV_FOOTER.map((item) => (
            <NavItem key={item.id} item={item} active={currentView === item.id} onClick={() => setView(item.id)} />
          ))}
        </NavGroup>
      </div>

      {/* User */}
      <div style={{ borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={onOpenProfile}
          className="w-full p-4 flex items-center gap-3 group transition-all"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.raised)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{
              background: T.goldFaint,
              border: `1px solid ${T.gold}40`,
              color: T.gold,
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[11px] font-bold uppercase truncate" style={{ color: T.text }}>
              {user.full_name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: isAccredited ? T.jade : T.gold }}
              />
              <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: isAccredited ? T.jade : T.gold }}>
                {isAccredited ? 'Accredited' : 'Pending Review'}
              </p>
            </div>
          </div>
          <ChevronRight size={12} style={{ color: T.textDim }} />
        </button>

        <button
          onClick={onLogout}
          className="w-full px-4 py-3 flex items-center gap-3 transition-colors group"
          style={{ borderTop: `1px solid ${T.border}` }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.rubyFaint)}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={13} style={{ color: T.textDim }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
            Sign Out
          </span>
        </button>

        <p
          className="text-center py-2 text-[8px] uppercase tracking-[0.3em]"
          style={{ color: T.textDim, borderTop: `1px solid ${T.border}` }}
        >
          Private Capital
        </p>
      </div>
    </aside>
  );
};
