import React, { useState } from 'react';
import { Button, Input, T } from './UIElements';
import { InvestmentAccountType } from '../types';
import { ArrowRight, LogIn, UserPlus, LayoutDashboard, Lock } from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../lib/supabase';

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

const GoogleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GoogleButton: React.FC<{ loading: boolean; onClick: () => void }> = ({ loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center gap-3 p-4 rounded-sm transition-all duration-200 font-bold text-xs uppercase tracking-widest"
    style={{ background: '#fff', color: '#1a1a1a', border: '1px solid #e0e0e0', opacity: loading ? 0.7 : 1 }}
    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#f5f5f5'; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
  >
    <GoogleIcon />
    {loading ? 'Redirecting…' : 'Continue with Google'}
  </button>
);

const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div
    className="px-4 py-3 rounded-sm text-xs"
    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
  >
    {message}
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
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoAccess = () => {
    setLoading(true);
    setTimeout(() => { onSuccess(DEMO_USER); setLoading(false); }, 500);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err.message);
      setGoogleLoading(false);
    }
    // On success the browser is redirected to Google — no further action needed here.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isLogin = view === 'login';

    if (isLogin) {
      const { error: err } = await signIn(formData.email, formData.password);
      if (err) {
        setError(err.message);
        setLoading(false);
      }
      // On success, App.tsx onAuthStateChange handles routing — no action needed.
    } else {
      const { error: err } = await signUp(formData.email, formData.password, formData.full_name);
      if (err) {
        setError(err.message);
        setLoading(false);
      }
      // Supabase may require email confirmation depending on project settings.
      // onAuthStateChange in App.tsx will fire and route to PORTAL when confirmed.
    }
  };

  // ── Selection view ─────────────────────────────────────────────────────────
  if (view === 'selection') {
    const options = [
      { id: 'login',  icon: LogIn,   label: 'Sign In',      sub: 'Existing investor access',  accent: T.gold },
      { id: 'signup', icon: UserPlus, label: 'Open Account', sub: 'New institutional client', accent: T.jade },
    ];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: T.bg }}>
        <div className="absolute top-6 left-8">
          <Logo onBack={onBack} />
        </div>

        <div className="w-full max-w-md space-y-3">
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
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

          {/* Google — primary action */}
          {error && <ErrorBanner message={error} />}
          <GoogleButton loading={googleLoading} onClick={handleGoogleSignIn} />

          {/* Divider */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px" style={{ background: T.border }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[9px] font-black uppercase tracking-[0.3em]" style={{ background: T.bg, color: T.textDim }}>
                Or use email
              </span>
            </div>
          </div>

          {/* Email options */}
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setError(''); setView(opt.id as 'login' | 'signup'); }}
              className="w-full flex items-center justify-between p-5 rounded-sm transition-all duration-200"
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
          <div className="relative py-2">
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

          <p className="text-center text-[9px] uppercase tracking-widest pt-2" style={{ color: T.textDim }}>
            Authorized access only · Military-grade encryption
          </p>
        </div>
      </div>
    );
  }

  // ── Form view (email / password) ───────────────────────────────────────────
  const isLogin = view === 'login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: T.bg }}>
      <div className="absolute top-6 left-8">
        <Logo onBack={() => { setError(''); setView('selection'); }} />
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
        <div className="p-8 space-y-5">
          {/* Google — available on form views too */}
          <GoogleButton loading={googleLoading} onClick={handleGoogleSignIn} />

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px" style={{ background: T.border }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[9px] font-black uppercase tracking-[0.3em]" style={{ background: T.surface, color: T.textDim }}>
                Or continue with email
              </span>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <Input
              label="Password"
              required
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            {!isLogin && (
              <div className="flex items-start gap-3 py-1">
                <input type="checkbox" required id="terms" className="mt-0.5 accent-amber-500" />
                <label htmlFor="terms" className="text-[10px] leading-relaxed cursor-pointer" style={{ color: T.textSub }}>
                  I accept the Terms & Conditions and acknowledge the inherent risks of private market investments.
                </label>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Processing…' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={14} />
            </Button>

            <button
              type="button"
              onClick={() => { setError(''); setView(isLogin ? 'signup' : 'login'); }}
              className="w-full text-center text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-amber-400"
              style={{ color: T.textDim }}
            >
              {isLogin ? "Don't have an account? Open one" : 'Already have an account? Sign in'}
            </button>
          </form>
        </div>
      </AuthCard>
    </div>
  );
};
