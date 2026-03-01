import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './components/Portfolio';
import { InvestmentModal } from './components/InvestmentModal';
import { Accreditation } from './components/Accreditation';
import { Accounts } from './components/Accounts';
import { ProfilePanel } from './components/ProfilePanel';
import { Auth } from './components/Auth';
import { Distributions } from './components/Distributions';
import { Documents } from './components/Documents';
import { Support } from './components/Support';
import { Button, Badge, T } from './components/UIElements';
import { Deal, User, InvestmentRequest, InvestmentAccount, InvestmentAccountType } from './types';
import { MOCK_ACCOUNTS } from './constants';
import { Shield, BarChart2, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { getSession, onAuthStateChange, getProfile, upsertUserOnSignIn, signOut as supabaseSignOut } from './lib/supabase';

type AppState = 'LANDING' | 'AUTH' | 'PORTAL';

// ─── Landing Page ─────────────────────────────────────────────────────────────

const GridBg: React.FC = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(${T.border}60 1px, transparent 1px), linear-gradient(90deg, ${T.border}60 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
      maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)',
    }}
  />
);

const GlowOrb: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{ width: 700, height: 700, background: `radial-gradient(circle, ${T.gold}07 0%, transparent 70%)`, ...style }}
  />
);

const StatPill: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="px-6 py-4 rounded-sm text-center" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
    <p className="text-2xl font-black" style={{ color: T.gold }}>{value}</p>
    <p className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: T.textDim }}>{label}</p>
  </div>
);

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const principles = [
    { icon: Shield,   title: 'Committee-Led',        desc: 'Every deal passes a multi-stage review before reaching the platform. No exceptions.' },
    { icon: BarChart2, title: 'Institutional Reports', desc: 'Asset-level transparency, quarterly updates, and audit-grade documentation on every position.' },
    { icon: Users,    title: 'Aligned Capital',       desc: 'Our capital is invested alongside yours. We only succeed when you do.' },
    { icon: Zap,      title: 'Portfolio Approach',    desc: 'Strategy, geography, and asset class diversification built into every allocation.' },
  ];

  const checklist = [
    'Accredited investors only — U.S. & International',
    'Minimum investments from $20,000',
    'Institutional-grade underwriting on every deal',
    'Full document access, zero gatekeeping',
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: T.bg, color: T.text }}>
      <Navbar onAccess={onStart} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <GridBg />
        <GlowOrb style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <Badge variant="gold" className="mx-auto">
            Private Capital Infrastructure — Accredited Investors Only
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
            Institutional<br />
            <span style={{ color: T.gold }}>Private Capital</span><br />
            Done Right.
          </h1>

          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: T.textSub }}>
            Diversify aggregates accredited capital to access institutional-grade real estate deals — lower minimums, better terms, complete transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onStart} size="lg">
              Access the Platform <ArrowRight size={14} />
            </Button>
            <Button variant="outline" size="lg">
              Investment Philosophy
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4">
            <StatPill value="$2.1B+" label="Capital Deployed" />
            <StatPill value="38" label="Active Deals" />
            <StatPill value="14.2%" label="Avg. IRR" />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(to bottom, ${T.gold}60, transparent)` }} />
        </div>
      </section>

      {/* ── Philosophy ───────────────────────────────────────────────── */}
      <section id="philosophy" className="py-32 px-6 relative">
        <GlowOrb style={{ bottom: -200, right: -300, opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Our Philosophy</p>
          </div>
          <h2 className="text-4xl font-black uppercase mb-4" style={{ color: T.text }}>Institutional Discipline</h2>
          <p className="text-base mb-16 max-w-xl" style={{ color: T.textSub }}>
            We don't believe in picking individual deals. We build resilient, diversified capital portfolios through rigorous committee oversight.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {principles.map((p) => (
              <div
                key={p.title}
                className="p-6 rounded-sm group transition-all duration-300 space-y-4"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
              >
                <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                  <p.icon size={18} style={{ color: T.gold }} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{p.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-md p-12 md:p-20 text-center space-y-8 relative overflow-hidden"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${T.gold}05 0%, transparent 70%)` }} />
            <div className="relative z-10 space-y-8">
              <Badge variant="gold" className="mx-auto">Accredited Investors Only</Badge>
              <h2 className="text-4xl font-black uppercase" style={{ color: T.text }}>
                Ready for <span style={{ color: T.gold }}>Institutional Capital</span>?
              </h2>
              <ul className="space-y-2 text-left max-w-xs mx-auto">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle size={14} style={{ color: T.jade, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: T.textSub }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={onStart} size="lg" className="mx-auto">
                Get Access <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-16 px-6" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
                <div className="absolute inset-1 rotate-45 rounded-sm" style={{ background: T.bg }} />
              </div>
              <span className="text-sm font-black tracking-[0.18em] uppercase" style={{ color: T.text }}>Diversify</span>
            </div>
            <p className="text-xs max-w-xs leading-relaxed" style={{ color: T.textDim }}>
              DIVERSIFY™ aggregates accredited capital to negotiate institutional-grade real estate deals — lower minimums, better terms, full transparency.
            </p>
          </div>

          <div className="flex gap-16">
            {[
              { heading: 'Compliance', links: ['Privacy Policy', 'Accreditation Notice', 'Risk Disclosures'] },
              { heading: 'Platform',   links: ['How It Works', 'Sponsors', 'Deals'] },
            ].map((col) => (
              <div key={col.heading} className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: T.textDim }}>{col.heading}</h4>
                <nav className="space-y-2.5">
                  {col.links.map((link) => (
                    <a key={link} href="#" className="block text-xs transition-colors hover:text-amber-400" style={{ color: T.textSub }}>{link}</a>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 text-center text-[9px] uppercase tracking-[0.3em]" style={{ borderTop: `1px solid ${T.border}`, color: T.textDim }}>
          © 2025 DIVERSIFY CAPITAL. ALL RIGHTS RESERVED. NOT INVESTMENT ADVICE. ACCREDITED INVESTORS ONLY.
        </div>
      </footer>
    </div>
  );
};

// ─── Portal Shell ─────────────────────────────────────────────────────────────

const SettingsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center p-16 rounded-md max-w-md" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div className="w-12 h-12 rounded-sm flex items-center justify-center mx-auto mb-6" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </div>
      <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: T.text }}>Settings</h2>
      <p className="text-xs mb-8" style={{ color: T.textSub }}>Account settings infrastructure coming soon.</p>
      <Button onClick={onBack} variant="outline">Return to Dashboard</Button>
    </div>
  </div>
);

const Portal: React.FC<{ user: User; onLogout: () => void; onUpdateUser: (data: Partial<User>) => void }> = ({ user, onLogout, onUpdateUser }) => {
  const [currentView, setView] = useState('dashboard');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);
  const [accounts, setAccounts] = useState<InvestmentAccount[]>(MOCK_ACCOUNTS);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleInvestmentSubmit = (data: { dealId: string; dealName: string; accountId: string; amount: number; status: string }) => {
    const newRequest: InvestmentRequest = {
      id: 'REQ_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      user_id: user.id,
      deal_id: data.dealId,
      deal_name: data.dealName,
      account_id: data.accountId,
      amount: data.amount,
      status: data.status,
      created_at: new Date().toISOString(),
    };
    setRequests([newRequest, ...requests]);
  };

  const handleAddAccount = (data: Partial<InvestmentAccount>) => {
    const newAccount: InvestmentAccount = {
      id: 'ACC_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      user_id: user.id,
      type: data.type || InvestmentAccountType.INDIVIDUAL,
      display_name: data.display_name || 'New Ledger',
      created_at: new Date().toISOString(),
      ...data,
    };
    setAccounts([...accounts, newAccount]);
  };

  return (
    <div className="min-h-screen flex" style={{ background: T.bg }}>
      <Sidebar user={user} currentView={currentView} setView={setView} onLogout={onLogout} onOpenProfile={() => setIsProfileOpen(true)} />

      <main className="flex-1 ml-56 p-8 overflow-y-auto min-h-screen">
        {currentView === 'dashboard'      && <Dashboard onAllocate={setSelectedDeal} onViewPortfolio={() => setView('portfolio')} requests={requests} />}
        {currentView === 'portfolio'      && <Portfolio onAllocate={setSelectedDeal} />}
        {currentView === 'accounts'       && <Accounts user={user} accounts={accounts} onAddAccount={handleAddAccount} onNavigateToAccreditation={() => setView('accreditation')} />}
        {currentView === 'accreditation'  && <Accreditation user={user} accounts={accounts} />}
        {currentView === 'distributions'  && <Distributions />}
        {currentView === 'documents'      && <Documents />}
        {currentView === 'support'        && <Support />}
        {currentView === 'settings'       && <SettingsView onBack={() => setView('dashboard')} />}
      </main>

      {selectedDeal && (
        <InvestmentModal
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onSubmit={handleInvestmentSubmit}
          onComplete={() => { setSelectedDeal(null); setView('dashboard'); }}
          userFullName={user.full_name}
        />
      )}

      <ProfilePanel user={user} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onUpdate={onUpdateUser} />

      {/* Support FAB */}
      <button
        onClick={() => setView('support')}
        title="Support"
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-sm flex items-center justify-center transition-all hover:scale-105"
        style={{ background: T.gold, color: '#000', boxShadow: `0 0 20px ${T.gold}40` }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [appState]);

  // Build a User object from a Supabase auth user + profile row and route to PORTAL.
  const resolveAuthUser = async (authUser: { id: string; email?: string; user_metadata?: Record<string, string>; app_metadata?: Record<string, string> }) => {
    const email = authUser.email ?? '';
    const provider = authUser.app_metadata?.provider ?? 'email';
    const metaName = authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? '';

    // Persist / update the user row in the database.
    await upsertUserOnSignIn(authUser.id, email, metaName, provider);

    // Fetch the full profile.
    const { data: profile } = await getProfile(authUser.id);

    const resolvedUser: User = {
      id: authUser.id,
      full_name: profile?.full_name || metaName || email.split('@')[0] || 'Investor',
      email,
      phone: profile?.phone ?? undefined,
      country: profile?.country ?? undefined,
      dob: profile?.dob ?? undefined,
      account_type: (profile?.account_type as InvestmentAccountType) ?? InvestmentAccountType.INDIVIDUAL,
      onboarded: profile?.onboarded ?? false,
      identity_status: profile?.identity_status ?? undefined,
      accreditation_status: profile?.accreditation_status ?? undefined,
    };

    setUser(resolvedUser);
    setAppState('PORTAL');
  };

  useEffect(() => {
    // Restore existing session on page load (handles OAuth redirect return).
    getSession().then(({ data: { session } }) => {
      if (session?.user) {
        resolveAuthUser(session.user).finally(() => setSessionLoading(false));
      } else {
        setSessionLoading(false);
      }
    });

    // Listen for future auth state changes (sign-in / sign-out).
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        resolveAuthUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAppState('LANDING');
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Demo access — no Supabase session, goes straight to PORTAL.
  const handleDemoSuccess = (userData: User) => {
    setUser(userData);
    setAppState('PORTAL');
  };

  const handleLogout = async () => {
    await supabaseSignOut();
    setUser(null);
    setAppState('LANDING');
  };

  // While checking for an existing session, show a blank screen in the app background color.
  if (sessionLoading) {
    return <div style={{ minHeight: '100vh', background: T.bg }} />;
  }

  if (appState === 'LANDING') return <LandingPage onStart={() => setAppState('AUTH')} />;
  if (appState === 'AUTH')    return <Auth onSuccess={handleDemoSuccess} onBack={() => setAppState('LANDING')} />;
  if (appState === 'PORTAL' && user) return <Portal user={user} onLogout={handleLogout} onUpdateUser={(d) => setUser({ ...user!, ...d })} />;
  return null;
};

export default App;
