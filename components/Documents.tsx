
import React, { useState, useMemo } from 'react';
import { Card, Badge } from './UIElements';
import { PlatformDocument } from '../types';
import { MOCK_DOCUMENTS } from '../constants';
import {
  Download,
  FileText,
  ShieldCheck,
  Receipt,
  Landmark,
  Gavel,
  Search,
  File
} from 'lucide-react';

type CategoryFilter = 'all' | 'subscription' | 'ppm' | 'distribution_notice' | 'tax' | 'legal';

const CATEGORY_META: Record<string, { label: string; icon: React.FC<any>; color: string }> = {
  subscription: { label: 'Subscription Agreements', icon: FileText, color: '#2F80ED' },
  ppm: { label: 'PPM / Offering Docs', icon: Landmark, color: '#56CCF2' },
  distribution_notice: { label: 'Distribution Notices', icon: Receipt, color: '#00E0C6' },
  tax: { label: 'Tax Documents', icon: ShieldCheck, color: '#F59E0B' },
  legal: { label: 'Legal & Compliance', icon: Gavel, color: '#8FAEDB' }
};

const formatKb = (kb: number) =>
  kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

export const Documents: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let docs = categoryFilter === 'all'
      ? MOCK_DOCUMENTS
      : MOCK_DOCUMENTS.filter(d => d.category === categoryFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      docs = docs.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.deal_name || '').toLowerCase().includes(q) ||
        d.file_name.toLowerCase().includes(q)
      );
    }
    return docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [categoryFilter, query]);

  // Group by category for the "all" view
  const grouped = useMemo(() => {
    const map: Record<string, PlatformDocument[]> = {};
    filtered.forEach(d => {
      if (!map[d.category]) map[d.category] = [];
      map[d.category].push(d);
    });
    return map;
  }, [filtered]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_DOCUMENTS.forEach(d => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filterTabs: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: `All (${MOCK_DOCUMENTS.length})` },
    ...Object.entries(CATEGORY_META).map(([k, v]) => ({
      key: k as CategoryFilter,
      label: `${v.label} (${categoryCounts[k] || 0})`
    }))
  ];

  const renderDocRow = (doc: PlatformDocument) => {
    const meta = CATEGORY_META[doc.category];
    const Icon = meta?.icon || File;
    return (
      <div
        key={doc.id}
        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all group"
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: (meta?.color || '#8FAEDB') + '15', border: `1px solid ${(meta?.color || '#8FAEDB')}30` }}
          >
            <Icon size={18} style={{ color: meta?.color || '#8FAEDB' }} />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white uppercase tracking-tight truncate">{doc.title}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {doc.deal_name && (
                <span className="text-[9px] text-[#2F80ED] font-bold uppercase tracking-widest">{doc.deal_name}</span>
              )}
              {doc.deal_name && <span className="text-[#8FAEDB]/30 text-[9px]">•</span>}
              <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest opacity-60">
                {new Date(doc.date).toLocaleDateString()}
              </span>
              <span className="text-[#8FAEDB]/30 text-[9px]">•</span>
              <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest opacity-40">
                {formatKb(doc.size_kb)}
              </span>
            </div>
          </div>
        </div>
        <button
          className="shrink-0 ml-4 p-2 rounded-lg border border-white/10 text-[#8FAEDB] hover:text-[#2F80ED] hover:border-[#2F80ED]/40 transition-all"
          title={`Download ${doc.file_name}`}
        >
          <Download size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Documents</h1>
          <p className="text-[#8FAEDB] text-sm uppercase tracking-widest font-medium opacity-60">
            Legal, tax & deal documentation vault
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 w-full lg:w-64">
          <Search size={14} className="text-[#8FAEDB] shrink-0" />
          <input
            type="text"
            placeholder="Search documents..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bg-transparent text-white text-sm w-full outline-none placeholder:text-[#8FAEDB]/40 placeholder:text-[11px]"
          />
        </div>
      </header>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setCategoryFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              categoryFilter === tab.key
                ? 'bg-[#2F80ED] text-white shadow-lg shadow-[#2F80ED]/20'
                : 'bg-white/5 text-[#8FAEDB] hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-20 border-white/5">
          <File size={40} className="mx-auto text-[#8FAEDB]/20 mb-4" />
          <p className="text-[10px] text-[#8FAEDB]/40 uppercase tracking-widest">No documents found</p>
        </Card>
      ) : categoryFilter === 'all' ? (
        // Grouped view
        <div className="space-y-8">
          {(Object.entries(grouped) as [string, PlatformDocument[]][]).map(([category, docs]) => {
            const meta = CATEGORY_META[category];
            const Icon = meta?.icon || File;
            return (
              <section key={category} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} style={{ color: meta?.color || '#8FAEDB' }} />
                  <h2
                    className="text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: meta?.color || '#8FAEDB' }}
                  >
                    {meta?.label || category}
                  </h2>
                  <span className="text-[9px] text-[#8FAEDB]/40 font-bold">({docs.length})</span>
                </div>
                <div className="space-y-2">
                  {docs.map(renderDocRow)}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // Flat view for single category
        <div className="space-y-2">
          {filtered.map(renderDocRow)}
        </div>
      )}
    </div>
  );
};
