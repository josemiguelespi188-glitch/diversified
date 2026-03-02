import React, { useState, useRef } from 'react';
import { T, Badge, Button, ProgressBar } from './UIElements';
import { Navbar } from './Navbar';
import { MOCK_DEALS } from '../constants';
import {
  Shield, BarChart2, Users, Zap, ArrowRight, CheckCircle, MapPin,
  Lock, ChevronDown, CalendarDays,
} from 'lucide-react';
import { createMeeting, isSupabaseConfigured } from '../lib/supabase';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${(n / 1_000).toFixed(0)}K`;

// ── sub-components ────────────────────────────────────────────────────────────
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

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-px" style={{ background: T.gold }} />
    <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>{text}</p>
  </div>
);

// ── Deal Carousel (marquee) ───────────────────────────────────────────────────
const CARD_W = 300;
const GAP    = 16;
const MARQUEE_DEALS = [...MOCK_DEALS, ...MOCK_DEALS];

const DealsCarousel: React.FC<{ onCTA: () => void }> = ({ onCTA }) => {
  const trackW = MOCK_DEALS.length * (CARD_W + GAP);
  return (
    <>
      <style>{`
        @keyframes marquee-land {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${trackW}px); }
        }
        .marquee-land { animation: marquee-land ${MOCK_DEALS.length * 5}s linear infinite; }
        .marquee-land:hover { animation-play-state: paused; }
      `}</style>
      <div
        className="overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
      >
        <div className="marquee-land flex" style={{ gap: GAP, width: trackW * 2 }}>
          {MARQUEE_DEALS.map((deal, i) => (
            <div
              key={`${deal.id}-${i}`}
              className="rounded-sm overflow-hidden group shrink-0 cursor-pointer"
              style={{ width: CARD_W, background: T.surface, border: `1px solid ${T.border}`, transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}60`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
              onClick={onCTA}
            >
              <div className="relative overflow-hidden" style={{ height: 140 }}>
                <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-300 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.surface} 0%, transparent 60%)` }} />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ background: `${T.gold}20`, color: T.gold, border: `1px solid ${T.gold}40` }}>{deal.asset_class}</span>
                  {deal.accredited_required && (
                    <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm" style={{ background: `${T.jade}20`, color: T.jade, border: `1px solid ${T.jade}40` }}>
                      <Lock size={7} /> Accredited
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 text-right">
                  <span className="text-xl font-black" style={{ color: T.gold }}>{deal.projected_irr}%</span>
                  <span className="text-[9px] ml-1 font-bold uppercase" style={{ color: T.textDim }}>IRR</span>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide leading-tight truncate" style={{ color: T.text }}>{deal.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={9} style={{ color: T.gold }} />
                    <p className="text-[9px]" style={{ color: T.textDim }}>{deal.location} · Min. {fmt(deal.minimum_investment)}</p>
                  </div>
                </div>
                <ProgressBar value={deal.progress} />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest" style={{ color: T.textDim }}>{deal.progress}% Funded</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onCTA(); }}
                    className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-sm transition-all"
                    style={{ background: T.goldFaint, color: T.gold, border: `1px solid ${T.gold}30` }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = '#000'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = T.goldFaint; e.currentTarget.style.color = T.gold; }}
                  >
                    Invest Now <ArrowRight size={9} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ── Portfolio deal card (public, no lock) ────────────────────────────────────
const PortfolioCard: React.FC<{ deal: typeof MOCK_DEALS[0]; onCTA: () => void }> = ({ deal, onCTA }) => (
  <div
    className="rounded-sm overflow-hidden flex flex-col group cursor-pointer transition-all duration-300"
    style={{ background: T.surface, border: `1px solid ${T.border}` }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
    onClick={onCTA}
  >
    <div className="relative h-44 overflow-hidden flex-shrink-0">
      <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.surface} 0%, transparent 60%)` }} />
      <div className="absolute top-3 left-3 flex gap-1.5">
        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ background: `${T.jade}20`, color: T.jade, border: `1px solid ${T.jade}30` }}>Active</span>
        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ background: `${T.border}`, color: T.textDim }}>{deal.asset_class}</span>
      </div>
      {deal.accredited_required && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm" style={{ background: `${T.gold}20`, color: T.gold, border: `1px solid ${T.gold}40` }}>
            <Lock size={7} /> Accredited
          </span>
        </div>
      )}
      <div className="absolute bottom-3 left-4 right-4 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>Funded</span>
          <span className="text-[10px] font-black" style={{ color: T.jade }}>{deal.progress}%</span>
        </div>
        <ProgressBar value={deal.progress} color={T.jade} />
      </div>
    </div>
    <div className="p-5 space-y-4 flex-1 flex flex-col">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wide group-hover:text-amber-400 transition-colors" style={{ color: T.text }}>{deal.title}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={10} style={{ color: T.gold }} />
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>{deal.location} · {deal.sponsor}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 py-4" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        {[
          { label: 'Target IRR', value: `${deal.projected_irr}%`, color: T.gold },
          { label: 'Cash Yield', value: `${deal.cash_yield}%`, color: T.jade },
          { label: 'Min. Invest', value: fmt(deal.minimum_investment), color: T.text },
          { label: 'Term', value: `${deal.term_years} yrs`, color: T.text },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[8px] font-black uppercase tracking-widest mb-0.5" style={{ color: T.textDim }}>{s.label}</p>
            <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {deal.tags.map((tag) => (
          <span key={tag} className="text-[8px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest" style={{ background: T.raised, color: T.textDim, border: `1px solid ${T.border}` }}>{tag}</span>
        ))}
      </div>
      <div className="mt-auto pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={(e) => { e.stopPropagation(); onCTA(); }}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
          style={{ background: T.goldFaint, color: T.gold, border: `1px solid ${T.gold}30` }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = '#000'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.goldFaint; e.currentTarget.style.color = T.gold; }}
        >
          View Deal &amp; Invest <ArrowRight size={10} />
        </button>
      </div>
    </div>
  </div>
);

// ── Main LandingPage ──────────────────────────────────────────────────────────
interface LandingPageProps {
  onStart: () => void;
  onAdminAccess: () => void;
  onRaiseCapital: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onAdminAccess, onRaiseCapital }) => {
  const portfolioRef = useRef<HTMLDivElement>(null);

  // ── Investor Schedule-a-Call state ───────────────────────────────────────
  const [scheduleForm, setScheduleForm] = useState({ name: '', email: '', investor_type: '', investment_range: '', preferred_datetime: '' });
  const [scheduleStep, setScheduleStep] = useState<'form' | 'done'>('form');
  const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const setSF = (k: string, v: string) => setScheduleForm((f) => ({ ...f, [k]: v }));

  const principles = [
    { icon: Shield,    title: 'Committee-Led',         desc: 'Every deal passes a multi-stage review before reaching the platform. No exceptions.' },
    { icon: BarChart2, title: 'Institutional Reports', desc: 'Asset-level transparency, quarterly updates, and audit-grade documentation on every position.' },
    { icon: Users,     title: 'Aligned Capital',       desc: 'Our capital is invested alongside yours. We only succeed when you do.' },
    { icon: Zap,       title: 'Portfolio Approach',    desc: 'Strategy, geography, and asset class diversification built into every allocation.' },
  ];

  const checklist = [
    'Accredited investors only — U.S. & International',
    'Minimum investments from $20,000',
    'Institutional-grade underwriting on every deal',
    'Full document access, zero gatekeeping',
  ];

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSubmitting(true);
    setScheduleError('');
    if (isSupabaseConfigured) {
      const { error: err } = await createMeeting({
        type: 'investor',
        name: scheduleForm.name,
        email: scheduleForm.email,
        investor_type: scheduleForm.investor_type || null,
        investment_range: scheduleForm.investment_range || null,
        preferred_datetime: scheduleForm.preferred_datetime || null,
        status: 'pending',
      });
      if (err) {
        setScheduleError('There was an error. Please try again.');
        setScheduleSubmitting(false);
        return;
      }
    }
    setScheduleSubmitting(false);
    setScheduleStep('done');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: T.bg, color: T.text }}>
      <Navbar onAccess={onStart} onPortfolio={() => { portfolioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} onRaise={onRaiseCapital} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
        <GridBg />
        <GlowOrb style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <Badge variant="gold" className="mx-auto">Private Capital Infrastructure — Accredited Investors Only</Badge>
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
              Invest Now <ArrowRight size={14} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo('raise')}>
              Raise Capital With Us
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4">
            <StatPill value="$2.1B+" label="Capital Deployed" />
            <StatPill value="38" label="Active Deals" />
            <StatPill value="14.2%" label="Avg. IRR" />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(to bottom, ${T.gold}60, transparent)` }} />
        </div>
      </section>

      {/* ── Active Deals Carousel ─────────────────────────────────────── */}
      <section className="py-20 px-6 relative overflow-hidden">
        <GlowOrb style={{ top: -200, left: -300, opacity: 0.4 }} />
        <div className="max-w-6xl mx-auto relative z-10 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <SectionLabel text="Active Opportunities" />
              <h2 className="text-3xl font-black uppercase" style={{ color: T.text }}>
                Current <span style={{ color: T.gold }}>Live Deals</span>
              </h2>
            </div>
            <button
              onClick={() => portfolioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
              style={{ background: T.goldFaint, color: T.gold, border: `1px solid ${T.gold}40` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.goldFaint; e.currentTarget.style.color = T.gold; }}
            >
              View All Deals <ArrowRight size={11} />
            </button>
          </div>
        </div>
        <DealsCarousel onCTA={onStart} />
      </section>

      {/* ── Our Portfolio ─────────────────────────────────────────────── */}
      <section ref={portfolioRef} className="py-24 px-6 relative" style={{ background: `${T.surface}80` }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <SectionLabel text="Our Portfolio" />
              <h2 className="text-4xl font-black uppercase" style={{ color: T.text }}>
                Deals on the <span style={{ color: T.gold }}>Platform</span>
              </h2>
              <p className="text-sm mt-3 max-w-xl" style={{ color: T.textSub }}>
                Every deal is committee-reviewed, independently underwritten, and structured for accredited investors. Sign in to access full details and invest.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: T.textDim }}>
                <span className="w-2 h-2 rounded-full" style={{ background: T.jade }} /> Open to all investors
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest" style={{ color: T.textDim }}>
                <Lock size={10} style={{ color: T.gold }} /> Accredited investors only
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_DEALS.map((deal) => (
              <PortfolioCard key={deal.id} deal={deal} onCTA={onStart} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm mb-4" style={{ color: T.textSub }}>Ready to invest in institutional-grade private real estate?</p>
            <Button onClick={onStart} size="lg" className="mx-auto">
              Access Platform &amp; Invest <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Philosophy ────────────────────────────────────────────────── */}
      <section id="philosophy" className="py-28 px-6 relative" style={{ background: `${T.surface}80` }}>
        <GlowOrb style={{ bottom: -200, right: -300, opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionLabel text="Our Philosophy" />
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

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-md p-12 md:p-20 text-center space-y-8 relative overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
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

      {/* ── Schedule a Call (Investor) ────────────────────────────────── */}
      <section className="py-28 px-6 relative">
        <GlowOrb style={{ bottom: -100, left: -200, opacity: 0.5 }} />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SectionLabel text="Talk to Our Team" />
            <h2 className="text-4xl font-black uppercase" style={{ color: T.text }}>
              Schedule a <span style={{ color: T.gold }}>Call</span>
            </h2>
            <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: T.textSub }}>
              Ready to learn more? Book a quick intro call with our investment team — no commitments, just clarity.
            </p>
          </div>

          {scheduleStep === 'form' ? (
            <div className="p-8 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
              <form onSubmit={handleScheduleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Full Name <span style={{ color: T.gold }}>*</span></label>
                    <input required type="text" value={scheduleForm.name} onChange={(e) => setSF('name', e.target.value)} placeholder="Jane Doe" className="w-full px-3 py-2.5 rounded-sm text-sm outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Email Address <span style={{ color: T.gold }}>*</span></label>
                    <input required type="email" value={scheduleForm.email} onChange={(e) => setSF('email', e.target.value)} placeholder="jane@example.com" className="w-full px-3 py-2.5 rounded-sm text-sm outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Investor Type (optional)</label>
                    <div className="relative">
                      <select value={scheduleForm.investor_type} onChange={(e) => setSF('investor_type', e.target.value)} className="w-full px-3 py-2.5 rounded-sm text-sm outline-none appearance-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}>
                        <option value="">Select…</option>
                        {['Individual Accredited', 'Family Office', 'Trust', 'Corporation / LLC', 'IRA / Self-Directed', 'Fund of Funds', 'Other'].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textDim }} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Investment Range (optional)</label>
                    <div className="relative">
                      <select value={scheduleForm.investment_range} onChange={(e) => setSF('investment_range', e.target.value)} className="w-full px-3 py-2.5 rounded-sm text-sm outline-none appearance-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}>
                        <option value="">Select…</option>
                        {['$25K – $100K', '$100K – $250K', '$250K – $500K', '$500K – $1M', '$1M+'].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textDim }} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Preferred Date &amp; Time (optional)</label>
                  <div className="relative">
                    <select value={scheduleForm.preferred_datetime} onChange={(e) => setSF('preferred_datetime', e.target.value)} className="w-full px-3 py-2.5 rounded-sm text-sm outline-none appearance-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}>
                      <option value="">Flexible — any time</option>
                      {['Morning (9am–12pm ET)', 'Afternoon (12pm–3pm ET)', 'Late Afternoon (3pm–6pm ET)'].map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textDim }} />
                  </div>
                </div>

                {scheduleError && (
                  <div className="px-4 py-3 rounded-sm text-xs" style={{ background: '#ff808015', border: '1px solid #ff808040', color: '#ff8080' }}>
                    {scheduleError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={scheduleSubmitting}
                  className="w-full py-4 rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-opacity"
                  style={{ background: T.gold, color: '#000', opacity: scheduleSubmitting ? 0.6 : 1 }}
                >
                  {scheduleSubmitting ? (
                    <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting…</>
                  ) : (
                    <><CalendarDays size={14} /> Request a Call</>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-sm text-center space-y-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
              <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
                <CheckCircle size={28} style={{ color: T.jade }} />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: T.text }}>Request Received</p>
                <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: T.textSub }}>
                  Thank you, {scheduleForm.name.split(' ')[0]}. Our team will reach out within 1 business day to confirm your call.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
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
              { heading: 'Sponsors',   links: ['Submit a Deal', 'Partnership Terms', 'Contact'] },
            ].map((col) => (
              <div key={col.heading} className="space-y-4">
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: T.textDim }}>{col.heading}</h4>
                <nav className="space-y-2.5">
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="block text-xs transition-colors hover:text-amber-400"
                      style={{ color: T.textSub }}
                      onClick={link === 'Submit a Deal' ? (e) => { e.preventDefault(); onRaiseCapital(); } : undefined}
                    >
                      {link}
                    </a>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 flex items-center justify-between" style={{ borderTop: `1px solid ${T.border}` }}>
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: T.textDim }}>
            © 2025 DIVERSIFY CAPITAL. ALL RIGHTS RESERVED. NOT INVESTMENT ADVICE. ACCREDITED INVESTORS ONLY.
          </p>
          <button
            onClick={onAdminAccess}
            className="text-[9px] uppercase tracking-widest transition-opacity opacity-30 hover:opacity-70"
            style={{ color: T.textDim }}
          >
            Admin Portal
          </button>
        </div>
      </footer>

    </div>
  );
};
