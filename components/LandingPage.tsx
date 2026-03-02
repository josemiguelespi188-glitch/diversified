import React, { useState, useRef } from 'react';
import { T, Badge, Button, ProgressBar } from './UIElements';
import { Navbar } from './Navbar';
import { MOCK_DEALS } from '../constants';
import { DealSubmission } from '../types';
import {
  Shield, BarChart2, Users, Zap, ArrowRight, CheckCircle, MapPin,
  TrendingUp, DollarSign, Building2, Clock, Lock, X, Send, Phone,
  ChevronDown, Briefcase, Star, Globe, FileCheck, CalendarDays,
} from 'lucide-react';

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

// ── Submit Deal Modal ─────────────────────────────────────────────────────────
const ASSET_CLASSES = ['Multifamily', 'Industrial', 'Office', 'Retail', 'Mixed-Use', 'Private Debt', 'Self-Storage', 'Hospitality', 'Development', 'Other'];
const STRUCTURES_OPTS = ['Reg D 506(c)', 'Reg D 506(b)', 'Reg A', 'Reg CF', 'Not Sure Yet'];
const CALL_TIMES = ['Morning (9am–12pm ET)', 'Afternoon (12pm–3pm ET)', 'Late Afternoon (3pm–6pm ET)', 'Flexible — any time'];

const SubmitDealModal: React.FC<{ onClose: () => void; onSubmit: (sub: DealSubmission) => void }> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState<1 | 2 | 'done'>(1);
  const [form, setForm] = useState({
    sponsor_company: '', contact_name: '', contact_email: '', contact_phone: '',
    asset_class: ASSET_CLASSES[0], target_raise: '', projected_irr: '',
    structure: STRUCTURES_OPTS[0], description: '', preferred_call_time: CALL_TIMES[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    const sub: DealSubmission = {
      id: `sub_${Date.now()}`,
      ...form,
      submitted_at: new Date().toISOString(),
      status: 'new',
    };
    onSubmit(sub);
    setSubmitting(false);
    setStep('done');
  };

  const field = (label: string, key: string, props?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>{label}</label>
      <input
        value={(form as Record<string,string>)[key]}
        onChange={(e) => set(key, e.target.value)}
        className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
        style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
        {...props}
      />
    </div>
  );

  const dropdown = (label: string, key: string, opts: string[]) => (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>{label}</label>
      <div className="relative">
        <select
          value={(form as Record<string,string>)[key]}
          onChange={(e) => set(key, e.target.value)}
          className="w-full px-3 py-2.5 rounded-sm text-sm outline-none appearance-none"
          style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
        >
          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textDim }} />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-xl rounded-sm overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Raise Capital</p>
            <h2 className="text-sm font-black uppercase tracking-wider" style={{ color: T.text }}>Submit Your Deal</h2>
          </div>
          <button onClick={onClose} style={{ color: T.textDim }}><X size={16} /></button>
        </div>

        {step === 'done' ? (
          <div className="p-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
              <CheckCircle size={28} style={{ color: T.jade }} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: T.text }}>Submission Received</p>
              <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: T.textSub }}>
                Thank you, {form.contact_name.split(' ')[0]}. Our capital formation team will review your deal and reach out within 2 business days to schedule a call.
              </p>
            </div>
            <div className="px-4 py-3 rounded-sm text-left" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: T.textDim }}>What happens next</p>
              {['Initial screening by our deal team', 'Introductory call to discuss your opportunity', 'Full committee due diligence (if shortlisted)', 'Launch on the Diversify platform'].map((s, i) => (
                <div key={s} className="flex items-center gap-2 mt-1.5">
                  <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0 text-[9px] font-black" style={{ background: T.goldFaint, color: T.gold }}>{i + 1}</div>
                  <p className="text-[10px]" style={{ color: T.textSub }}>{s}</p>
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest"
              style={{ background: T.gold, color: '#000' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="p-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-black" style={{ background: step === s ? T.gold : T.raised, color: step === s ? '#000' : T.textDim, border: `1px solid ${step === s ? T.gold : T.border}` }}>{s}</div>
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: step === s ? T.text : T.textDim }}>{s === 1 ? 'Deal Info' : 'Schedule Call'}</span>
                  </div>
                  {s < 2 && <div className="flex-1 h-px" style={{ background: T.border }} />}
                </React.Fragment>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {field('Sponsor / Company', 'sponsor_company', { required: true, placeholder: 'Acme Capital Partners' })}
                  {field('Contact Name', 'contact_name', { required: true, placeholder: 'John Smith' })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {field('Email Address', 'contact_email', { required: true, type: 'email', placeholder: 'john@acme.com' })}
                  {field('Phone Number', 'contact_phone', { placeholder: '+1 (555) 000-0000' })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {dropdown('Asset Class', 'asset_class', ASSET_CLASSES)}
                  {dropdown('Structure', 'structure', STRUCTURES_OPTS)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {field('Target Raise', 'target_raise', { required: true, placeholder: '$10,000,000' })}
                  {field('Projected IRR', 'projected_irr', { placeholder: '14%' })}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Brief Deal Description</label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="Briefly describe the opportunity: asset type, location, strategy, and why it's compelling…"
                    className="w-full px-3 py-2.5 rounded-sm text-sm outline-none resize-none"
                    style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  style={{ background: T.gold, color: '#000' }}
                >
                  Continue <ArrowRight size={13} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: T.gold }}>Deal Summary</p>
                  <p className="text-xs font-semibold" style={{ color: T.text }}>{form.sponsor_company} — {form.asset_class}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: T.textDim }}>{form.structure} · Target: {form.target_raise} · IRR: {form.projected_irr}</p>
                </div>

                {dropdown('Preferred Call Time', 'preferred_call_time', CALL_TIMES)}

                <div className="space-y-3 p-4 rounded-sm" style={{ background: `${T.gold}08`, border: `1px solid ${T.gold}25` }}>
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.gold }}>What to Expect on the Call</p>
                  {[
                    'A 30-minute introductory call with our capital formation team',
                    'Discussion of your deal structure, timeline, and investor requirements',
                    'Overview of our platform terms, fees, and marketing approach',
                  ].map((s) => (
                    <div key={s} className="flex items-start gap-2">
                      <CheckCircle size={11} className="mt-0.5 shrink-0" style={{ color: T.gold }} />
                      <p className="text-[10px] leading-relaxed" style={{ color: T.textSub }}>{s}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest"
                    style={{ background: T.raised, color: T.textDim, border: `1px solid ${T.border}` }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-opacity"
                    style={{ background: T.gold, color: '#000', opacity: submitting ? 0.6 : 1 }}
                  >
                    {submitting ? (
                      <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting…</>
                    ) : (
                      <><CalendarDays size={13} /> Schedule a Call</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

// ── Main LandingPage ──────────────────────────────────────────────────────────
interface LandingPageProps {
  onStart: () => void;
  onAdminAccess: () => void;
  onSubmitDeal: (sub: DealSubmission) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onAdminAccess, onSubmitDeal }) => {
  const [activeSection, setActiveSection] = useState<'invest' | 'portfolio' | 'raise'>('invest');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const portfolioRef  = useRef<HTMLDivElement>(null);
  const raiseRef      = useRef<HTMLDivElement>(null);

  const scrollTo = (section: 'portfolio' | 'raise') => {
    setActiveSection(section);
    const ref = section === 'portfolio' ? portfolioRef : raiseRef;
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const raiseCapitalBenefits = [
    { icon: Users,     title: 'Aggregated Accredited Capital',   desc: 'Access our network of 2,000+ accredited investors across the U.S. and internationally, all pre-vetted and ready to deploy.' },
    { icon: BarChart2, title: 'Institutional Marketing',         desc: 'Professional deal page, pitch deck hosting, investor updates, and data room — fully managed by our team at no upfront cost.' },
    { icon: Shield,    title: 'Regulatory Compliance Built In',  desc: 'Our legal and compliance infrastructure handles Reg D filings, investor accreditation, and subscription agreements end-to-end.' },
    { icon: DollarSign,title: 'Faster Capital Formation',        desc: 'Sponsors on our platform reach their fundraising targets 40% faster than traditional broker-dealer channels.' },
    { icon: Globe,     title: 'Broad Investor Reach',            desc: 'Single-family offices, trusts, corporates, and individual accredited investors — diversified LP base reduces concentration risk.' },
    { icon: FileCheck, title: 'Transparent Performance Reporting',desc: 'Quarterly reports, distribution notices, and K-1 distribution are handled through our investor portal automatically.' },
  ];

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

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: T.bg, color: T.text }}>
      <Navbar onAccess={onStart} onPortfolio={() => scrollTo('portfolio')} onRaise={() => scrollTo('raise')} />

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
              Access the Platform <ArrowRight size={14} />
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
              onClick={() => scrollTo('portfolio')}
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

      {/* ── Raise Capital With Us ─────────────────────────────────────── */}
      <section ref={raiseRef} className="py-28 px-6 relative">
        <GlowOrb style={{ top: -100, right: -300, opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: copy */}
            <div>
              <SectionLabel text="For Sponsors" />
              <h2 className="text-4xl font-black uppercase mb-6" style={{ color: T.text }}>
                Raise Capital<br />
                <span style={{ color: T.gold }}>With Us</span>
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: T.textSub }}>
                Diversify partners with experienced real estate sponsors to bring institutional-quality private placements to our network of 2,000+ accredited investors. We manage the full capital-raise workflow — so you can focus on executing the deal.
              </p>

              <div className="space-y-2 mb-10">
                {[
                  'No upfront placement fees',
                  'Full compliance and Reg D filing support',
                  'Investor CRM and reporting portal included',
                  'Average raise of $8.2M per deal on the platform',
                  'Co-investment from Diversify capital on select deals',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle size={14} style={{ color: T.jade, flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: T.textSub }}>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="flex items-center gap-2.5 px-8 py-4 rounded-sm text-sm font-black uppercase tracking-widest transition-all group"
                style={{ background: T.gold, color: '#000' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                <Briefcase size={16} />
                Submit Your Deal
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] mt-3" style={{ color: T.textDim }}>
                Our team reviews all submissions within 2 business days.
              </p>
            </div>

            {/* Right: benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {raiseCapitalBenefits.map((b) => (
                <div
                  key={b.title}
                  className="p-5 rounded-sm space-y-3 transition-all"
                  style={{ background: T.surface, border: `1px solid ${T.border}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
                >
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                    <b.icon size={15} style={{ color: T.gold }} />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider" style={{ color: T.text }}>{b.title}</h4>
                  <p className="text-[10px] leading-relaxed" style={{ color: T.textSub }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '42', label: 'Deals Launched' },
              { value: '$2.1B+', label: 'Capital Raised' },
              { value: '2,000+', label: 'Investor Network' },
              { value: '40%', label: 'Faster Fundraising' },
            ].map((s) => (
              <div key={s.label} className="p-5 rounded-sm text-center" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <p className="text-2xl font-black" style={{ color: T.gold }}>{s.value}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: T.textDim }}>{s.label}</p>
              </div>
            ))}
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
                      onClick={link === 'Submit a Deal' ? (e) => { e.preventDefault(); setShowSubmitModal(true); } : undefined}
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

      {/* Submit Deal Modal */}
      {showSubmitModal && (
        <SubmitDealModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={(sub) => { onSubmitDeal(sub); }}
        />
      )}
    </div>
  );
};
