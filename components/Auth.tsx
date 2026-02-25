
import React, { useState } from 'react';
import { Card, Button } from './UIElements';
import { InvestmentAccountType } from '../types';
import { ShieldCheck, ArrowRight, ArrowLeft, LogIn, UserPlus, Key, Layout, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

interface AuthProps {
  onSuccess: (userData: any) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onBack }) => {
  const [view, setView] = useState<'selection' | 'login' | 'signup'>('selection');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    account_type: InvestmentAccountType.INDIVIDUAL
  });

  const DEMO_USER = {
    full_name: 'Alexander Vanderbilt',
    email: 'a.vanderbilt@private-office.com',
    password: 'secure_password_123',
    account_type: InvestmentAccountType.TRUST
  };

  const handleDemoAccess = () => {
    setFormData(DEMO_USER);
    setTimeout(() => {
      onSuccess({
        ...DEMO_USER,
        id: 'usr_demo_vanderbilt',
        onboarded: true
      });
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const result = await signInWithGoogle();
      const firebaseUser = result.user;
      onSuccess({
        id: firebaseUser.uid,
        full_name: firebaseUser.displayName ?? 'Investor',
        email: firebaseUser.email ?? '',
        account_type: InvestmentAccountType.INDIVIDUAL,
        onboarded: false,
      });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setGoogleError('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      ...formData,
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      onboarded: false
    });
  };

  if (view === 'selection') {
    return (
      <div className="min-h-screen bg-[#081C3A] flex items-center justify-center p-6">
        <div className="absolute top-8 left-8">
          <button onClick={onBack} className="flex items-center gap-2 text-[#8FAEDB] hover:text-white transition-colors">
            <div className="w-8 h-8 bg-[#2F80ED] rounded rotate-45 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
            </div>
            <span className="font-bold text-white tracking-tighter">Diversified</span>
          </button>
        </div>

        <Card className="w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-300 border-[#2F80ED]/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2F80ED]/10 text-[#2F80ED] mb-6 cyan-glow border border-[#2F80ED]/20">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Institutional Access</h1>
            <p className="text-[#8FAEDB] text-sm mt-2 font-medium opacity-60 uppercase tracking-widest">Select your entry point</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setView('login')}
              className="w-full group flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-xl hover:border-[#2F80ED] hover:bg-[#2F80ED]/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2F80ED]/20 flex items-center justify-center text-[#2F80ED]">
                  <LogIn size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-white uppercase tracking-wider text-sm">Sign In</span>
                  <span className="text-[10px] text-[#8FAEDB] uppercase tracking-widest">Existing Portfolio Access</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#8FAEDB] group-hover:text-[#2F80ED] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setView('signup')}
              className="w-full group flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-xl hover:border-[#00E0C6] hover:bg-[#00E0C6]/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00E0C6]/20 flex items-center justify-center text-[#00E0C6]">
                  <UserPlus size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-white uppercase tracking-wider text-sm">Open Account</span>
                  <span className="text-[10px] text-[#8FAEDB] uppercase tracking-widest">New Institutional Client</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#8FAEDB] group-hover:text-[#00E0C6] group-hover:translate-x-1 transition-all" />
            </button>

            <div className="py-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-bold text-[#8FAEDB]/40"><span className="bg-[#0F2A4A] px-2">Development Access</span></div>
              </div>
            </div>

            <button
              onClick={handleDemoAccess}
              className="w-full group flex items-center justify-between p-6 bg-[#2F80ED]/10 border border-[#2F80ED]/30 rounded-xl hover:bg-[#2F80ED]/20 cyan-glow transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2F80ED] flex items-center justify-center text-white">
                  <Layout size={20} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-white uppercase tracking-wider text-sm">Institutional Demo</span>
                  <span className="text-[10px] text-[#2F80ED] uppercase tracking-widest font-bold">Bypass Onboarding • Test Portfolio</span>
                </div>
              </div>
              <ArrowRight size={18} className="text-[#2F80ED] group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] text-[#8FAEDB]/40 uppercase tracking-widest leading-relaxed">
              Protected by military-grade encryption.<br/>Authorized access only.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081C3A] flex items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <button onClick={() => setView('selection')} className="flex items-center gap-2 text-[#8FAEDB] hover:text-white transition-colors">
          <div className="w-8 h-8 bg-[#2F80ED] rounded rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
          </div>
          <span className="font-bold text-white tracking-tighter">Diversified</span>
        </button>
      </div>

      <Card className="w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-300 border-[#2F80ED]/10">
        <button
          onClick={() => setView('selection')}
          className="flex items-center gap-1.5 text-[#8FAEDB] hover:text-white transition-colors mb-6 text-[11px] uppercase tracking-widest font-bold"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2F80ED]/10 text-[#2F80ED] mb-4">
            {view === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
            {view === 'login' ? 'Investor Sign In' : 'Institutional Onboarding'}
          </h1>
          <p className="text-[#8FAEDB] text-sm mt-2 uppercase tracking-widest opacity-60 text-[10px]">Private Capital Infrastructure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {view === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Full Legal Name</label>
              <input
                required
                type="text"
                className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white focus:border-[#2F80ED] outline-none transition-all"
                placeholder="As shown on ID"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Email Address</label>
            <input
              required
              type="email"
              className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white focus:border-[#2F80ED] outline-none transition-all"
              placeholder="name@firm.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {view === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Account Type</label>
              <select
                className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white focus:border-[#2F80ED] outline-none transition-all appearance-none"
                value={formData.account_type}
                onChange={e => setFormData({...formData, account_type: e.target.value as InvestmentAccountType})}
              >
                {Object.values(InvestmentAccountType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Password</label>
            <input
              required
              type="password"
              className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white focus:border-[#2F80ED] outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex items-start gap-3 py-2">
            <input type="checkbox" required className="mt-1 accent-[#2F80ED]" id="terms" />
            <label htmlFor="terms" className="text-[10px] text-[#8FAEDB] leading-relaxed">
              I accept the Diversified Terms & Conditions and acknowledge the risk of private market investments.
            </label>
          </div>

          <Button className="w-full py-4 flex items-center justify-center gap-2 group">
            {view === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>

          <>
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] font-bold text-[#8FAEDB]/40">
                <span className="bg-[#0F2A4A] px-2">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-white/80 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              <span className="text-sm font-semibold text-gray-700">
                {googleLoading ? 'Connecting...' : view === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
              </span>
            </button>

            {googleError && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-[11px] text-red-400">{googleError}</p>
              </div>
            )}
          </>

          <button
            type="button"
            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
            className="w-full text-[10px] text-[#8FAEDB] hover:text-white uppercase tracking-widest font-bold transition-colors"
          >
            {view === 'login' ? "Don't have an account? Create one" : "Already have an account? Sign In"}
          </button>
        </form>

        <p className="text-center text-[10px] text-[#8FAEDB] mt-8 uppercase tracking-widest opacity-40">
          Secure Multi-Factor Authentication Active
        </p>
      </Card>
    </div>
  );
};
