
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
import { Onboarding } from './components/Onboarding';
import { Button, Card, Badge, SectionHeading } from './components/UIElements';
import { Deal, User, InvestmentRequest, InvestmentAccount, InvestmentAccountType } from './types';
import { MOCK_ACCOUNTS } from './constants';
import { Globe, Shield, BarChart2, Zap } from 'lucide-react';

type AppState = 'LANDING' | 'AUTH' | 'ONBOARDING' | 'PORTAL';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#081C3A]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <Navbar onAccess={onStart} />
      
      {/* Hero */}
      <header className="pt-40 pb-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1457B6] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <div className="flex justify-center lg:justify-start">
              <Badge variant="info">Portfolio-first Private Capital</Badge>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Institutional <br/>
              <span className="text-[#2F80ED]">Private Capital</span> <br/>
              Infrastructure.
            </h1>
            <p className="text-[#8FAEDB] text-xl max-w-xl leading-relaxed">
              Diversify into curated real estate assets with institutional-grade underwriting and total incentive alignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={onStart} className="px-10 py-4 text-lg">Access the Platform</Button>
              <Button variant="ghost" className="px-10 py-4 text-lg border border-white/5">Investment Philosophy</Button>
            </div>
          </div>
          <div className="lg:w-1/2">
             <Card className="p-2 cyan-glow rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="Platform Preview" className="rounded-lg shadow-2xl opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-tr from-[#2F80ED]/20 to-transparent pointer-events-none"></div>
             </Card>
          </div>
        </div>
      </header>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="Institutional Discipline" 
            subtitle="We don't believe in individual 'deal picking'. We build resilient, diversified capital portfolios through rigorous committee oversight."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {[
              { title: 'Diversification', desc: 'Strategy, Geography, and Asset Class spread across all allocations.', icon: Globe },
              { title: 'Alignment', desc: 'Our capital is invested alongside yours. We succeed only when you do.', icon: Shield },
              { title: 'Transparency', desc: 'Institutional reporting standards. Full access to asset-level data.', icon: BarChart2 },
              { title: 'Committee-Led', desc: 'Strict multi-stage review for every single opportunity on the platform.', icon: Zap },
            ].map((item, i) => (
              <Card key={i} className="space-y-4 hover:border-[#2F80ED]/50 transition-colors group">
                <div className="w-12 h-12 rounded bg-[#2F80ED]/10 flex items-center justify-center text-[#2F80ED] group-hover:cyan-glow transition-all">
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{item.title}</h3>
                <p className="text-sm text-[#8FAEDB] leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2F80ED] rounded rotate-45"></div>
              <span className="text-xl font-bold text-white">DiverCfly</span>
            </div>
            <p className="text-sm text-[#8FAEDB] max-w-sm">
              DiverCfly™ is a private platform for accredited investors. We provide the infrastructure to build and manage sophisticated private equity portfolios.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Compliance</h4>
            <nav className="flex flex-col gap-2 text-sm text-[#8FAEDB]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Accreditation Notice</a>
              <a href="#" className="hover:text-white transition-colors">Risk Disclosures</a>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-[10px] text-[#8FAEDB]/50 uppercase tracking-[0.2em]">
          &copy; 2024 DIVERCFLY INFRASTRUCTURE. ALL RIGHTS RESERVED. NOT INVESTMENT ADVICE. ACCREDITED INVESTORS ONLY.
        </div>
      </footer>
    </div>
  );
};

const Portal: React.FC<{ user: User, onLogout: () => void, onUpdateUser: (data: Partial<User>) => void }> = ({ user, onLogout, onUpdateUser }) => {
  const [currentView, setView] = useState('dashboard'); 
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);
  const [accounts, setAccounts] = useState<InvestmentAccount[]>(MOCK_ACCOUNTS);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleAllocate = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  const handleInvestmentSubmit = (data: any) => {
    const newRequest: InvestmentRequest = {
      id: 'REQ_' + Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      deal_id: data.dealId,
      deal_name: data.dealName,
      account_id: data.accountId,
      amount: data.amount,
      status: data.status,
      created_at: new Date().toISOString()
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
      ...data
    };
    setAccounts([...accounts, newAccount]);
  };

  return (
    <div className="min-h-screen bg-[#081C3A] flex">
      <Sidebar 
        user={user} 
        currentView={currentView} 
        setView={setView} 
        onLogout={onLogout} 
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {currentView === 'dashboard' && (
          <Dashboard 
            onAllocate={handleAllocate} 
            onViewPortfolio={() => setView('portfolio')}
            requests={requests}
          />
        )}
        {currentView === 'portfolio' && (
          <Portfolio onAllocate={handleAllocate} />
        )}
        {currentView === 'accounts' && (
          <Accounts 
            user={user} 
            accounts={accounts} 
            onAddAccount={handleAddAccount}
            onNavigateToAccreditation={() => setView('accreditation')}
          />
        )}
        {currentView === 'accreditation' && (
          <Accreditation user={user} accounts={accounts} />
        )}
        
        {['distributions', 'documents', 'settings'].includes(currentView) && (
          <div className="flex items-center justify-center h-full">
            <Card className="text-center p-20 max-w-lg border-white/5">
              <h2 className="text-2xl font-bold text-white uppercase mb-4">{currentView} Module</h2>
              <p className="text-[#8FAEDB] text-sm uppercase tracking-widest leading-relaxed">Infrastructure under maintenance. Your ledger data remains encrypted and secure.</p>
              <Button onClick={() => setView('dashboard')} variant="outline" className="mt-8">Return to Dashboard</Button>
            </Card>
          </div>
        )}
      </main>

      {selectedDeal && (
        <InvestmentModal 
          deal={selectedDeal} 
          onClose={() => setSelectedDeal(null)} 
          onSubmit={handleInvestmentSubmit}
          onComplete={() => {
            setSelectedDeal(null);
            setView('dashboard');
          }}
          userFullName={user.full_name}
        />
      )}

      <ProfilePanel 
        user={user} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onUpdate={onUpdateUser}
      />

      {/* Support Orb */}
      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-14 h-14 bg-[#2F80ED] rounded-full flex items-center justify-center text-white cyan-glow hover:scale-110 transition-all border border-white/10">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
           </svg>
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState]);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    if (userData.onboarded) {
      setAppState('PORTAL');
    } else {
      setAppState('ONBOARDING');
    }
  };

  const handleOnboardingComplete = () => {
    if (user) {
      setUser({ ...user, onboarded: true });
      setAppState('PORTAL');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('LANDING');
  };

  const handleUpdateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  if (appState === 'LANDING') return <LandingPage onStart={() => setAppState('AUTH')} />;
  if (appState === 'AUTH') return <Auth onSuccess={handleLoginSuccess} onBack={() => setAppState('LANDING')} />;
  if (appState === 'ONBOARDING' && user) return <Onboarding user={user} onComplete={handleOnboardingComplete} />;
  if (appState === 'PORTAL' && user) return <Portal user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;

  return null;
};

export default App;
