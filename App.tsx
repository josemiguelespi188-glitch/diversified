import React, { useState, useEffect } from 'react';
import { Navbar, LandingTab } from './components/Navbar';
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
import { Button, Badge, Input, T } from './components/UIElements';
import { Deal, User, InvestmentRequest, InvestmentAccount, InvestmentAccountType } from './types';
import { MOCK_ACCOUNTS } from './constants';
import {
  Shield, BarChart2, Users, ArrowRight, CheckCircle,
  Lock, Globe, Star, Phone, X, Building2,
  FileCheck, Handshake, Layers, ChevronRight,
} from 'lucide-react';

type AppState = 'LANDING' | 'AUTH' | 'ONBOARDING' | 'PORTAL';

// ─── Shared Landing Primitives ─────────────────────────────────────────────────

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

// ─── Schedule a Call Modal ─────────────────────────────────────────────────────

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM',  '2:30 PM',
  '3:00 PM',  '3:30 PM',  '4:00 PM',  '4:30 PM',
];

const ScheduleCallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });

  const canSubmit = form.name.trim() && form.email.trim() && selectedSlot;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setStep('success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(7,8,12,0.9)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-md overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
              <Phone size={14} style={{ color: T.gold }} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>
              Schedule a Call
            </span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-white/5 text-lg" style={{ color: T.textDim }}>
            <X size={16} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-6 space-y-6">
            <div>
              <p className="text-base font-black uppercase tracking-widest mb-1" style={{ color: T.text }}>
                Speak with Our Team
              </p>
              <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>
                Book a private 30-minute call with a Diversify capital advisor. We'll walk you through available deals, answer your questions, and help you determine if we're the right fit.
              </p>
            </div>

            {/* Form fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Full Name *"
                  placeholder="Alexander Vanderbilt"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@privateco.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                />
                <Input
                  label="Company / Entity"
                  placeholder="Optional"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                />
              </div>
            </div>

            {/* Time slots */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.textSub }}>
                Select a Time Slot — EST
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot === selectedSlot ? null : slot)}
                    className="py-2 rounded-sm text-[11px] font-bold transition-all duration-150"
                    style={{
                      background: selectedSlot === slot ? T.gold : T.raised,
                      border: `1px solid ${selectedSlot === slot ? T.gold : T.border}`,
                      color: selectedSlot === slot ? '#000' : T.textSub,
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              size="lg"
              className="w-full"
            >
              Book Call <ArrowRight size={13} />
            </Button>

            <p className="text-center text-[10px]" style={{ color: T.textDim }}>
              A confirmation will be sent to your email. Calls are 30 minutes via Zoom.
            </p>
          </div>
        ) : (
          <div className="p-10 text-center space-y-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
              <CheckCircle size={24} style={{ color: T.jade }} />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-black uppercase tracking-widest" style={{ color: T.text }}>Call Booked!</p>
              <p className="text-sm" style={{ color: T.textSub }}>
                Your call at <span style={{ color: T.gold }}>{selectedSlot}</span> has been scheduled.
              </p>
              <p className="text-xs" style={{ color: T.textDim }}>
                A Diversify advisor will reach out to confirm and send a Zoom link to {form.email || 'your inbox'}.
              </p>
            </div>
            <Button onClick={onClose} variant="outline">Done</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Investor Landing Page ─────────────────────────────────────────────────────

const InvestorPage: React.FC<{ onStart: () => void; onScheduleCall: () => void }> = ({ onStart, onScheduleCall }) => {
  const benefits = [
    {
      icon: Lock,
      title: 'Institutional Access',
      desc: 'We unlock deals normally reserved for family offices and pension funds — with minimums starting at $20K instead of $1M+.',
    },
    {
      icon: BarChart2,
      title: '14.2% Avg. IRR',
      desc: 'Our committee-vetted portfolio has delivered consistent double-digit returns across market cycles.',
    },
    {
      icon: Shield,
      title: 'Rigorous Underwriting',
      desc: 'Every deal passes a multi-stage review committee before reaching the platform. No exceptions, no shortcuts.',
    },
    {
      icon: Users,
      title: 'Aligned Capital',
      desc: 'We invest our own capital alongside yours in every deal. We only profit when you do.',
    },
    {
      icon: Globe,
      title: 'True Diversification',
      desc: 'Build a portfolio across geographies, asset classes, and strategies — not just a single bet.',
    },
    {
      icon: FileCheck,
      title: 'Full Transparency',
      desc: 'Audit-grade quarterly reports, real-time dashboards, and full document access on every position.',
    },
  ];

  const checklist = [
    'Accredited investors — U.S. & International',
    'Minimum investments from $20,000',
    'Institutional-grade underwriting on every deal',
    'Full document access, zero gatekeeping',
    'Quarterly distributions & reporting',
  ];

  const metrics = [
    { value: '$2.1B+', label: 'Capital Deployed' },
    { value: '38',     label: 'Active Deals' },
    { value: '14.2%',  label: 'Avg. IRR' },
    { value: '8.5%',   label: 'Avg. Cash Yield' },
  ];

  const testimonials = [
    { name: 'Alexander V.', role: 'Family Office — New York', quote: 'Diversify gave us institutional deal flow we simply couldn\'t access independently. The underwriting process is genuinely rigorous.', stars: 5 },
    { name: 'Sarah M.',     role: 'Tech Executive — San Francisco', quote: 'The transparency is unlike anything I\'ve seen in private real estate. Quarterly reports are better than most public REITs.', stars: 5 },
    { name: 'James H.',     role: 'Trust Account — London', quote: 'I\'ve been deploying capital with Diversify for 3 years. Consistent distributions, aligned team, and zero surprises.', stars: 5 },
  ];

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <GridBg />
        <GlowOrb style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <Badge variant="gold" className="mx-auto">
            Private Capital Infrastructure — Accredited Investors Only
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
            Your Capital Deserves<br />
            <span style={{ color: T.gold }}>Institutional</span><br />
            Standards.
          </h1>

          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: T.textSub }}>
            Diversify aggregates accredited capital to access the same institutional-grade real estate deals as pension funds and family offices — at lower minimums, with complete transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onStart} size="lg">
              Access the Platform <ArrowRight size={14} />
            </Button>
            <Button onClick={onScheduleCall} variant="outline" size="lg">
              <Phone size={13} /> Schedule a Call
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4">
            {metrics.map(m => <StatPill key={m.label} value={m.value} label={m.label} />)}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(to bottom, ${T.gold}60, transparent)` }} />
        </div>
      </section>

      {/* ── Why Invest With Us ───────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <GlowOrb style={{ bottom: -200, left: -300, opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Why Invest With Us</p>
          </div>
          <h2 className="text-4xl font-black uppercase mb-4" style={{ color: T.text }}>
            Built for Serious Investors
          </h2>
          <p className="text-base mb-16 max-w-xl" style={{ color: T.textSub }}>
            We've built the infrastructure for accredited investors to access, underwrite, and manage institutional-grade private capital — without the institutional minimums.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-sm group transition-all duration-300 space-y-4"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
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

      {/* ── Track Record ──────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ background: T.gold }} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Our Track Record</p>
              </div>
              <h2 className="text-3xl font-black uppercase" style={{ color: T.text }}>
                Performance You Can Verify
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: T.textSub }}>
                Every deal on our platform is backed by audit-grade documentation, real-time performance dashboards, and quarterly investor reports. We don't hide the numbers — we lead with them.
              </p>
              <ul className="space-y-3">
                {checklist.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle size={14} style={{ color: T.jade, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: T.textSub }}>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={onStart} size="md">
                  Start Investing <ArrowRight size={13} />
                </Button>
                <Button onClick={onScheduleCall} variant="ghost" size="md">
                  <Phone size={13} /> Talk to an Advisor
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg. IRR',         value: '14.2%',  sub: 'Across all deals',         accent: T.gold },
                { label: 'Avg. Cash Yield',  value: '8.5%',   sub: 'Quarterly distributions',  accent: T.jade },
                { label: 'Deals Funded',     value: '38',     sub: 'Committee-approved',        accent: T.sky },
                { label: 'Capital Deployed', value: '$2.1B+', sub: 'Institutional-grade',       accent: T.gold },
                { label: 'Avg. Term',        value: '4.2 yr', sub: 'Predictable duration',      accent: T.textSub },
                { label: 'Min. Investment',  value: '$20K',   sub: 'Per deal allocation',       accent: T.jade },
              ].map(s => (
                <div key={s.label} className="p-5 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: T.textDim }}>{s.label}</p>
                  <p className="text-2xl font-black" style={{ color: s.accent }}>{s.value}</p>
                  <p className="text-[10px] mt-1" style={{ color: T.textDim }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Investor Voices</p>
          </div>
          <h2 className="text-4xl font-black uppercase mb-16" style={{ color: T.text }}>
            Trusted by Accredited Investors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.name}
                className="p-8 rounded-sm space-y-5"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
              >
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={12} style={{ color: T.gold }} fill={T.gold} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed italic" style={{ color: T.textSub }}>"{t.quote}"</p>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{t.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: T.textDim }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Schedule Call CTA ────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-md p-12 md:p-20 text-center space-y-8 relative overflow-hidden"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${T.gold}05 0%, transparent 70%)` }} />
            <div className="relative z-10 space-y-6">
              <Badge variant="gold" className="mx-auto">Ready to Invest?</Badge>
              <h2 className="text-4xl font-black uppercase" style={{ color: T.text }}>
                Let's Talk <span style={{ color: T.gold }}>Capital</span>
              </h2>
              <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: T.textSub }}>
                Book a free 30-minute call with a Diversify advisor. We'll walk you through our current deal pipeline, answer your questions, and help you get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onScheduleCall} size="lg">
                  <Phone size={13} /> Schedule a Call
                </Button>
                <Button onClick={onStart} variant="outline" size="lg">
                  Access Platform <ArrowRight size={13} />
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

const RaiseCapitalPage: React.FC<{ onScheduleCall: () => void }> = ({ onScheduleCall }) => {
  const offers = [
    { icon: Users,      title: 'Accredited Investor Network', desc: 'Access our vetted network of 1,200+ accredited investors actively deploying capital into private real estate.' },
    { icon: BarChart2,  title: 'Deal Structuring Support',    desc: 'Our team helps optimize deal structure, offering documents, and capital stack to maximize investor appeal.' },
    { icon: FileCheck,  title: 'Full Compliance Framework',   desc: 'We handle 506(b) and 506(c) structuring, investor accreditation verification, and subscription document management.' },
    { icon: Globe,      title: 'International Capital',       desc: 'Tap into our international LP base spanning the U.S., Europe, Latin America, and Asia-Pacific.' },
    { icon: Layers,     title: 'Technology Platform',         desc: 'Your deal gets a dedicated portal page with performance dashboards, document vault, and investor reporting.' },
    { icon: Handshake,  title: 'Aligned Partnership',         desc: 'We only succeed when your deal closes. Our fees are tied to raised capital, not time.' },
  ];

  const steps = [
    { num: '01', title: 'Submit Your Deal', desc: 'Share your deal summary, financials, and track record through our sponsor application.' },
    { num: '02', title: 'Committee Review', desc: 'Our investment committee evaluates the deal across underwriting, operator quality, and market fundamentals.' },
    { num: '03', title: 'Platform Launch',  desc: 'Approved deals go live on the platform with a full investor portal, offering docs, and capital raise tracker.' },
    { num: '04', title: 'Capital Raised',   desc: 'Accredited investor capital flows in through our subscription process. We handle KYC, AML, and fund receipt.' },
  ];

  const requirements = [
    'Minimum $5M capital raise',
    'Established track record (2+ closed deals)',
    'Clear exit strategy with defined timeline',
    'Willingness to provide quarterly investor updates',
    'U.S.-based deals (international considered case-by-case)',
  ];

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <GridBg />
        <GlowOrb style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <Badge variant="gold" className="mx-auto">
            For Operators & Sponsors
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
            Raise Smarter.<br />
            <span style={{ color: T.gold }}>Close Faster.</span>
          </h1>

          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: T.textSub }}>
            Partner with Diversify to access a curated network of 1,200+ accredited investors ready to deploy into institutional-quality deals — on your timeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={onScheduleCall} size="lg">
              <Phone size={13} /> Talk to Our Team
            </Button>
            <Button variant="outline" size="lg">
              Submit a Deal <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4">
            <StatPill value="$2.1B+" label="Capital Raised" />
            <StatPill value="38"     label="Deals Funded" />
            <StatPill value="1,200+" label="Active LPs" />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(to bottom, ${T.gold}60, transparent)` }} />
        </div>
      </section>

      {/* ── What We Offer Sponsors ──────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <GlowOrb style={{ bottom: -200, right: -300, opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>What We Offer</p>
          </div>
          <h2 className="text-4xl font-black uppercase mb-4" style={{ color: T.text }}>Partner Benefits</h2>
          <p className="text-base mb-16 max-w-xl" style={{ color: T.textSub }}>
            We're more than a capital aggregator. We're a full-service capital raise partner built for serious operators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map(o => (
              <div
                key={o.title}
                className="p-6 rounded-sm space-y-4 transition-all duration-300"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
              >
                <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                  <o.icon size={18} style={{ color: T.gold }} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{o.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>The Process</p>
          </div>
          <h2 className="text-4xl font-black uppercase mb-16" style={{ color: T.text }}>How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black" style={{ color: T.gold }}>{s.num}</span>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px" style={{ background: `${T.gold}30` }} />
                  )}
                </div>
                <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: T.text }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Requirements + CTA ──────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-md p-12 md:p-20 relative overflow-hidden space-y-8"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${T.gold}05 0%, transparent 70%)` }} />
            <div className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <Badge variant="gold">Sponsor Requirements</Badge>
                  <h2 className="text-3xl font-black uppercase" style={{ color: T.text }}>
                    We Work With <span style={{ color: T.gold }}>Serious Operators</span>
                  </h2>
                  <ul className="space-y-3">
                    {requirements.map(r => (
                      <li key={r} className="flex items-start gap-2.5">
                        <CheckCircle size={14} style={{ color: T.jade, marginTop: 2, flexShrink: 0 }} />
                        <span className="text-sm" style={{ color: T.textSub }}>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <Building2 size={48} style={{ color: T.gold, margin: '0 auto' }} />
                  <p className="text-sm leading-relaxed" style={{ color: T.textSub }}>
                    Ready to bring your deal to 1,200+ accredited investors? Start with a discovery call with our sponsor relations team.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button onClick={onScheduleCall} size="lg" className="w-full">
                      <Phone size={13} /> Book a Sponsor Call
                    </Button>
                    <Button variant="outline" size="md" className="w-full">
                      Submit Deal Summary <ChevronRight size={13} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

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
        ].map(col => (
          <div key={col.heading} className="space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: T.textDim }}>{col.heading}</h4>
            <nav className="space-y-2.5">
              {col.links.map(link => (
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

// ─── Landing Page Shell ────────────────────────────────────────────────────────

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [activeTab, setActiveTab] = useState<LandingTab>('invest');
  const [showScheduleCall, setShowScheduleCall] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: T.bg, color: T.text }}>
      <Navbar onAccess={onStart} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'invest' ? (
        <InvestorPage onStart={onStart} onScheduleCall={() => setShowScheduleCall(true)} />
      ) : (
        <RaiseCapitalPage onScheduleCall={() => setShowScheduleCall(true)} />
      )}

      <LandingFooter />

      {showScheduleCall && <ScheduleCallModal onClose={() => setShowScheduleCall(false)} />}
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
        {currentView === 'calls'          && <CallsCalendar />}
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

  useEffect(() => { window.scrollTo({ top: 0 }); }, [appState]);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setAppState(userData.onboarded ? 'PORTAL' : 'ONBOARDING');
  };

  if (appState === 'LANDING')    return <LandingPage onStart={() => setAppState('AUTH')} />;
  if (appState === 'AUTH')       return <Auth onSuccess={handleLoginSuccess} onBack={() => setAppState('LANDING')} />;
  if (appState === 'ONBOARDING' && user) return <Onboarding user={user} onComplete={() => { setUser({ ...user, onboarded: true }); setAppState('PORTAL'); }} />;
  if (appState === 'PORTAL' && user)     return <Portal user={user} onLogout={() => { setUser(null); setAppState('LANDING'); }} onUpdateUser={(d) => setUser({ ...user!, ...d })} />;
  return null;
};

export default App;
