
import React, { useState } from 'react';
import { Card, Button } from './UIElements';
import { InvestmentAccountType } from '../types';
import { ShieldCheck, ArrowRight, LogIn, UserPlus, Key, Layout } from 'lucide-react';

interface AuthProps {
  onSuccess: (userData: any) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess, onBack }) => {
  const [view, setView] = useState<'selection' | 'login' | 'signup'>('selection');
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
    // Set onboarded to true to bypass onboarding flow for the demo
    setTimeout(() => {
      onSuccess({
        ...DEMO_USER,
        id: 'usr_demo_vanderbilt',
        onboarded: true
      });
    }, 400);
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
            <span className="font-bold text-white tracking-tighter">DIVERSIFY</span>
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

            <div className="py-4">
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
          <span className="font-bold text-white tracking-tighter">DIVERSIFY</span>
        </button>
      </div>

      <Card className="w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-300 border-[#2F80ED]/10">
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
              I accept the DIVERSIFY Terms & Conditions and acknowledge the risk of private market investments.
            </label>
          </div>

          <Button className="w-full py-4 flex items-center justify-center gap-2 group">
            {view === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>

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
