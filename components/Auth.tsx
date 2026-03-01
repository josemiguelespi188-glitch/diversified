import React, { useState } from 'react';
import { Button, Input, Select, T } from './UIElements';
import { InvestmentAccountType } from '../types';
import { ArrowRight, LogIn, UserPlus, LayoutDashboard, Lock } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface AuthProps {
  onSuccess: (userData: any) => void;
  onBack: () => void;
}

const Logo: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <button onClick={onBack} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
    <div className="relative w-6 h-6">
      <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
      <div className="absolute inset-1 rotate-45 rounded-sm" style={{ background: T.bg }} />
    </div>
    <span className="text-sm font-black tracking-[0.18em] uppercase" style={{ color: T.text }}>Diversify</span>
  </button>
);

const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="w-full max-w-md rounded-md overflow-hidden"
    style={{ background: T.surface, border: `1px solid ${T.border}` }}
  >
    {children}
  </div>
);

const DEMO_USER = {
  full_name: 'Alexander Vanderbilt',
  email: 'a.vanderbilt@private-office.com',
  account_type: InvestmentAccountType.TRUST,
  id: 'usr_demo_vanderbilt',
  onboarded: true,
  accreditation_status: 'Verified' as const,
  identity_status: 'Verified' as const,
};

export const Auth: React.FC<AuthProps> = ({ onSuccess, onBack }) => {
  const [view, setView] = useState<'selection' | 'login' | 'signup'>('selection');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    account_type: InvestmentAccountType.INDIVIDUAL,
  });
  const [loading, setLoading] = useState(false);

  const handleDemoAccess = () => {
    setLoading(true);
    trackEvent('button_click', { button_name: 'demo_access', page: 'auth' });
    trackEvent('login_started');
    setTimeout(() => {
      trackEvent('login_success', { has_previous_account: true });
      onSuccess(DEMO_USER);
      setLoading(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isLogin = view === 'login';
    trackEvent('button_click', { button_name: isLogin ? 'sign_in_submit' : 'create_account_submit', page: 'auth' });
    setTimeout(() => {
      if (isLogin) {
        trackEvent('login_success', { has_previous_account: true });
      } else {
        trackEvent('account_created', { account_type: formData.account_type });
      }
      onSuccess({ ...formData, id: 'usr_' + Math.random().toString(36).substr(2, 9), onboarded: false });
      setLoading(false);
    }, 400);
  };

  // ── Selection view ──────────────────────────────────────────────────────────
  if (view === 'selection') {
    const options = [
      { id: 'login',  icon: LogIn,          label: 'Sign In',       sub: 'Existing investor access',    accent: T.gold },
      { id: 'signup', icon: UserPlus,        label: 'Open Account',  sub: 'New institutional client',    accent: T.jade },
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: T.bg }}>
        <div className="absolute top-6 left-8">
          <Logo onBack={onBack} />
        </div>

        <div className="w-full max-w-md space-y-3">
          {/* Header */}
          <div className="text-center mb-10 space-y-2">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center mx-auto mb-4"
              style={{ background: T.goldFaint, border: `1px solid ${T.gold}40` }}
            >
              <Lock size={20} style={{ color: T.gold }} />
            </div>
            <h1 className="text-xl font-black uppercase tracking-widest" style={{ color: T.text }}>
              Institutional Access
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: T.textDim }}>
              Select your entry point
            </p>
          </div>

          {/* Options */}
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                trackEvent(opt.id === 'login' ? 'login_started' : 'signup_started');
                setView(opt.id as 'login' | 'signup');
              }}
              className="w-full flex items-center justify-between p-5 rounded-sm transition-all duration-200 group"
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${opt.accent}40`; e.currentTarget.style.background = `${opt.accent}06`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; }}
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: `${opt.accent}15`, border: `1px solid ${opt.accent}30` }}>
                  <opt.icon size={17} style={{ color: opt.accent }} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{opt.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: T.textDim }}>{opt.sub}</p>
                </div>
              </div>
              <ArrowRight size={15} style={{ color: T.textDim }} />
            </button>
          ))}

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px" style={{ background: T.border }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[9px] font-black uppercase tracking-[0.3em]" style={{ background: T.bg, color: T.textDim }}>
                Development
              </span>
            </div>
          </div>

          {/* Demo */}
          <button
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full flex items-center justify-between p-5 rounded-sm transition-all duration-200"
            style={{ background: T.goldFaint, border: `1px solid ${T.gold}40` }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${T.gold}12`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = T.goldFaint; }}
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: T.gold }}>
                <LayoutDashboard size={17} style={{ color: '#000' }} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: T.gold }}>
                  {loading ? 'Loading…' : 'Institutional Demo'}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: T.goldDim }}>Skip onboarding · Full test portfolio</p>
              </div>
            </div>
            <ArrowRight size={15} style={{ color: T.gold }} />
          </button>

          <p className="text-center text-[9px] uppercase tracking-widest pt-4" style={{ color: T.textDim }}>
            Authorized access only · Military-grade encryption
          </p>
        </div>
      </div>
    );
  }

  // ── Form view ───────────────────────────────────────────────────────────────
  const isLogin = view === 'login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: T.bg }}>
      <div className="absolute top-6 left-8">
        <Logo onBack={() => setView('selection')} />
      </div>

      <AuthCard>
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center space-y-2" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center mx-auto mb-3"
            style={{ background: T.goldFaint, border: `1px solid ${T.gold}40` }}
          >
            {isLogin ? <LogIn size={18} style={{ color: T.gold }} /> : <UserPlus size={18} style={{ color: T.gold }} />}
          </div>
          <h1 className="text-sm font-black uppercase tracking-widest" style={{ color: T.text }}>
            {isLogin ? 'Investor Sign In' : 'Open Account'}
          </h1>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: T.textDim }}>
            Private Capital Infrastructure
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {!isLogin && (
            <Input
              label="Full Legal Name"
              required
              type="text"
              placeholder="As shown on government ID"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          )}

          <Input
            label="Email Address"
            required
            type="email"
            placeholder="investor@firm.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          {!isLogin && (
            <Select
              label="Primary Account Type"
              value={formData.account_type}
              onChange={(e) => setFormData({ ...formData, account_type: e.target.value as InvestmentAccountType })}
            >
              {Object.values(InvestmentAccountType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          )}

          <Input
            label="Password"
            required
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="flex items-start gap-3 py-1">
            <input
              type="checkbox"
              required
              id="terms"
              className="mt-0.5 accent-amber-500"
            />
            <label htmlFor="terms" className="text-[10px] leading-relaxed cursor-pointer" style={{ color: T.textSub }}>
              I accept the Terms & Conditions and acknowledge the inherent risks of private market investments.
            </label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Processing…' : isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={14} />
          </Button>

          <button
            type="button"
            onClick={() => setView(isLogin ? 'signup' : 'login')}
            className="w-full text-center text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-amber-400"
            style={{ color: T.textDim }}
          >
            {isLogin ? "Don't have an account? Open one" : 'Already have an account? Sign in'}
          </button>
        </form>
      </AuthCard>
    </div>
  );
};
