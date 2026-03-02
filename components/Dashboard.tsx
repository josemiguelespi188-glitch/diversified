import React, { useState, useMemo, useEffect } from 'react';
import { Card, Badge, Button, SectionHeading, ProgressBar, T, Table, TableRow, TableCell, EmptyState } from './UIElements';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Layers, Clock, BarChart2, Download, ArrowRight } from 'lucide-react';
import { Deal, InvestmentRequest, RequestStatus } from '../types';
import { MOCK_ACCOUNTS, MOCK_DEALS, MOCK_REQUESTS } from '../constants';

const STRATEGY_COLORS: Record<string, string> = {
  Multifamily:   T.gold,
  Industrial:    T.jade,
  'Private Debt': T.sky,
  Development:   '#A78BFA',
  Other:         T.textSub,
};

interface DashboardProps {
  onAllocate: (deal: Deal) => void;
  onViewPortfolio: () => void;
  requests?: InvestmentRequest[];
}

const statusStyle = (status: string): { color: string; bg: string } => {
  if (status === RequestStatus.FUNDED)        return { color: T.jade,    bg: T.jadeFaint };
  if (status === RequestStatus.UNDER_REVIEW)  return { color: T.gold,    bg: T.goldFaint };
  if (status === RequestStatus.PENDING_FUNDING) return { color: T.sky,   bg: T.skyFaint };
  return { color: T.textSub, bg: T.raised };
};

const fmt = (n: number) => `$${n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + 'M' : n.toLocaleString()}`;

// ── Continuous marquee carousel ────────────────────────────────────────────
const CARD_W = 300; // px
const GAP    = 16;  // px
// Duplicate deals for seamless loop
const MARQUEE_DEALS = [...MOCK_DEALS, ...MOCK_DEALS];

const DealsCarousel: React.FC<{ onAllocate: (deal: Deal) => void; onViewAll: () => void }> = ({ onAllocate, onViewAll }) => {
  const trackW = MOCK_DEALS.length * (CARD_W + GAP);

  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${trackW}px); }
        }
        .marquee-track {
          animation: marquee ${MOCK_DEALS.length * 5}s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-0.5" style={{ color: T.gold }}>Live Deal Flow</p>
            <h2 className="text-base font-black uppercase tracking-tight" style={{ color: T.text }}>Active Opportunities</h2>
          </div>
          <button
            onClick={onViewAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
            style={{ background: T.goldFaint, color: T.gold, border: `1px solid ${T.gold}40` }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = T.goldFaint; e.currentTarget.style.color = T.gold; }}
          >
            More Options <ArrowRight size={11} />
          </button>
        </div>

        {/* Scrolling track */}
        <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
          <div className="marquee-track flex" style={{ gap: GAP, width: trackW * 2 }}>
            {MARQUEE_DEALS.map((deal, i) => (
              <div
                key={`${deal.id}-${i}`}
                className="rounded-sm overflow-hidden group shrink-0"
                style={{ width: CARD_W, background: T.surface, border: `1px solid ${T.border}`, transition: 'border-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}50`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
              >
                <div className="relative overflow-hidden" style={{ height: 140 }}>
                  <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.surface} 0%, transparent 60%)` }} />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant="gold">{deal.asset_class}</Badge>
                    {deal.committee_approved && <Badge variant="jade">Approved</Badge>}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xl font-black" style={{ color: T.gold }}>{deal.projected_irr}%</span>
                    <span className="text-[9px] ml-1 font-bold uppercase" style={{ color: T.textDim }}>IRR</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide leading-tight truncate" style={{ color: T.text }}>{deal.title}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: T.textDim }}>{deal.location} · Min. ${(deal.minimum_investment / 1000).toFixed(0)}K</p>
                  </div>
                  <ProgressBar value={deal.progress} />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-widest" style={{ color: T.textDim }}>{deal.progress}% Funded</span>
                    <button
                      onClick={() => onAllocate(deal)}
                      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm transition-all"
                      style={{ background: T.goldFaint, color: T.gold, border: `1px solid ${T.gold}30` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = '#000'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = T.goldFaint; e.currentTarget.style.color = T.gold; }}
                    >
                      Invest Now <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onAllocate, onViewPortfolio, requests: incoming }) => {
  const [filter, setFilter] = useState<string>('all');
  const [ledger, setLedger] = useState<InvestmentRequest[]>([]);

  useEffect(() => {
    setLedger(incoming && incoming.length > 0 ? incoming : MOCK_REQUESTS);
  }, [incoming]);

  const filtered = useMemo(
    () => (filter === 'all' ? ledger : ledger.filter((r) => r.account_id === filter)),
    [ledger, filter],
  );

  const metrics = useMemo(() => {
    const funded  = filtered.filter((r) => r.status === RequestStatus.FUNDED);
    const waiting = filtered.filter((r) => r.status === RequestStatus.UNDER_REVIEW);

    const totalCommitted  = funded.reduce((s, r) => s + r.amount, 0);
    const pendingAmount   = waiting.reduce((s, r) => s + r.amount, 0);
    const dealCount       = new Set(funded.map((r) => r.deal_id)).size;

    let weightedIrr = 0;
    if (totalCommitted > 0) {
      weightedIrr = funded.reduce((s, r) => s + r.amount * (r.projected_irr || 0), 0) / totalCommitted;
    }

    const stratMap: Record<string, { name: string; capital: number; color: string }> = {};
    funded.forEach((r) => {
      const s = r.strategy || 'Other';
      if (!stratMap[s]) stratMap[s] = { name: s, capital: 0, color: STRATEGY_COLORS[s] || STRATEGY_COLORS.Other };
      stratMap[s].capital += r.amount;
    });
    const stratData = Object.values(stratMap).map((s) => ({
      ...s,
      pct: totalCommitted > 0 ? (s.capital / totalCommitted) * 100 : 0,
    }));

    return { totalCommitted, pendingAmount, dealCount, weightedIrr, stratData };
  }, [filtered]);

  const handleStatusChange = (id: string, status: string) => {
    setLedger((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const kpis = [
    { label: 'Total Committed',    value: fmt(metrics.totalCommitted), sub: 'Settled Funds',       icon: TrendingUp, accent: 'gold'    as const },
    { label: 'Active Positions',   value: `${metrics.dealCount}`,       sub: 'Unique Deals',        icon: Layers,     accent: 'jade'    as const },
    { label: 'Pending Allocation', value: fmt(metrics.pendingAmount),   sub: 'Awaiting Committee',  icon: Clock,      accent: 'sky'     as const },
    { label: 'Avg. Weighted IRR',  value: metrics.totalCommitted > 0 ? `${metrics.weightedIrr.toFixed(1)}%` : '—', sub: 'Portfolio Wide', icon: BarChart2, accent: 'gold' as const },
  ];

  const accentMap = { gold: T.gold, jade: T.jade, sky: T.sky, ruby: T.ruby };

  return (
    <div className="space-y-8 pb-20">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>
            Command Center
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: T.text }}>
            Portfolio Overview
          </h1>
        </div>

        {/* Account filter */}
        <div
          className="flex items-center gap-1 p-1 rounded-sm"
          style={{ background: T.raised, border: `1px solid ${T.border}` }}
        >
          {[{ id: 'all', type: 'All' }, ...MOCK_ACCOUNTS].map((acc) => {
            const id = 'id' in acc ? acc.id : 'all';
            const label = 'type' in acc && id !== 'all' ? acc.type : 'All';
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all"
                style={{
                  background: active ? T.gold : 'transparent',
                  color: active ? '#000' : T.textDim,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Deals Carousel ─────────────────────────────────────────────── */}
      <DealsCarousel onAllocate={onAllocate} onViewAll={onViewPortfolio} />

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="space-y-3 group">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: T.textDim }}>
                {k.label}
              </p>
              <k.icon size={13} style={{ color: accentMap[k.accent] }} />
            </div>
            <p className="text-2xl font-black tracking-tight" style={{ color: accentMap[k.accent] }}>
              {k.value}
            </p>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: T.textDim }}>{k.sub}</p>
          </Card>
        ))}
      </div>

      {/* ── Charts + Ledger ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Strategy Chart */}
        <Card className="lg:col-span-1 space-y-5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: T.textSub }}>
            Strategy Allocation
          </p>
          {metrics.stratData.length === 0 ? (
            <EmptyState title="No allocations" subtitle="Complete an investment to see your strategy mix." />
          ) : (
            <>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={metrics.stratData} innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="pct" stroke="none">
                      {metrics.stratData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text, fontSize: 11, borderRadius: 4 }}
                      formatter={(val: number) => [`${val.toFixed(1)}%`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5">
                {metrics.stratData.sort((a, b) => b.capital - a.capital).map((s) => (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>{s.name}</span>
                      </div>
                      <span className="text-[10px] font-black" style={{ color: T.text }}>{s.pct.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={s.pct} color={s.color} />
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Allocation Ledger */}
        <Card noPad className="lg:col-span-2 overflow-hidden">
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${T.border}` }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: T.textSub }}>
              Allocation Ledger
            </p>
            <Badge variant="gold">Live Feed</Badge>
          </div>

          <Table headers={['Project', 'Amount', 'Status', '']}>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <EmptyState title="No records" subtitle="Your allocations will appear here once submitted." />
                </td>
              </tr>
            ) : (
              filtered
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((row) => {
                  const s = statusStyle(row.status);
                  const acct = MOCK_ACCOUNTS.find((a) => a.id === row.account_id);
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <p className="font-black text-xs uppercase tracking-wide" style={{ color: T.text }}>
                          {row.deal_name}
                        </p>
                        <p className="text-[9px] mt-0.5 uppercase tracking-widest" style={{ color: T.textDim }}>
                          {acct?.type} · {row.strategy}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-black text-xs" style={{ color: T.text }}>${row.amount.toLocaleString()}</p>
                        <p className="text-[9px] mt-0.5" style={{ color: T.textDim }}>
                          {new Date(row.created_at).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <select
                          value={row.status}
                          onChange={(e) => handleStatusChange(row.id, e.target.value)}
                          className="text-[10px] font-black uppercase tracking-widest rounded-sm px-2 py-1 outline-none cursor-pointer border-0 appearance-none"
                          style={{ background: s.bg, color: s.color }}
                        >
                          <option value={RequestStatus.PENDING_FUNDING}>{RequestStatus.PENDING_FUNDING}</option>
                          <option value={RequestStatus.UNDER_REVIEW}>{RequestStatus.UNDER_REVIEW}</option>
                          <option value={RequestStatus.FUNDED}>{RequestStatus.FUNDED}</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <button title="Download" style={{ color: T.textDim }} className="hover:text-amber-400 transition-colors">
                          <Download size={14} />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </Table>
        </Card>
      </div>

    </div>
  );
};
