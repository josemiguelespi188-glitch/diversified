
import React, { useState } from 'react';
import { T } from './UIElements';
import { adminLogin } from '../lib/adminAuth';
import { Lock, Eye, EyeOff, AlertCircle, ChevronLeft } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onSuccess, onBack }) => {
  const defaultEmail = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@axisplatform.com';
  const defaultPwd   = import.meta.env.VITE_ADMIN_PASSWORD ?? 'AxisPortal#2026';

  const [email, setEmail]       = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPwd);
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = adminLogin(email, password);
      setLoading(false);
      if (ok) {
        onSuccess();
      } else {
        setError('Invalid credentials.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: T.bg }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
            <div className="absolute inset-1 rotate-45 rounded-sm" style={{ background: T.bg }} />
          </div>
          <span className="text-sm font-black tracking-[0.18em] uppercase" style={{ color: T.text }}>Diversify</span>
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: T.goldFaint, color: T.gold, border: `1px solid ${T.gold}30` }}>Admin</span>
        </div>

        <div className="rounded-md p-8" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                <Lock size={16} style={{ color: T.gold }} />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-widest" style={{ color: T.text }}>Admin Portal</h1>
                <p className="text-[10px]" style={{ color: T.textDim }}>Restricted access</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
              style={{ color: T.textDim }}
            >
              <ChevronLeft size={12} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
                style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 rounded-sm text-sm outline-none"
                  style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: T.textDim }}
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs" style={{ background: '#ff4d4d15', border: '1px solid #ff4d4d30', color: '#ff8080' }}>
                <AlertCircle size={12} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-sm text-xs font-black uppercase tracking-widest transition-opacity"
              style={{ background: T.gold, color: '#000', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
