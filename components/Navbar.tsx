import React, { useState, useEffect } from 'react';
import { Button, T } from './UIElements';

export type LandingTab = 'invest' | 'raise';

interface NavbarProps {
  onAccess: () => void;
  activeTab: LandingTab;
  onTabChange: (tab: LandingTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onAccess, activeTab, onTabChange }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? `${T.surface}F0` : 'transparent',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
            <div className="absolute inset-1.5 rotate-45 rounded-sm" style={{ background: T.bg }} />
          </div>
          <span className="text-base font-black tracking-[0.15em] uppercase" style={{ color: T.text }}>
            Diversify
          </span>
        </div>

        {/* Tab Switcher */}
        <div
          className="hidden md:flex items-center gap-1 p-1 rounded-sm"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          <button
            onClick={() => onTabChange('invest')}
            className="px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all duration-200"
            style={{
              background: activeTab === 'invest' ? T.gold : 'transparent',
              color: activeTab === 'invest' ? '#000' : T.textSub,
            }}
          >
            Invest With Us
          </button>
          <button
            onClick={() => onTabChange('raise')}
            className="px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all duration-200"
            style={{
              background: activeTab === 'raise' ? T.gold : 'transparent',
              color: activeTab === 'raise' ? '#000' : T.textSub,
            }}
          >
            Raise Capital
          </button>
        </div>

        <Button onClick={onAccess} size="sm">
          Access Platform
        </Button>
      </div>
    </nav>
  );
};
