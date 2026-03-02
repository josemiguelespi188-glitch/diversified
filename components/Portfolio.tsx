import React, { useState } from 'react';
import { MOCK_DEALS } from '../constants';
import { Badge, Button, ProgressBar, T } from './UIElements';
import { MapPin, ShieldCheck, SlidersHorizontal, ArrowRight, Lock } from 'lucide-react';
import { Deal } from '../types';
import { DealDetailModal } from './DealDetailModal';

const STRATEGIES = ['All', 'Multifamily', 'Industrial', 'Private Debt', 'Development'];

export const Portfolio: React.FC<{
  onAllocate: (deal: Deal) => void;
  hideHeader?: boolean;
  isAccredited?: boolean;
}> = ({ onAllocate, hideHeader = false, isAccredited = false }) => {
  const [filter, setFilter] = useState('All');
  const [detailDeal, setDetailDeal] = useState<Deal | null>(null);

  const deals = filter === 'All' ? MOCK_DEALS : MOCK_DEALS.filter((d) => d.strategy === filter);

  return (
    <div className="space-y-8 pb-20">
      {!hideHeader && (
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>
            Marketplace
          </p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: T.text }}>
              Portfolio Opportunities
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant={isAccredited ? 'jade' : 'neutral'}>
                {isAccredited ? 'Accredited Investor' : 'Not Accredited'}
              </Badge>
              <Badge variant="gold">Verified Sponsors</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={13} style={{ color: T.textDim }} />
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
          <DealCard key={deal.id} deal={deal} isAccredited={isAccredited} onDetail={setDetailDeal} />
        ))}
      </div>

      {/* Detail Modal */}
      {detailDeal && (
        <DealDetailModal
          deal={detailDeal}
          isAccredited={isAccredited}
          onClose={() => setDetailDeal(null)}
          onInvest={(d) => { onAllocate(d); setDetailDeal(null); }}
        />
      )}
    </div>
  );
};

const DealCard: React.FC<{ deal: Deal; isAccredited: boolean; onDetail: (d: Deal) => void }> = ({ deal, isAccredited, onDetail }) => {
  const locked = deal.accredited_required && !isAccredited;

  return (
    <div
      className="rounded-sm overflow-hidden flex flex-col transition-all duration-300 group"
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        cursor: locked ? 'default' : 'pointer',
        opacity: locked ? 0.75 : 1,
      }}
      onClick={() => !locked && onDetail(deal)}
      onMouseEnter={(e) => { if (!locked) e.currentTarget.style.borderColor = `${T.gold}40`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={deal.image_url}
          alt={deal.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
          style={{ filter: locked ? 'grayscale(60%)' : 'none' }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${T.surface} 0%, transparent 60%)` }} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="jade">Open</Badge>
          <Badge variant="neutral">{deal.asset_class}</Badge>
          {deal.accredited_required && (
            <span
              className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm"
              style={{ background: `${T.gold}20`, color: T.gold, border: `1px solid ${T.gold}40` }}
            >
              <Lock size={8} /> Accredited
            </span>
          )}
        </div>

        {/* Lock overlay */}
        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: `${T.bg}85` }}>
            <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
              <Lock size={18} style={{ color: T.textDim }} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-center px-6" style={{ color: T.textDim }}>
              Accredited investors only
            </p>
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

      {/* Content */}
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 py-4" style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          {[
            { label: 'Target IRR', value: `${deal.projected_irr}%`, accent: T.gold },
            { label: 'Cash Yield', value: `${deal.cash_yield}%`, accent: T.jade },
            { label: 'Min. Investment', value: `$${deal.minimum_investment.toLocaleString()}`, accent: T.text },
            { label: 'Term', value: `${deal.term_years} yrs`, accent: T.text },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>{stat.label}</p>
              <p className="text-sm font-black" style={{ color: stat.accent }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {deal.tags.map((tag) => (
            <span key={tag} className="text-[8px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest" style={{ background: T.raised, color: T.textDim, border: `1px solid ${T.border}` }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1" style={{ borderTop: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-1.5">
            {locked ? (
              <>
                <Lock size={12} style={{ color: T.textDim }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Accreditation Required</span>
              </>
            ) : (
              <>
                <ShieldCheck size={12} style={{ color: T.jade }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>
                  {deal.accredited_required ? 'Accredited' : 'Open'} · Verified
                </span>
              </>
            )}
          </div>
          {!locked && (
            <button
              onClick={(e) => { e.stopPropagation(); onDetail(deal); }}
              className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm transition-all"
              style={{ background: T.goldFaint, color: T.gold, border: `1px solid ${T.gold}30` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.goldFaint; e.currentTarget.style.color = T.gold; }}
            >
              View Deal <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
