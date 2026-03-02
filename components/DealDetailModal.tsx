import React, { useEffect, useState } from 'react';
import { Deal } from '../types';
import { Badge, ProgressBar, T } from './UIElements';
import {
  X, MapPin, ShieldCheck, TrendingUp, DollarSign, Clock, Building2,
  FileText, Download, PlayCircle, ArrowRight, ChevronLeft, ChevronRight,
  Target, BarChart2, Landmark, Users, AlertTriangle, Lock,
} from 'lucide-react';

// ── Per-deal rich content ──────────────────────────────────────────────────
const DEAL_CONTENT: Record<string, {
  youtube_id: string;
  tagline: string;
  summary: string;
  highlights: Array<{ icon: React.ElementType; title: string; body: string }>;
  thesis: string;
  sponsor_bio: string;
  risks: string[];
}> = {
  d1: {
    youtube_id: 'B7zQGKNsX0w',
    tagline: 'Institutional-grade multifamily in one of the fastest-growing Sun Belt metros.',
    summary: 'The Phoenix Multifamily Fund targets Class A and B+ residential communities across the Greater Phoenix MSA. The fund capitalizes on population migration from high-cost coastal markets, constrained new supply, and a diversified employment base anchored by technology, healthcare, and logistics. The sponsor implements a disciplined value-add strategy: light renovations, amenity upgrades, and operational optimization to drive NOI growth and deliver superior risk-adjusted returns to limited partners.',
    highlights: [
      { icon: TrendingUp, title: 'Strong Rent Growth Tailwinds', body: 'Phoenix leads the nation with 8–12% annual rent growth driven by net in-migration of 80,000+ residents per year. Vacancy rates remain below 4% across target submarkets.' },
      { icon: Building2, title: 'Diversified Portfolio of 6 Assets', body: 'The fund acquires a portfolio of 6 stabilized multifamily communities totaling 1,240 units across Scottsdale, Tempe, and Mesa — minimizing single-asset concentration risk.' },
      { icon: DollarSign, title: '8.2% Current Cash Yield', body: 'Investors receive quarterly distributions at an annualized 8.2% cash-on-cash yield from day one, backed by existing in-place leases with WALT of 11 months.' },
      { icon: Users, title: 'Proven Sponsor with $2.1B AUM', body: 'Phoenix Capital has deployed $2.1B across 42 multifamily transactions since 2008, with zero LP capital losses and an average realized IRR of 16.4% across fully exited funds.' },
    ],
    thesis: 'The Phoenix MSA presents a compelling risk-adjusted entry point for institutional multifamily exposure. With Class A cap rates compressing to 4.0–4.5%, the fund targets Class B assets where value creation through light renovation and operational improvement delivers a 150–200bps premium over replacement cost. The 5-year hold allows full execution of the value-add business plan with an exit targeting a 4.8% cap rate in a normalized market environment.',
    sponsor_bio: 'Phoenix Capital Partners was founded in 2008 by industry veterans from CBRE and Greystar. The team manages over $2.1B in AUM across 42 multifamily communities in Arizona and Nevada. Their vertically integrated platform — including in-house property management and construction — enables superior execution and cost control compared to third-party managed peers.',
    risks: ['Rental market softening due to new supply completions in 2025–2026', 'Interest rate risk on variable-rate debt', 'Execution risk on renovation timelines and contractor availability'],
  },
  d2: {
    youtube_id: 'hR3Bgj3aIGo',
    tagline: 'Last-mile logistics infrastructure in the heart of the Dallas–Fort Worth distribution network.',
    summary: 'Rusty Bear Industrial targets a portfolio of modern, last-mile logistics facilities in the Dallas–Fort Worth metroplex — the #1 industrial market in the United States by net absorption. The fund focuses on assets leased to investment-grade tenants under long-term NNN leases, providing stable, bond-like cash flows with embedded rent escalators of 3% per year.',
    highlights: [
      { icon: Building2, title: 'NNN Leases to Investment-Grade Tenants', body: 'Assets are triple-net leased to FedEx, Amazon, and Home Depot with a weighted average lease term (WALT) of 7.2 years, providing predictable, management-free income.' },
      { icon: TrendingUp, title: 'E-commerce Structural Tailwind', body: 'E-commerce penetration continues to expand, requiring 3x more warehouse space per unit of sales than traditional retail. Vacancy in the DFW infill submarket is at a historic low of 2.1%.' },
      { icon: DollarSign, title: '3% Annual Rent Escalators', body: 'All leases include contractual annual rent bumps of 3%, providing organic NOI growth and inflation protection throughout the investment period.' },
      { icon: Target, title: 'Strategic Infill Locations', body: 'All assets are located within 30 minutes of the DFW airport and major interstate interchanges, commanding a premium from logistics tenants competing for last-mile access.' },
    ],
    thesis: 'Industrial real estate fundamentals remain exceptional, with national vacancy at sub-3% and asking rents 40% above pre-COVID levels. The DFW market benefits from a zero state income tax environment, pro-business regulatory framework, and a $35B logistics ecosystem. The fund targets a 4-year hold with exit to an institutional buyer at a stabilized 5.2% cap rate.',
    sponsor_bio: 'Rusty Bear Partners is a Dallas-based industrial real estate operator with over 15 years of market expertise and a portfolio of 8.4M square feet across Texas, Oklahoma, and Arkansas. The firm has completed over $1.4B in transactions with an average IRR of 18.2% on fully realized investments.',
    risks: ['Tenant credit deterioration or non-renewal at lease expiration', 'Supply chain normalization reducing e-commerce demand', 'Rising construction costs for capital improvement reserves'],
  },
  d3: {
    youtube_id: 'meiLHqBNpSw',
    tagline: 'Senior secured private credit delivering double-digit current income with real estate collateral.',
    summary: 'Cornerstone Debt Fund originates and acquires senior secured bridge loans and mezzanine debt on commercial real estate projects across the Southeast United States. The fund targets a 10% annualized current yield through monthly cash distributions, backed by first-lien or second-lien real estate collateral with an average LTV of 68%. The conservative underwriting approach — focusing on basis, sponsor quality, and market liquidity — has produced zero principal losses since inception.',
    highlights: [
      { icon: DollarSign, title: '10% Monthly Cash Distribution', body: 'Investors receive monthly distributions at an annualized 10.0% yield — paid from current interest income on a portfolio of 14 active loans with a weighted average coupon of 11.2%.' },
      { icon: ShieldCheck, title: 'First-Lien Security on All Loans', body: 'The fund holds first-lien or controlling second-lien positions on all loans, with an average LTV of 68% providing a 32% equity cushion before any LP capital is at risk.' },
      { icon: BarChart2, title: 'Diversified 14-Loan Portfolio', body: 'Active portfolio spans multifamily, industrial, mixed-use, and retail asset classes across Atlanta, Charlotte, Nashville, and Raleigh — the four highest-growth Southeast markets.' },
      { icon: Clock, title: 'Short 3-Year Duration', body: 'Portfolio loans average 18–24 month terms, allowing rapid repricing as interest rates evolve and maintaining liquidity relative to longer-dated equity investments.' },
    ],
    thesis: 'The pullback of regional banks from commercial real estate lending has created an exceptional vintage for private credit funds. With spreads at 400–550bps over SOFR and conservative LTVs, the fund can deliver equity-like yields with debt-like risk. The 3-year fund term is designed to capture peak lending spreads before bank competition returns.',
    sponsor_bio: 'Cornerstone Capital Advisors has been a leading private credit manager since 2010, deploying over $3.8B across 210 loans with a zero realized loss record. The team of 18 investment professionals has deep origination networks across the Southeast and a proprietary underwriting platform that identifies best-risk-adjusted credits.',
    risks: ['Borrower default risk in a prolonged economic downturn', 'Collateral value decline reducing recovery on defaults', 'Interest rate compression reducing new loan yields at reinvestment'],
  },
  d4: {
    youtube_id: '8JO3o8AX8wI',
    tagline: 'Ground-up mixed-use development in the most supply-constrained urban core in America.',
    summary: 'Urban Core Development is a $40M ground-up development of a 220-unit mixed-use project at the intersection of East 6th Street and Congress Avenue in downtown Austin. The project includes 18,000 sq ft of retail anchored by a flagship restaurant group and a 220-key boutique hotel component, creating a vibrant live-work-play destination in the heart of the fastest-growing urban core in the United States.',
    highlights: [
      { icon: MapPin, title: 'Prime Downtown Austin Location', body: 'Located at the intersection of Austin\'s two most trafficked pedestrian corridors, the site commands a Walk Score of 98 and zero comparable new supply within a 0.5-mile radius.' },
      { icon: TrendingUp, title: '16% Projected IRR', body: 'The development\'s projected 16% IRR is driven by a 15% cost-to-value spread at stabilization, reflecting Austin\'s severe housing supply shortage and continued population growth.' },
      { icon: Building2, title: 'Vertical Integration Across Uses', body: 'The mixed-use program — residential, retail, and hotel — diversifies revenue streams and creates natural cross-marketing synergies, increasing stabilized NOI relative to single-use comparable projects.' },
      { icon: Target, title: 'Fully Entitled & Ready to Permit', body: 'The project holds a granted PUD zoning entitlement and is 90% through the building permit process, eliminating the primary development risk and enabling a construction start within 60 days.' },
    ],
    thesis: 'Austin\'s downtown core has experienced a 340% increase in residential demand over the past decade while supply has failed to keep pace due to height restrictions and site scarcity. Urban Core Development captures this imbalance by developing on one of the last remaining surface parking sites within the urban core. The 4-year business plan targets a 15.0x equity multiple on the development profit.',
    sponsor_bio: 'Urban Core LLC is a boutique Austin-based developer founded in 2014 by alumni of Hines and Lincoln Property Company. The firm specializes in complex mixed-use infill development, having delivered 4 projects totaling 680 units across downtown Austin and South Congress with an average project IRR of 19.4%.',
    risks: ['Construction cost overruns in a high-inflation environment', 'Lease-up risk on retail and hotel components', 'Permitting delays and city approval timeline uncertainty'],
  },
  d5: {
    youtube_id: 'ZZ5LpwO-An4',
    tagline: 'High-conviction value-add multifamily play in Miami\'s undersupplied workforce housing market.',
    summary: 'Sunrise Value Add targets a portfolio of 3 workforce housing communities (680 units) across Miami-Dade and Broward counties. The strategy focuses on 1990s-vintage Class B assets with significant renovation upside: kitchen and bathroom upgrades, common area enhancements, and technology packages that command $150–$250/unit rent premiums in a market where median rent growth exceeded 22% in 2023.',
    highlights: [
      { icon: TrendingUp, title: '22% Market Rent Growth in 2023', body: 'Miami ranked #1 nationally for rent growth in 2023, driven by financial services and technology industry migration from New York and Los Angeles. Supply pipeline remains constrained by permitting and labor costs.' },
      { icon: DollarSign, title: '$150–$250 Rent Premium Post-Renovation', body: 'Comparable renovated units in target submarkets lease at $150–$250 above unrenovated peers, driving a targeted 8.5% stabilized yield on cost — a 150bps premium over acquisition cap rate.' },
      { icon: Building2, title: '680 Units Across 3 Stabilized Communities', body: 'Portfolio diversification across Miami-Dade and Broward reduces submarket concentration and provides an efficient property management platform with shared staffing and maintenance.' },
      { icon: Clock, title: '18-Month Renovation Timeline', body: 'Unit-by-unit renovation program executes on natural turnover — eliminating relocation costs — and is projected to complete within 18 months of acquisition.' },
    ],
    thesis: 'Miami\'s structural housing deficit — a product of geography, land scarcity, and NIMBYism — creates a durable rent growth environment for workforce housing operators. The Sunrise Value Add Fund enters at a 5.2% acquisition cap rate with a targeted 6.7% exit cap rate on a fully renovated, institutionally managed portfolio — delivering the IRR premium through operational improvement rather than market appreciation dependency.',
    sponsor_bio: 'Sunrise Partners is a Miami-based real estate operator with 22 years of South Florida market experience and 7,400 units under management. The firm\'s in-house renovation team — 180 craftspeople and project managers — enables faster renovation cycles and 20–25% cost savings relative to third-party general contractors.',
    risks: ['Climate risk and insurance cost escalation in South Florida', 'Condo conversion speculation reducing workforce housing supply', 'Renovation cost overruns and supply chain delays'],
  },
  d6: {
    youtube_id: 'qNf9nzvnd1k',
    tagline: 'Institutional workforce housing delivering stable, government-subsidized income in Denver\'s high-barrier market.',
    summary: 'Metro Workforce Housing acquires and operates income-restricted multifamily communities serving households earning 60–80% of Area Median Income (AMI) in the Denver metropolitan area. The fund benefits from a combination of Below Market Rate (BMR) deed restrictions providing supply-side protection and strong demographic demand from essential workers, educators, and healthcare professionals priced out of market-rate housing.',
    highlights: [
      { icon: ShieldCheck, title: 'Government-Backed Demand Stability', body: 'Workforce housing communities benefit from formal partnerships with the City of Denver and Douglas County, providing tenant referral pipelines and ensuring consistently high occupancy rates of 96–98%.' },
      { icon: DollarSign, title: 'Zero New Supply Competition', body: 'BMR deed restrictions on target assets eliminate speculative new supply, creating a permanently protected market position that insulates against the rent softening risk facing market-rate operators.' },
      { icon: TrendingUp, title: 'Denver\'s Chronic Affordability Crisis', body: 'Denver\'s median home price of $590K and median market-rate apartment rent of $2,100 create a structural affordability gap affecting 38% of the metro\'s workforce — a pool of 280,000+ eligible renters.' },
      { icon: Target, title: 'CRA-Compliant Investment Vehicle', body: 'The fund structure qualifies as a Community Reinvestment Act (CRA) investment for participating financial institution LPs, creating access to a unique investor base and potential cost of capital advantage.' },
    ],
    thesis: 'Workforce housing is one of the most defensible niches in commercial real estate: regulated supply, government-supported demand, and mission-driven ownership create a durable business model largely immune to broader economic cycles. The 6-year fund term captures the full cash yield benefit of the portfolio while allowing market appreciation on an anticipated sale to a mission-aligned institutional buyer.',
    sponsor_bio: 'Metro Housing Advisors is a Denver-based affordable housing specialist with 14 years of experience and 4,200 units under management across Colorado and Utah. The firm has developed strong relationships with the Colorado Housing and Finance Authority (CHFA) and multiple municipal housing agencies, providing a proprietary deal sourcing advantage.',
    risks: ['Policy risk from changes in AMI limits or BMR regulations', 'Operating cost increases from minimum wage legislation', 'Extended hold period reducing liquidity relative to market-rate alternatives'],
  },
};

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString()}`;

const Stat: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent = T.text }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: T.textDim }}>{label}</p>
    <p className="text-sm font-black" style={{ color: accent }}>{value}</p>
  </div>
);

const DocRow: React.FC<{ icon: React.ElementType; title: string; sub: string }> = ({ icon: Icon, title, sub }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-sm cursor-pointer transition-colors"
    style={{ background: T.raised, border: `1px solid ${T.border}` }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
  >
    <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ background: T.goldFaint }}>
      <Icon size={14} style={{ color: T.gold }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold truncate" style={{ color: T.text }}>{title}</p>
      <p className="text-[10px]" style={{ color: T.textDim }}>{sub}</p>
    </div>
    <Download size={12} style={{ color: T.textDim }} />
  </div>
);

// ── Pitch deck slides ──────────────────────────────────────────────────────
const SLIDE_COLORS = [T.gold, T.jade, '#60a5fa', '#a78bfa'];

interface Props {
  deal: Deal;
  onClose: () => void;
  onInvest: (deal: Deal) => void;
  isAccredited?: boolean;
}

export const DealDetailModal: React.FC<Props> = ({ deal, onClose, onInvest, isAccredited = false }) => {
  const locked = deal.accredited_required && !isAccredited;
  const content = DEAL_CONTENT[deal.id] ?? DEAL_CONTENT['d1'];
  const [tab, setTab] = useState<'overview' | 'deck' | 'docs'>('overview');

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const youtubeEmbed = `https://www.youtube.com/embed/${content.youtube_id}?rel=0&modestbranding=1`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-sm overflow-hidden"
        style={{ background: T.bg, border: `1px solid ${T.border}` }}
      >
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-1.5 shrink-0">
              <Badge variant="gold">{deal.asset_class}</Badge>
              {deal.committee_approved && <Badge variant="jade">Approved</Badge>}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black uppercase tracking-wide truncate" style={{ color: T.text }}>{deal.title}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={10} style={{ color: T.gold }} />
                <span className="text-[10px]" style={{ color: T.textDim }}>{deal.location} · {deal.sponsor}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 transition-colors"
            style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.textDim }}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.textDim; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-0 px-6 shrink-0" style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
          {(['overview', 'deck', 'docs'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all"
              style={{
                color: tab === t ? T.gold : T.textDim,
                borderBottom: tab === t ? `2px solid ${T.gold}` : '2px solid transparent',
              }}
            >
              {t === 'overview' ? 'Overview' : t === 'deck' ? 'Pitch Deck' : 'Documents'}
            </button>
          ))}
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row h-full">

            {/* ── Left content ─────────────────────────────────────── */}
            <div className="flex-1 min-w-0 p-6 space-y-8">

              {tab === 'overview' && (
                <>
                  {/* Hero image + tagline */}
                  <div className="relative h-52 rounded-sm overflow-hidden">
                    <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.bg} 0%, transparent 50%)` }} />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-base font-black leading-snug" style={{ color: T.text }}>{content.tagline}</p>
                    </div>
                  </div>

                  {/* Video */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <PlayCircle size={14} style={{ color: T.gold }} />
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>Introductory Video</p>
                    </div>
                    <div className="relative rounded-sm overflow-hidden" style={{ paddingBottom: '56.25%', background: T.raised }}>
                      <iframe
                        src={youtubeEmbed}
                        title={`${deal.title} intro`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.textDim }}>Executive Summary</p>
                    <p className="text-sm leading-relaxed" style={{ color: T.textSub ?? T.text }}>{content.summary}</p>
                  </div>

                  {/* Investment Thesis */}
                  <div className="p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.gold }}>Investment Thesis</p>
                    <p className="text-sm leading-relaxed" style={{ color: T.textSub ?? T.text }}>{content.thesis}</p>
                  </div>

                  {/* Sponsor Profile */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.textDim }}>Sponsor Profile</p>
                    <div className="flex items-start gap-4 p-4 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 text-xs font-black" style={{ background: T.goldFaint, color: T.gold }}>
                        {deal.sponsor.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-black mb-1" style={{ color: T.text }}>{deal.sponsor}</p>
                        <p className="text-xs leading-relaxed" style={{ color: T.textDim }}>{content.sponsor_bio}</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={12} style={{ color: '#f97316' }} />
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>Key Risk Factors</p>
                    </div>
                    <div className="space-y-2">
                      {content.risks.map((r, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color: T.textDim }}>
                          <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full" style={{ background: '#f97316', marginTop: 5 }} />
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tab === 'deck' && (
                <>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: T.textDim }}>Investment Highlights</p>
                    <p className="text-xs mb-6" style={{ color: T.textDim }}>Key pillars of the investment case</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.highlights.map((h, i) => (
                        <div key={i} className="p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ background: `${SLIDE_COLORS[i % 4]}15`, border: `1px solid ${SLIDE_COLORS[i % 4]}30` }}>
                              <h.icon size={15} style={{ color: SLIDE_COLORS[i % 4] }} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: SLIDE_COLORS[i % 4] }}>0{i + 1}</span>
                          </div>
                          <p className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: T.text }}>{h.title}</p>
                          <p className="text-xs leading-relaxed" style={{ color: T.textDim }}>{h.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Summary table */}
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.textDim }}>Financial Summary</p>
                    <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                      {[
                        ['Projected IRR',        `${deal.projected_irr}%`,                    T.gold],
                        ['Cash-on-Cash Yield',   `${deal.cash_yield}%`,                       T.jade],
                        ['Preferred Return',     deal.preferred_return ? `${deal.preferred_return}%` : 'N/A', T.text],
                        ['Target Raise',         fmt(deal.target_raise),                      T.text],
                        ['Capital Raised',       `${fmt(deal.capital_raised)} (${deal.progress}%)`, T.text],
                        ['Minimum Investment',   fmt(deal.minimum_investment),                T.text],
                        ['Hold Period',          `${deal.term_years} years`,                  T.text],
                        ['Lockup',               `${deal.lockup_months} months`,              T.text],
                        ['Structure',            deal.structure,                              T.text],
                        ['Strategy',             deal.strategy,                               T.text],
                      ].map(([label, value, color], i) => (
                        <div key={label} className="grid grid-cols-2 px-4 py-2.5 text-xs" style={{ borderTop: i > 0 ? `1px solid ${T.border}` : 'none', background: i % 2 === 0 ? 'transparent' : T.raised }}>
                          <span style={{ color: T.textDim }}>{label}</span>
                          <span className="font-bold" style={{ color: color as string }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {tab === 'docs' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: T.textDim }}>Legal Documents</p>
                    <p className="text-xs mb-4" style={{ color: T.textDim }}>Available to accredited investors. Click to request access or download.</p>
                    <div className="space-y-2">
                      <DocRow icon={FileText} title="Subscription Agreement" sub="Execution copy · PDF · 1.2 MB" />
                      <DocRow icon={FileText} title="Private Placement Memorandum" sub="Full PPM · PDF · 4.8 MB" />
                      <DocRow icon={FileText} title="Operating Agreement" sub="LP Agreement · PDF · 2.1 MB" />
                      <DocRow icon={FileText} title="Investor Presentation" sub="Pitch Deck · PDF · 8.4 MB" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: T.textDim }}>Tax Documents</p>
                    <div className="space-y-2">
                      <DocRow icon={FileText} title="Schedule K-1 (2024)" sub="Tax filing document · PDF · 340 KB" />
                      <DocRow icon={FileText} title="Cost Segregation Report" sub="Depreciation analysis · PDF · 1.8 MB" />
                    </div>
                  </div>
                  <div className="p-4 rounded-sm flex items-start gap-3" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                    <ShieldCheck size={14} style={{ color: T.gold, marginTop: 2 }} />
                    <p className="text-xs leading-relaxed" style={{ color: T.gold }}>All documents are for informational purposes only and do not constitute an offer to sell or a solicitation of an offer to buy securities. Consult your legal and tax advisors.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right sidebar ─────────────────────────────────────── */}
            <div className="lg:w-72 shrink-0 flex flex-col p-6 space-y-6" style={{ borderLeft: `1px solid ${T.border}`, background: T.surface }}>

              {/* Key metrics */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: T.textDim }}>Key Metrics</p>
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Proj. IRR"      value={`${deal.projected_irr}%`}   accent={T.gold} />
                  <Stat label="Cash Yield"     value={`${deal.cash_yield}%`}      accent={T.jade} />
                  <Stat label="Min. Invest"    value={fmt(deal.minimum_investment)} />
                  <Stat label="Hold Period"    value={`${deal.term_years} yrs`} />
                  <Stat label="Lockup"         value={`${deal.lockup_months} mo`} />
                  <Stat label="Structure"      value={deal.structure.split(' ')[0]} />
                  {deal.preferred_return && <Stat label="Pref. Return" value={`${deal.preferred_return}%`} accent={T.jade} />}
                </div>
              </div>

              {/* Funding progress */}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: T.textDim }}>Raise Progress</p>
                  <span className="text-xs font-black" style={{ color: T.gold }}>{deal.progress}%</span>
                </div>
                <ProgressBar value={deal.progress} color={T.gold} />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px]" style={{ color: T.textDim }}>{fmt(deal.capital_raised)} raised</span>
                  <span className="text-[9px]" style={{ color: T.textDim }}>of {fmt(deal.target_raise)}</span>
                </div>
              </div>

              {/* Tags */}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
                <div className="flex flex-wrap gap-1.5">
                  {deal.tags.map((tag) => (
                    <span key={tag} className="text-[8px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest" style={{ background: T.raised, color: T.textDim, border: `1px solid ${T.border}` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accreditation badge */}
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-sm"
                style={{
                  background: deal.accredited_required ? `${T.gold}10` : `${T.jade}10`,
                  border: `1px solid ${deal.accredited_required ? T.gold : T.jade}30`,
                }}
              >
                {deal.accredited_required
                  ? <><Lock size={13} style={{ color: T.gold }} /><span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.gold }}>Accredited Investors Only</span></>
                  : <><ShieldCheck size={13} style={{ color: T.jade }} /><span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.jade }}>Open to All Investors</span></>
                }
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* CTA */}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
                {locked ? (
                  <>
                    <div
                      className="w-full py-3.5 rounded-sm flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
                      style={{ background: T.raised, color: T.textDim, border: `1px solid ${T.border}` }}
                    >
                      <Lock size={14} /> Accreditation Required
                    </div>
                    <p className="text-[9px] text-center mt-2" style={{ color: T.textDim }}>
                      This deal is restricted to accredited investors only (Reg D 506(c))
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { onInvest(deal); onClose(); }}
                      className="w-full py-3.5 rounded-sm flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all"
                      style={{ background: T.gold, color: '#000' }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    >
                      <Landmark size={14} /> Invest Now
                    </button>
                    <p className="text-[9px] text-center mt-2" style={{ color: T.textDim }}>
                      Min. {fmt(deal.minimum_investment)} · {deal.accredited_required ? 'Accredited investors only' : 'Open to all investors'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
