import React, { useState, useEffect } from 'react';
import { T, Button, Badge } from './UIElements';
import {
  ArrowLeft, ArrowRight, CheckCircle, Users, BarChart2, Shield, DollarSign,
  Globe, FileCheck, ChevronDown, X, CalendarDays, Briefcase,
} from 'lucide-react';
import { createDealSubmission, createMeeting, isSupabaseConfigured } from '../lib/supabase';

// ── helpers ──────────────────────────────────────────────────────────────────
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
    style={{ width: 600, height: 600, background: `radial-gradient(circle, ${T.gold}07 0%, transparent 70%)`, ...style }}
  />
);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-px" style={{ background: T.gold }} />
    <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>{text}</p>
  </div>
);

// ── Industry options ──────────────────────────────────────────────────────────
const INDUSTRIES = [
  'Multifamily', 'Industrial', 'Office', 'Retail', 'Mixed-Use',
  'Private Debt', 'Self-Storage', 'Hospitality', 'Development',
  'Healthcare Real Estate', 'Data Centers', 'Other',
];

const TIME_SLOTS = [
  'Morning (9am–12pm ET)',
  'Afternoon (12pm–3pm ET)',
  'Late Afternoon (3pm–6pm ET)',
  'Flexible — any time',
];

// ── Benefits data ─────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: Users,
    title: 'Aggregated Accredited Capital',
    desc: 'Access our network of 2,000+ accredited investors across the U.S. and internationally, all pre-vetted and ready to deploy capital.',
  },
  {
    icon: BarChart2,
    title: 'Structured Capital Raising',
    desc: 'Professional deal page, pitch deck hosting, investor updates, and data room — fully managed by our team with an end-to-end workflow.',
  },
  {
    icon: Shield,
    title: 'Regulatory Compliance Built In',
    desc: 'Our legal and compliance infrastructure handles Reg D filings, investor accreditation, and subscription agreements end-to-end.',
  },
  {
    icon: DollarSign,
    title: 'Faster Capital Formation',
    desc: 'Sponsors on our platform reach their fundraising targets 40% faster than traditional broker-dealer channels.',
  },
  {
    icon: Globe,
    title: 'Broad Investor Reach',
    desc: 'Single-family offices, trusts, corporates, and individual accredited investors — a diversified LP base that reduces concentration risk.',
  },
  {
    icon: FileCheck,
    title: 'Transparent Performance Reporting',
    desc: 'Quarterly reports, distribution notices, and K-1 distribution handled through our investor portal automatically.',
  },
];

// ── Form field helpers ────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  background: T.raised,
  border: `1px solid ${T.border}`,
  color: T.text,
};

const FieldInput: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}> = ({ label, value, onChange, placeholder, required, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
      {label}{required && <span style={{ color: T.gold }}> *</span>}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-sm text-sm outline-none"
      style={inputStyle}
    />
  </div>
);

const FieldSelect: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}> = ({ label, value, onChange, options, required }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
      {label}{required && <span style={{ color: T.gold }}> *</span>}
    </label>
    <div className="relative">
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-sm text-sm outline-none appearance-none"
        style={inputStyle}
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textDim }} />
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
}

type PageStep = 'form' | 'schedule' | 'done';

export const RaiseCapital: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<PageStep>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Step 1 — deal form
  const [deal, setDeal] = useState({
    project_name: '',
    company_name: '',
    contact_name: '',
    contact_email: '',
    industry: '',
    capital_needed: '',
    description: '',
  });

  // Step 2 — schedule call
  const [schedule, setSchedule] = useState({
    preferred_date: '',
    preferred_time: TIME_SLOTS[0],
  });

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const setD = (k: string, v: string) => setDeal((f) => ({ ...f, [k]: v }));
  const setS = (k: string, v: string) => setSchedule((f) => ({ ...f, [k]: v }));

  // Step 1 submit
  const handleDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (isSupabaseConfigured) {
      const { data, error: err } = await createDealSubmission({
        project_name: deal.project_name,
        company_name: deal.company_name,
        contact_name: deal.contact_name,
        contact_email: deal.contact_email,
        industry: deal.industry || null,
        capital_needed: deal.capital_needed || null,
        description: deal.description,
        status: 'new',
      });
      if (err) {
        setError('There was an error submitting your deal. Please try again.');
        setSubmitting(false);
        return;
      }
      setSubmissionId(data?.id ?? null);
    }

    setSubmitting(false);
    setStep('schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 submit
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const preferredDatetime = schedule.preferred_date
      ? `${schedule.preferred_date} — ${schedule.preferred_time}`
      : schedule.preferred_time;

    if (isSupabaseConfigured) {
      const { error: err } = await createMeeting({
        type: 'raise_capital',
        name: deal.contact_name,
        email: deal.contact_email,
        deal_submission_id: submissionId ?? undefined,
        preferred_datetime: preferredDatetime,
        status: 'pending',
      });
      if (err) {
        setError('There was an error scheduling the call. Please try again.');
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    setStep('done');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: T.bg, color: T.text }}>

      {/* ── Sticky Header ──────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: `${T.surface}F0`, borderBottom: `1px solid ${T.border}`, backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-amber-400"
            style={{ color: T.textSub }}
          >
            <ArrowLeft size={13} /> Back to Platform
          </button>
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
              <div className="absolute inset-1.5 rotate-45 rounded-sm" style={{ background: T.bg }} />
            </div>
            <span className="text-base font-black tracking-[0.15em] uppercase" style={{ color: T.text }}>Diversify</span>
          </div>
          <Button onClick={onBack} size="sm" variant="outline">Investor Platform</Button>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <GridBg />
        <GlowOrb style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-7">
          <Badge variant="gold" className="mx-auto">For Sponsors &amp; Deal Sponsors</Badge>
          <h1 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tight">
            Raise Capital<br />
            <span style={{ color: T.gold }}>With Diversify</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: T.textSub }}>
            Partner with us to access a pre-vetted network of 2,000+ accredited investors. We manage the full capital-raise workflow — so you can focus on executing the deal.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['No upfront fees', 'Full compliance support', 'Average raise $8.2M/deal', '40% faster fundraising'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <CheckCircle size={11} style={{ color: T.jade }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 relative" style={{ background: `${T.surface}80` }}>
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="Why Choose Diversify" />
          <h2 className="text-4xl font-black uppercase mb-4" style={{ color: T.text }}>
            Built for <span style={{ color: T.gold }}>Serious Sponsors</span>
          </h2>
          <p className="text-sm mb-14 max-w-xl" style={{ color: T.textSub }}>
            We're not just a marketplace. We're your capital-raising infrastructure — from compliance to investor communications.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-sm space-y-4 transition-all"
                style={{ background: T.surface, border: `1px solid ${T.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
              >
                <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                  <b.icon size={16} style={{ color: T.gold }} />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-wider" style={{ color: T.text }}>{b.title}</h4>
                <p className="text-[10px] leading-relaxed" style={{ color: T.textSub }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '42', label: 'Deals Launched' },
              { value: '$2.1B+', label: 'Capital Raised' },
              { value: '2,000+', label: 'Investor Network' },
              { value: '40%', label: 'Faster Fundraising' },
            ].map((s) => (
              <div key={s.label} className="p-5 rounded-sm text-center" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                <p className="text-2xl font-black" style={{ color: T.gold }}>{s.value}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: T.textDim }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form Area ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative">
        <GlowOrb style={{ top: -100, right: -200, opacity: 0.5 }} />
        <div className="max-w-2xl mx-auto relative z-10">

          {/* Step indicator */}
          {step !== 'done' && (
            <div className="flex items-center gap-3 mb-10">
              {([
                { n: 1, id: 'form',     label: 'Submit Deal' },
                { n: 2, id: 'schedule', label: 'Schedule Call' },
              ] as const).map(({ n, id, label }, idx) => (
                <React.Fragment key={id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-sm flex items-center justify-center text-[9px] font-black"
                      style={{
                        background: step === id ? T.gold : step === 'schedule' && id === 'form' ? T.jade : T.raised,
                        color: step === id ? '#000' : step === 'schedule' && id === 'form' ? '#000' : T.textDim,
                        border: `1px solid ${step === id ? T.gold : step === 'schedule' && id === 'form' ? T.jade : T.border}`,
                      }}
                    >
                      {step === 'schedule' && id === 'form' ? <CheckCircle size={11} /> : n}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: step === id ? T.text : T.textDim }}>{label}</span>
                  </div>
                  {idx < 1 && <div className="flex-1 h-px" style={{ background: T.border }} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* ── STEP 1: Submit Deal ────────────────────────────────────── */}
          {step === 'form' && (
            <div>
              <div className="mb-8">
                <SectionLabel text="Get Started" />
                <h2 className="text-3xl font-black uppercase" style={{ color: T.text }}>
                  Submit Your <span style={{ color: T.gold }}>Deal</span>
                </h2>
                <p className="text-sm mt-3" style={{ color: T.textSub }}>
                  Tell us about your project. Our team reviews all submissions within 2 business days.
                </p>
              </div>

              <form onSubmit={handleDealSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldInput label="Project / Deal Name" value={deal.project_name} onChange={(v) => setD('project_name', v)} placeholder="e.g. Riverside Multifamily Phase II" required />
                  <FieldInput label="Company Name" value={deal.company_name} onChange={(v) => setD('company_name', v)} placeholder="e.g. Acme Capital Partners" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldInput label="Contact Name" value={deal.contact_name} onChange={(v) => setD('contact_name', v)} placeholder="John Smith" required />
                  <FieldInput label="Contact Email" value={deal.contact_email} onChange={(v) => setD('contact_email', v)} placeholder="john@acme.com" required type="email" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FieldSelect label="Industry / Asset Class" value={deal.industry} onChange={(v) => setD('industry', v)} options={INDUSTRIES} />
                  <FieldInput label="Capital Needed (optional)" value={deal.capital_needed} onChange={(v) => setD('capital_needed', v)} placeholder="e.g. $10,000,000" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
                    Short Description <span style={{ color: T.gold }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={deal.description}
                    onChange={(e) => setD('description', e.target.value)}
                    placeholder="Describe your deal: asset type, location, strategy, timeline, and why it's a compelling opportunity…"
                    className="w-full px-3 py-2.5 rounded-sm text-sm outline-none resize-none"
                    style={inputStyle}
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-sm text-xs" style={{ background: '#ff808015', border: '1px solid #ff808040', color: '#ff8080' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-sm text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-opacity"
                  style={{ background: T.gold, color: '#000', opacity: submitting ? 0.6 : 1 }}
                >
                  {submitting ? (
                    <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting…</>
                  ) : (
                    <><Briefcase size={14} /> Submit Deal &amp; Continue <ArrowRight size={13} /></>
                  )}
                </button>

                <p className="text-[10px] text-center" style={{ color: T.textDim }}>
                  Your information is reviewed confidentially by our capital formation team.
                </p>
              </form>
            </div>
          )}

          {/* ── STEP 2: Schedule a Call ────────────────────────────────── */}
          {step === 'schedule' && (
            <div>
              <div className="mb-8">
                <SectionLabel text="Almost There" />
                <h2 className="text-3xl font-black uppercase" style={{ color: T.text }}>
                  Schedule a <span style={{ color: T.gold }}>Call</span>
                </h2>
                <p className="text-sm mt-3" style={{ color: T.textSub }}>
                  Your deal was submitted successfully. Book a 30-minute intro call with our capital formation team.
                </p>
              </div>

              {/* Deal summary */}
              <div className="mb-6 p-4 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: T.gold }}>Deal Submitted</p>
                <p className="text-xs font-bold" style={{ color: T.text }}>{deal.project_name} — {deal.company_name}</p>
                <p className="text-[10px] mt-0.5" style={{ color: T.textDim }}>{deal.industry || 'Real Estate'}{deal.capital_needed ? ` · ${deal.capital_needed}` : ''}</p>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-5">
                <FieldInput label="Preferred Date (optional)" value={schedule.preferred_date} onChange={(v) => setS('preferred_date', v)} type="date" />
                <FieldSelect label="Preferred Time Slot" value={schedule.preferred_time} onChange={(v) => setS('preferred_time', v)} options={TIME_SLOTS} required />

                {/* What to expect */}
                <div className="p-4 rounded-sm space-y-3" style={{ background: `${T.gold}08`, border: `1px solid ${T.gold}25` }}>
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.gold }}>What to Expect on the Call</p>
                  {[
                    'A 30-minute introductory call with our capital formation team',
                    'Discussion of deal structure, timeline, and investor requirements',
                    'Overview of platform terms, fees, and marketing approach',
                  ].map((s) => (
                    <div key={s} className="flex items-start gap-2">
                      <CheckCircle size={11} className="mt-0.5 shrink-0" style={{ color: T.gold }} />
                      <p className="text-[10px] leading-relaxed" style={{ color: T.textSub }}>{s}</p>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-sm text-xs" style={{ background: '#ff808015', border: '1px solid #ff808040', color: '#ff8080' }}>
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-widest"
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
                      <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Confirming…</>
                    ) : (
                      <><CalendarDays size={13} /> Confirm Call Request</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── DONE ──────────────────────────────────────────────────── */}
          {step === 'done' && (
            <div className="text-center space-y-6 py-12">
              <div className="w-20 h-20 rounded-sm flex items-center justify-center mx-auto" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
                <CheckCircle size={36} style={{ color: T.jade }} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] mb-2" style={{ color: T.gold }}>You're all set</p>
                <h2 className="text-3xl font-black uppercase mb-3" style={{ color: T.text }}>
                  Call Request Confirmed
                </h2>
                <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: T.textSub }}>
                  Thank you, {deal.contact_name.split(' ')[0]}. Our capital formation team will reach out within 1 business day to confirm your slot.
                </p>
              </div>

              <div className="p-5 rounded-sm text-left max-w-sm mx-auto" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: T.textDim }}>What Happens Next</p>
                {[
                  'Initial screening by our deal team',
                  'Introductory call to discuss your opportunity',
                  'Full committee due diligence (if shortlisted)',
                  'Launch on the Diversify platform',
                ].map((s, i) => (
                  <div key={s} className="flex items-center gap-2.5 mt-2">
                    <div className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0 text-[9px] font-black" style={{ background: T.goldFaint, color: T.gold }}>
                      {i + 1}
                    </div>
                    <p className="text-[10px]" style={{ color: T.textSub }}>{s}</p>
                  </div>
                ))}
              </div>

              <Button onClick={onBack} variant="outline">Back to Platform</Button>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
              <div className="absolute inset-1 rotate-45 rounded-sm" style={{ background: T.bg }} />
            </div>
            <span className="text-sm font-black tracking-[0.18em] uppercase" style={{ color: T.text }}>Diversify</span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: T.textDim }}>
            © 2025 DIVERSIFY CAPITAL. NOT INVESTMENT ADVICE. ACCREDITED INVESTORS ONLY.
          </p>
          <button onClick={onBack} className="text-[10px] uppercase tracking-widest transition-colors hover:text-amber-400" style={{ color: T.textDim }}>
            ← Back to Platform
          </button>
        </div>
      </footer>
    </div>
  );
};
