
import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from './UIElements';
import { MapPin, ShieldCheck, Landmark } from 'lucide-react';
import { Deal } from '../types';
import { getDeals } from '../lib/db';

export const Portfolio: React.FC<{ onAllocate: (deal: Deal) => void, hideHeader?: boolean, isHorizontal?: boolean }> = ({ onAllocate, hideHeader = false, isHorizontal = false }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDeals()
      .then(setDeals)
      .finally(() => setLoading(false));
  }, []);

  const containerClass = isHorizontal
    ? "flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x"
    : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!hideHeader && (
        <header className="flex justify-between items-end px-4 md:px-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Portfolio Marketplace</h1>
            <p className="text-[#8FAEDB]">Institutional Grade Private Capital Opportunities</p>
          </div>
          <div className="hidden md:flex gap-2">
            <Badge variant="success">Committee Approved</Badge>
            <Badge variant="info">Verified Sponsors</Badge>
          </div>
        </header>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20 opacity-40">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Loading deal flow...</span>
        </div>
      )}

      <div className={containerClass}>
        {deals.map((deal) => (
          <Card key={deal.id} className={`overflow-hidden p-0 flex flex-col group border-white/5 hover:border-[#2F80ED]/30 transition-all duration-300 ${isHorizontal ? 'min-w-[340px] md:min-w-[400px] snap-center' : ''}`}>
            {/* Header Image */}
            <div className="h-48 relative overflow-hidden">
              <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="success">Open</Badge>
                <div className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold uppercase tracking-wider border border-white/10">
                  {deal.asset_class}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#081C3A] to-transparent"></div>
              
              {/* Progress Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Funding Progress</span>
                  <span className="text-xs font-bold text-[#00E0C6]">{deal.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-[#00E0C6] h-full transition-all duration-1000 ease-out cyan-glow" 
                    style={{ width: `${deal.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="text-lg font-bold text-white leading-tight group-hover:text-[#2F80ED] transition-colors">{deal.title}</h3>
                </div>
                <div className="flex items-center gap-1 text-[#8FAEDB] text-[10px] uppercase tracking-widest font-bold mb-4">
                  <MapPin size={10} className="text-[#2F80ED]" />
                  {deal.location} • <span className="text-white/60">{deal.sponsor}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 py-4 border-y border-white/5">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase text-[#8FAEDB] tracking-[0.15em] font-bold">Target IRR</div>
                    <div className="text-lg text-[#2F80ED] font-bold tracking-tight">{deal.projected_irr}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase text-[#8FAEDB] tracking-[0.15em] font-bold">Cash Yield</div>
                    <div className="text-lg text-[#00E0C6] font-bold tracking-tight">{deal.cash_yield}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase text-[#8FAEDB] tracking-[0.15em] font-bold">Min Investment</div>
                    <div className="text-sm text-white font-bold">${deal.minimum_investment.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase text-[#8FAEDB] tracking-[0.15em] font-bold">Term</div>
                    <div className="text-sm text-white font-bold">{deal.term_years} Years</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {deal.tags.map((tag, idx) => (
                    <span key={idx} className="text-[8px] px-2 py-0.5 rounded bg-white/5 text-[#8FAEDB] border border-white/5 uppercase tracking-widest font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#00E0C6]" />
                  <span className="text-[9px] text-[#8FAEDB] uppercase font-bold tracking-tighter">Verified Asset</span>
                </div>
                <Button onClick={() => onAllocate(deal)} className="text-[10px] px-4 py-2 flex items-center gap-2">
                  <Landmark size={12} />
                  Invest Now
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
