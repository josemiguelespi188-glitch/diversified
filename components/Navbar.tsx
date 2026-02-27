
import React from 'react';
import { Button } from './UIElements';

export const Navbar: React.FC<{ onAccess: () => void }> = ({ onAccess }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 py-4 px-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#2F80ED] rounded rotate-45 flex items-center justify-center">
          <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
        </div>
        <span className="text-xl font-bold text-white tracking-tighter">DiverCfly<span className="text-[10px] align-top">TM</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8FAEDB]">
        <a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">Infrastructure</a>
        <a href="#deals" className="hover:text-white transition-colors">Sponsors</a>
        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
      </div>

      <Button onClick={onAccess} className="text-xs px-4 py-2">Access Platform</Button>
    </nav>
  );
};
