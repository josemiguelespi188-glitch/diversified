import React, { useState, useEffect } from 'react';
import { Button, T } from './UIElements';

export const Navbar: React.FC<{
  onAccess: () => void;
  onPortfolio?: () => void;
  onRaise?: () => void;
}> = ({ onAccess, onPortfolio, onRaise }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = "text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 hover:text-amber-400 bg-transparent border-0 cursor-pointer";

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
            <div
              className="absolute inset-0 rotate-45 rounded-sm"
              style={{ background: T.gold }}
            />
            <div
              className="absolute inset-1.5 rotate-45 rounded-sm"
              style={{ background: T.bg }}
            />
          </div>
          <span className="text-base font-black tracking-[0.15em] uppercase" style={{ color: T.text }}>
            Diversify
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {onPortfolio && (
            <button onClick={onPortfolio} className={linkClass} style={{ color: T.textSub }}>Portfolio</button>
          )}
          {onRaise && (
            <button onClick={onRaise} className={linkClass} style={{ color: T.textSub }}>Raise Capital</button>
          )}
          <a href="#philosophy" className={linkClass} style={{ color: T.textSub }}>Philosophy</a>
        </div>

        <Button onClick={onAccess} size="sm">
          Access Platform
        </Button>
      </div>
    </nav>
  );
};
