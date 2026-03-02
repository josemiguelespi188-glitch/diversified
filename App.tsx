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
import { Distributions } from './components/Distributions';
import { Documents } from './components/Documents';
import { Support } from './components/Support';
import { CallsCalendar } from './components/CallsCalendar';
import { Button, Badge, T } from './components/UIElements';
import { Deal, User, InvestmentRequest, InvestmentAccount, InvestmentAccountType } from './types';
import { MOCK_DEALS, MOCK_ACCOUNTS } from './constants';
import {
  Shield, BarChart2, Users, ArrowRight, CheckCircle,
  TrendingUp, Star, Phone, Calendar, X, MapPin, ShieldCheck,
  Landmark, Building, DollarSign, Target, Award, Globe, Lock,
} from 'lucide-react';

type AppState = 'LANDING' | 'PORTFOLIO' | 'AUTH' | 'ONBOARDING' | 'PORTAL';
type LandingTab = 'invest' | 'raise';

// ─── Shared Atoms ─────────────────────────────────────────────────────────────

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

// ─── Schedule Call Modal ───────────────────────────────────────────────────────

const CALL_TIMES = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
];

const ScheduleCallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [time, setTime] = useState('');
  const canSubmit = name.trim() && email.trim() && time;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
    >
      <div className="relative w-full max-w-md rounded-md overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
              <Phone size={14} style={{ color: T.gold }} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: T.gold }}>Schedule a Call</p>
              <p className="text-[9px]" style={{ color: T.textDim }}>Our team will confirm within 24h (EST)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-sm flex items-center justify-center"
            style={{ background: T.raised }}
          >
            <X size={13} style={{ color: T.textDim }} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-6 space-y-4">
            {[
              { label: 'Full Name *',      value: name,    setter: setName,    type: 'text',  placeholder: 'James Whitfield' },
              { label: 'Email Address *',  value: email,   setter: setEmail,   type: 'email', placeholder: 'james@familyoffice.com' },
              { label: 'Phone Number',     value: phone,   setter: setPhone,   type: 'tel',   placeholder: '+1 (555) 000-0000' },
              { label: 'Company / Fund',   value: company, setter: setCompany, type: 'text',  placeholder: 'Whitfield Family Office' },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: T.textDim }}>{f.label}</label>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full px-3 py-2.5 rounded-sm text-xs outline-none"
                  style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
                />
              </div>
            ))}

            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: T.textDim }}>Preferred Time (EST) *</label>
              <div className="grid grid-cols-4 gap-1.5">
                {CALL_TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className="py-1.5 rounded-sm text-[9px] font-black uppercase tracking-wider transition-all"
                    style={{
                      background: time === t ? T.gold : T.raised,
                      color: time === t ? '#000' : T.textDim,
                      border: `1px solid ${time === t ? T.gold : T.border}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => { if (canSubmit) setStep('confirm'); }}
              disabled={!canSubmit}
              className="w-full mt-2"
            >
              Confirm Call <Calendar size={12} />
            </Button>
          </div>
        ) : (
          <div className="p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
              <CheckCircle size={28} style={{ color: T.jade }} />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black uppercase" style={{ color: T.text }}>Call Scheduled!</h3>
              <p className="text-xs" style={{ color: T.textSub }}>
                We'll call <span style={{ color: T.gold }}>{name}</span> at <span style={{ color: T.gold }}>{time} EST</span>
              </p>
              <p className="text-xs" style={{ color: T.textDim }}>A confirmation will be sent to {email}</p>
            </div>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Landing Deal Card ─────────────────────────────────────────────────────────

const LandingDealCard: React.FC<{ deal: Deal; onInvest: () => void }> = ({ deal, onInvest }) => (
  <div
    className="rounded-sm overflow-hidden flex flex-col transition-all duration-300 group"
    style={{ background: T.surface, border: `1px solid ${T.border}` }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
  >
    <div className="relative h-44 overflow-hidden flex-shrink-0">
      <img
        src={deal.image_url}
        alt={deal.title}
        className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.surface} 0%, transparent 60%)` }} />
      <div className="absolute top-3 left-3 flex gap-1.5">
        <Badge variant="jade">Open</Badge>
        <Badge variant="neutral">{deal.asset_class}</Badge>
      </div>
    </div>

    <div className="flex-1 flex flex-col p-5 space-y-4">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wide transition-colors group-hover:text-amber-400" style={{ color: T.text }}>
          {deal.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={10} style={{ color: T.gold }} />
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
            {deal.location} · {deal.sponsor}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 py-3" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        {[
          { label: 'Target IRR',      value: `${deal.projected_irr}%`,                                accent: T.gold },
          { label: 'Cash Yield',      value: deal.cash_yield > 0 ? `${deal.cash_yield}%` : 'N/A',    accent: T.jade },
          { label: 'Min. Investment', value: `$${deal.minimum_investment.toLocaleString()}`,           accent: T.text },
          { label: 'Term',            value: `${deal.term_years} yrs`,                                accent: T.text },
        ].map((s) => (
          <div key={s.label} className="space-y-0.5">
            <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>{s.label}</p>
            <p className="text-sm font-black" style={{ color: s.accent }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} style={{ color: T.jade }} />
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Committee Approved</span>
        </div>
        <Button onClick={onInvest} size="sm">
          <Landmark size={11} /> Invest Now
        </Button>
      </div>
    </div>
  </div>
);

// ─── Shared Footer ─────────────────────────────────────────────────────────────

const LandingFooter: React.FC = () => (
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
);

// ─── Invest With Us Page ───────────────────────────────────────────────────────

const InvestWithUs: React.FC<{
  onStart: () => void;
  onViewPortfolio: () => void;
  onSchedule: () => void;
  onAdminAccess: () => void;
}> = ({ onStart, onViewPortfolio, onSchedule, onAdminAccess }) => {
  const benefits = [
    { icon: Shield,     title: 'Institutional Access', desc: 'Access deal flow normally reserved for family offices and major institutions — min. investments from $20K.' },
    { icon: TrendingUp, title: '14.2% Avg. IRR',       desc: 'Our portfolio has delivered 14.2% average IRR across 38 closed deals, with consistent quarterly distributions.' },
    { icon: Target,     title: 'Rigorous Underwriting', desc: 'Every deal passes a multi-stage committee review. Less than 8% of submitted deals make it to the platform.' },
    { icon: Users,      title: 'Aligned Capital',       desc: 'We co-invest alongside our LPs in every deal. Our success is directly tied to yours.' },
    { icon: Globe,      title: 'True Diversification',  desc: 'Spread risk across asset classes, geographies, and sponsor relationships with a single allocation.' },
    { icon: Award,      title: 'Full Transparency',     desc: 'Audit-grade quarterly reporting, full document access, and real-time portal visibility on every position.' },
  ];

  const trackRecord = [
    { value: '$2.1B+', label: 'Capital Deployed' },
    { value: '38',     label: 'Deals Closed' },
    { value: '14.2%',  label: 'Avg. IRR' },
    { value: '8.5%',   label: 'Avg. Cash Yield' },
    { value: '$20K',   label: 'Min. Investment' },
    { value: '100%',   label: 'Quarterly Distributions' },
  ];

  const testimonials = [
    {
      name: 'James Whitfield', role: 'Family Office Principal',
      text: 'Diversify gave us access to deal flow we previously couldn\'t reach. The underwriting rigor and transparency are genuinely institutional.',
      stars: 5,
    },
    {
      name: 'Sarah Chen', role: 'HNW Investor',
      text: 'I\'ve invested in 4 deals through the platform. The quarterly updates are more detailed than anything I get from my traditional fund managers.',
      stars: 5,
    },
    {
      name: 'Robert Okafor', role: 'Private Equity LP',
      text: 'The co-investment structure and aligned capital model is exactly what I look for. My portfolio has averaged 16% IRR across three years on the platform.',
      stars: 5,
    },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 md:pt-16">
        <GridBg />
        <GlowOrb style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="gold" className="mx-auto">Accredited Investors Only — U.S. &amp; International</Badge>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
            Institutional<br />
            <span style={{ color: T.gold }}>Private Capital</span><br />
            Done Right.
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: T.textSub }}>
            Diversify aggregates accredited capital to access institutional-grade real estate deals — lower minimums, better terms, complete transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onSchedule} size="lg">
              <Phone size={14} /> Schedule a Call
            </Button>
            <Button onClick={onStart} variant="outline" size="lg">
              Access Platform <ArrowRight size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <StatPill value="$2.1B+" label="Capital Deployed" />
            <StatPill value="38" label="Active Deals" />
            <StatPill value="14.2%" label="Avg. IRR" />
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(to bottom, ${T.gold}60, transparent)` }} />
        </div>
      </section>

      {/* ── Why Invest With Us ── */}
      <section className="py-28 px-6 relative">
        <GlowOrb style={{ top: -100, right: -300, opacity: 0.4 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Why Diversify</p>
          </div>
          <h2 className="text-4xl font-black uppercase mb-3">Why Invest With Us</h2>
          <p className="text-base mb-14 max-w-xl" style={{ color: T.textSub }}>
            We've built the infrastructure to give accredited investors access to deals typically reserved for the largest institutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-sm space-y-4 transition-all duration-300"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
              >
                <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                  <b.icon size={18} style={{ color: T.gold }} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{b.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Track Record ── */}
      <section className="py-20 px-6" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: T.gold }}>Track Record</p>
            <h2 className="text-3xl font-black uppercase">Verified Performance</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trackRecord.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <p className="text-2xl md:text-3xl font-black" style={{ color: T.gold }}>{s.value}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-2" style={{ color: T.textDim }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio / Deal Cards ── */}
      <section className="py-28 px-6 relative">
        <GlowOrb style={{ bottom: -200, left: -300, opacity: 0.4 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-px" style={{ background: T.gold }} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Active Opportunities</p>
              </div>
              <h2 className="text-4xl font-black uppercase">Current Portfolio</h2>
              <p className="text-sm mt-2" style={{ color: T.textSub }}>
                Committee-approved deals open for investment. All accredited investors welcome.
              </p>
            </div>
            <Button onClick={onViewPortfolio} variant="outline">
              View Full Portfolio <ArrowRight size={12} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_DEALS.map((deal) => (
              <LandingDealCard key={deal.id} deal={deal} onInvest={onStart} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button onClick={onViewPortfolio} size="lg" variant="outline">
              Explore Full Portfolio <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: T.gold }}>Investor Voices</p>
            <h2 className="text-3xl font-black uppercase">What Our LPs Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="p-7 rounded-sm space-y-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={12} style={{ color: T.gold }} fill={T.gold} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed italic" style={{ color: T.textSub }}>"{t.text}"</p>
                <div className="pt-2" style={{ borderTop: `1px solid ${T.border}` }}>
                  <p className="text-xs font-black uppercase tracking-wide" style={{ color: T.text }}>{t.name}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: T.textDim }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutional Demo ── */}
      <section className="py-24 px-6 relative" style={{ borderTop: `1px solid ${T.border}` }}>
        <GlowOrb style={{ top: -100, right: -200, opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: T.gold }}>Platform Preview</p>
            <h2 className="text-3xl font-black uppercase">Institutional Demo</h2>
            <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: T.textSub }}>
              See how Diversify manages your portfolio, distributions, and documentation — all in one institutional-grade portal.
            </p>
          </div>

          {/* Mock Portal UI */}
          <div className="rounded-md overflow-hidden mx-auto max-w-4xl" style={{ border: `1px solid ${T.border}`, background: T.surface }}>
            {/* Browser chrome */}
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: T.raised, borderBottom: `1px solid ${T.border}` }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F59E0B' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
              </div>
              <div className="flex-1 mx-4 h-5 rounded-sm flex items-center px-3" style={{ background: T.surface }}>
                <Lock size={9} style={{ color: T.jade, marginRight: 4 }} />
                <span className="text-[9px]" style={{ color: T.textDim }}>app.diversify.com/portal</span>
              </div>
            </div>

            {/* Mock dashboard */}
            <div className="flex" style={{ height: 240 }}>
              {/* Sidebar mock */}
              <div className="w-32 flex-shrink-0 p-3 space-y-0.5" style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}>
                {[
                  { label: 'Dashboard',  active: true },
                  { label: 'Portfolio',  active: false },
                  { label: 'Ledger',     active: false },
                  { label: 'Distributions', active: false },
                  { label: 'Documents',  active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-sm"
                    style={{
                      background: item.active ? T.goldFaint : 'transparent',
                      borderLeft: item.active ? `2px solid ${T.gold}` : '2px solid transparent',
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ background: item.active ? T.gold : T.border }} />
                    <span className="text-[7px] font-bold uppercase tracking-wider" style={{ color: item.active ? T.gold : T.textDim }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Dashboard content mock */}
              <div className="flex-1 p-4 space-y-3 overflow-hidden">
                {/* KPI row */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Total Committed', value: '$250,000' },
                    { label: 'Active Positions', value: '4' },
                    { label: 'Avg. IRR', value: '14.6%' },
                    { label: 'Distributions', value: '$8,325' },
                  ].map((kpi) => (
                    <div key={kpi.label} className="p-2 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                      <p className="text-[7px] uppercase tracking-wider" style={{ color: T.textDim }}>{kpi.label}</p>
                      <p className="text-sm font-black mt-0.5" style={{ color: T.gold }}>{kpi.value}</p>
                    </div>
                  ))}
                </div>

                {/* Table mock */}
                <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                  <div className="grid grid-cols-4 px-3 py-1.5" style={{ background: T.raised }}>
                    {['Deal', 'Strategy', 'Amount', 'Status'].map((h) => (
                      <span key={h} className="text-[7px] font-black uppercase tracking-wider" style={{ color: T.textDim }}>{h}</span>
                    ))}
                  </div>
                  {[
                    ['Phoenix MF Fund',     'Multifamily',  '$50,000',  'Funded'],
                    ['Rusty Bear Industrial','Industrial',  '$25,000',  'Funded'],
                    ['Cornerstone Debt',    'Private Debt', '$100,000', 'Funded'],
                  ].map(([deal, strategy, amt, status]) => (
                    <div key={deal} className="grid grid-cols-4 px-3 py-1.5" style={{ borderTop: `1px solid ${T.border}` }}>
                      <span className="text-[8px] font-bold truncate" style={{ color: T.text }}>{deal}</span>
                      <span className="text-[8px]" style={{ color: T.textSub }}>{strategy}</span>
                      <span className="text-[8px] font-bold" style={{ color: T.gold }}>{amt}</span>
                      <span className="text-[8px] font-bold" style={{ color: T.jade }}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Portal Button — directly below the demo */}
          <div className="text-center mt-8 space-y-3">
            <p className="text-xs" style={{ color: T.textDim }}>Already have access? Go directly to the admin portal.</p>
            <Button onClick={onAdminAccess} size="lg">
              Access Admin Portal <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Schedule a Call CTA ── */}
      <section className="py-28 px-6" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-md p-12 md:p-16 text-center space-y-8 relative overflow-hidden"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${T.gold}05 0%, transparent 70%)` }} />
            <div className="relative z-10 space-y-8">
              <Badge variant="gold" className="mx-auto">Accredited Investors Only</Badge>
              <h2 className="text-4xl font-black uppercase">
                Ready to <span style={{ color: T.gold }}>Invest?</span>
              </h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: T.textSub }}>
                Schedule a call with our investor relations team. We'll walk you through the platform, current opportunities, and answer any questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onSchedule} size="lg">
                  <Phone size={14} /> Schedule a Call
                </Button>
                <Button onClick={onStart} variant="outline" size="lg">
                  Access Platform <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Raise Capital Page ────────────────────────────────────────────────────────

const RaiseCapital: React.FC<{ onSchedule: () => void }> = ({ onSchedule }) => {
  const benefits = [
    { icon: Users,     title: 'LP Network Access',   desc: 'Tap into our network of 500+ accredited investors and family offices actively seeking quality deal flow.' },
    { icon: DollarSign, title: 'Faster Capital Raises', desc: 'Average deal funding in under 45 days. Our LP base is pre-qualified and ready to deploy capital.' },
    { icon: Shield,    title: 'Full Compliance',      desc: 'We handle SEC compliance, subscription documentation, and investor verification for every raise.' },
    { icon: BarChart2, title: 'Investor Portal',      desc: 'Your investors get institutional-grade reporting, K-1 management, and real-time distribution tracking.' },
    { icon: Award,     title: 'Credibility Signal',   desc: 'A Diversify listing signals institutional quality. Our committee vetting adds legitimacy to your deals.' },
    { icon: Building,  title: 'Ongoing Relationships', desc: 'We build long-term sponsor relationships. Repeat sponsors get priority listing and LP introductions.' },
  ];

  const steps = [
    { step: '01', title: 'Submit Deal',      desc: 'Fill out our sponsor application and submit your deal for initial review. We respond within 72 hours.' },
    { step: '02', title: 'Committee Review', desc: 'Our investment committee conducts full underwriting due diligence. Less than 8% of deals pass.' },
    { step: '03', title: 'LP Matching',      desc: 'Approved deals are matched with suitable LPs from our network based on strategy and size preferences.' },
    { step: '04', title: 'Capital & Close',  desc: 'We manage subscription docs, fund transfers, and investor onboarding. You focus on the deal.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 md:pt-16">
        <GridBg />
        <GlowOrb style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="gold" className="mx-auto">For Operators &amp; Syndicators</Badge>
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
            Raise Institutional<br />
            <span style={{ color: T.gold }}>Capital.</span><br />
            Close Faster.
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: T.textSub }}>
            List your deal on Diversify and access a pre-qualified network of 500+ accredited investors. Institutional infrastructure. Operator-aligned terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onSchedule} size="lg">
              <Phone size={14} /> Talk to Our Team
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <StatPill value="$2.1B+" label="Total Raised" />
            <StatPill value="500+" label="Active LPs" />
            <StatPill value="45d" label="Avg. Close Time" />
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(to bottom, ${T.gold}60, transparent)` }} />
        </div>
      </section>

      {/* Benefits for Sponsors */}
      <section className="py-28 px-6 relative">
        <GlowOrb style={{ top: -100, left: -300, opacity: 0.4 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Why Diversify</p>
          </div>
          <h2 className="text-4xl font-black uppercase mb-3">Why Raise With Us</h2>
          <p className="text-base mb-14 max-w-xl" style={{ color: T.textSub }}>
            We've built the platform for sponsors who want institutional infrastructure without the complexity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-sm space-y-4 transition-all duration-300"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
              >
                <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                  <b.icon size={18} style={{ color: T.gold }} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{b.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="py-24 px-6" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: T.gold }}>The Process</p>
            <h2 className="text-3xl font-black uppercase">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative p-6 rounded-sm space-y-4" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="text-4xl font-black" style={{ color: `${T.gold}30` }}>{s.step}</div>
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={14} style={{ color: T.gold }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + CTA */}
      <section className="py-28 px-6" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-md p-12 md:p-16 relative overflow-hidden"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${T.gold}05 0%, transparent 70%)` }} />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="gold">Sponsor Requirements</Badge>
                <h2 className="text-3xl font-black uppercase">Who Can List?</h2>
                <ul className="space-y-3">
                  {[
                    'Minimum 2 years operating history',
                    'At least $5M in previously raised capital',
                    'SEC-compliant deal structure (506b or 506c)',
                    'Audited financials or CPA-certified returns',
                    'Active deal with committed equity',
                  ].map((req) => (
                    <li key={req} className="flex items-start gap-2">
                      <CheckCircle size={13} style={{ color: T.jade, marginTop: 1, flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: T.textSub }}>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6 text-center">
                <p className="text-base" style={{ color: T.textSub }}>
                  Ready to list your deal and access our LP network? Schedule an introduction call with our sponsor relations team.
                </p>
                <Button onClick={onSchedule} size="lg" className="mx-auto">
                  <Phone size={14} /> Schedule Sponsor Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── Landing Page (tab router) ─────────────────────────────────────────────────

const LandingPage: React.FC<{
  onStart: () => void;
  onViewPortfolio: () => void;
  onAdminAccess: () => void;
}> = ({ onStart, onViewPortfolio, onAdminAccess }) => {
  const [tab, setTab] = useState<LandingTab>('invest');
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: T.bg, color: T.text }}>
      <Navbar onAccess={onStart} activeTab={tab} onTabChange={setTab} />

      {tab === 'invest'
        ? <InvestWithUs onStart={onStart} onViewPortfolio={onViewPortfolio} onSchedule={() => setShowSchedule(true)} onAdminAccess={onAdminAccess} />
        : <RaiseCapital onSchedule={() => setShowSchedule(true)} />
      }

      <LandingFooter />

      {showSchedule && <ScheduleCallModal onClose={() => setShowSchedule(false)} />}
    </div>
  );
};

// ─── Public Portfolio Page ─────────────────────────────────────────────────────

const PublicPortfolioPage: React.FC<{
  onStart: () => void;
  onBack: () => void;
}> = ({ onStart, onBack }) => {
  const [filter, setFilter] = useState('All');
  const STRATEGIES = ['All', 'Multifamily', 'Industrial', 'Private Debt', 'Development'];
  const deals = filter === 'All' ? MOCK_DEALS : MOCK_DEALS.filter((d) => d.strategy === filter);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: T.bg, color: T.text }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: `${T.surface}F0`, borderBottom: `1px solid ${T.border}`, backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-amber-400"
              style={{ color: T.textSub }}
            >
              <ArrowRight size={12} style={{ transform: 'rotate(180deg)' }} /> Back
            </button>
            <div className="w-px h-4" style={{ background: T.border }} />
            <div className="flex items-center gap-2.5">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
                <div className="absolute inset-1 rotate-45 rounded-sm" style={{ background: T.surface }} />
              </div>
              <span className="text-sm font-black tracking-[0.15em] uppercase" style={{ color: T.text }}>Diversify</span>
            </div>
          </div>
          <Button onClick={onStart} size="sm">Access Platform <ArrowRight size={12} /></Button>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto space-y-10">
        {/* Page header */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>Active Opportunities</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">Full Portfolio</h1>
              <p className="text-sm mt-1" style={{ color: T.textSub }}>
                All committee-approved deals open for investment. Accredited investors welcome.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="jade">Committee Approved</Badge>
              <Badge variant="gold">Verified Sponsors</Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-lg">
          <StatPill value="$2.1B+" label="Capital Deployed" />
          <StatPill value="38" label="Active Deals" />
          <StatPill value="14.2%" label="Avg. IRR" />
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {STRATEGIES.map((s) => {
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
                style={{
                  background: active ? T.gold : T.raised,
                  color: active ? '#000' : T.textDim,
                  border: `1px solid ${active ? T.gold : T.border}`,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Deal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {deals.map((deal) => (
            <LandingDealCard key={deal.id} deal={deal} onInvest={onStart} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-10">
          <div className="inline-block p-10 rounded-md space-y-4" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <p className="text-sm font-black uppercase" style={{ color: T.text }}>Ready to invest?</p>
            <p className="text-xs" style={{ color: T.textSub }}>Create your account and start investing in minutes.</p>
            <Button onClick={onStart} size="lg">
              Get Started <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Portal Shell ─────────────────────────────────────────────────────────────

const SettingsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center p-16 rounded-md max-w-md" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div className="w-12 h-12 rounded-sm flex items-center justify-center mx-auto mb-6" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </div>
      <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: T.text }}>Settings</h2>
      <p className="text-xs mb-8" style={{ color: T.textSub }}>Account settings infrastructure coming soon.</p>
      <Button onClick={onBack} variant="outline">Return to Dashboard</Button>
    </div>
  </div>
);

const Portal: React.FC<{
  user: User;
  onLogout: () => void;
  onUpdateUser: (data: Partial<User>) => void;
}> = ({ user, onLogout, onUpdateUser }) => {
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
      <Sidebar
        user={user}
        currentView={currentView}
        setView={setView}
        onLogout={onLogout}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex-1 ml-56 p-8 overflow-y-auto min-h-screen">
        {currentView === 'dashboard'      && <Dashboard onAllocate={setSelectedDeal} onViewPortfolio={() => setView('portfolio')} requests={requests} />}
        {currentView === 'portfolio'      && <Portfolio onAllocate={setSelectedDeal} />}
        {currentView === 'accounts'       && <Accounts user={user} accounts={accounts} onAddAccount={handleAddAccount} onNavigateToAccreditation={() => setView('accreditation')} />}
        {currentView === 'accreditation'  && <Accreditation user={user} accounts={accounts} />}
        {currentView === 'distributions'  && <Distributions />}
        {currentView === 'documents'      && <Documents />}
        {currentView === 'support'        && <Support />}
        {currentView === 'calls_calendar' && <CallsCalendar />}
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

      <ProfilePanel
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={onUpdateUser}
      />

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

const ADMIN_USER: User = {
  id: 'usr_admin_axis',
  full_name: 'Axis Admin',
  email: 'admin@axisplatform.com',
  account_type: InvestmentAccountType.INDIVIDUAL,
  onboarded: true,
  accreditation_status: 'Verified' as const,
  identity_status: 'Verified' as const,
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LANDING');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [appState]);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setAppState(userData.onboarded ? 'PORTAL' : 'ONBOARDING');
  };

  const handleAdminAccess = () => {
    setUser(ADMIN_USER);
    setAppState('PORTAL');
  };

  if (appState === 'LANDING')
    return <LandingPage onStart={() => setAppState('AUTH')} onViewPortfolio={() => setAppState('PORTFOLIO')} onAdminAccess={handleAdminAccess} />;

  if (appState === 'PORTFOLIO')
    return <PublicPortfolioPage onStart={() => setAppState('AUTH')} onBack={() => setAppState('LANDING')} />;

  if (appState === 'AUTH')
    return <Auth onSuccess={handleLoginSuccess} onBack={() => setAppState('LANDING')} />;

  if (appState === 'ONBOARDING' && user)
    return <Onboarding user={user} onComplete={() => { setUser({ ...user, onboarded: true }); setAppState('PORTAL'); }} />;

  if (appState === 'PORTAL' && user)
    return <Portal user={user} onLogout={() => { setUser(null); setAppState('LANDING'); }} onUpdateUser={(d) => setUser({ ...user!, ...d })} />;

  return null;
};

export default App;
