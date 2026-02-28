import React, { useState, useMemo } from 'react';
import { Card, Badge, T } from './UIElements';
import { PlatformDocument } from '../types';
import { MOCK_DOCUMENTS } from '../constants';
import { Download, FileText, ShieldCheck, Receipt, Landmark, Gavel, Search, File } from 'lucide-react';

type CategoryFilter = 'all' | 'subscription' | 'ppm' | 'distribution_notice' | 'tax' | 'legal';

const CATEGORY_META: Record<string, { label: string; icon: React.FC<{ size?: number }>; color: string }> = {
  subscription:       { label: 'Subscription Agreements', icon: FileText,   color: T.gold },
  ppm:                { label: 'Offering Docs / PPM',     icon: Landmark,   color: T.sky },
  distribution_notice:{ label: 'Distribution Notices',   icon: Receipt,    color: T.jade },
  tax:                { label: 'Tax Documents',           icon: ShieldCheck, color: '#A78BFA' },
  legal:              { label: 'Legal & Compliance',      icon: Gavel,      color: T.textSub },
};

const fmtKb = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

export const Documents: React.FC = () => {
  const [cat, setCat] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let docs = cat === 'all' ? MOCK_DOCUMENTS : MOCK_DOCUMENTS.filter((d) => d.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      docs = docs.filter((d) =>
        d.title.toLowerCase().includes(q) ||
        (d.deal_name || '').toLowerCase().includes(q) ||
        d.file_name.toLowerCase().includes(q),
      );
    }
    return docs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [cat, query]);

  const grouped = useMemo(() => {
    const map: Record<string, PlatformDocument[]> = {};
    filtered.forEach((d) => { if (!map[d.category]) map[d.category] = []; map[d.category].push(d); });
    return map;
  }, [filtered]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    MOCK_DOCUMENTS.forEach((d) => { c[d.category] = (c[d.category] || 0) + 1; });
    return c;
  }, []);

  const tabs: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: `All (${MOCK_DOCUMENTS.length})` },
    ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k as CategoryFilter, label: `${v.label} (${counts[k] || 0})` })),
  ];

  const renderDoc = (doc: PlatformDocument) => {
    const meta = CATEGORY_META[doc.category];
    const Icon = meta?.icon || File;
    return (
      <div
        key={doc.id}
        className="flex items-center justify-between p-4 rounded-sm transition-all group"
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}30`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; }}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{ background: `${meta?.color || T.textSub}15`, border: `1px solid ${meta?.color || T.textSub}30` }}
          >
            <Icon size={15} style={{ color: meta?.color || T.textSub }} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black uppercase tracking-wide truncate" style={{ color: T.text }}>{doc.title}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {doc.deal_name && <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.gold }}>{doc.deal_name}</span>}
              {doc.deal_name && <span style={{ color: T.textDim }}>·</span>}
              <span className="text-[9px]" style={{ color: T.textDim }}>{new Date(doc.date).toLocaleDateString()}</span>
              <span style={{ color: T.textDim }}>·</span>
              <span className="text-[9px]" style={{ color: T.textDim }}>{fmtKb(doc.size_kb)}</span>
            </div>
          </div>
        </div>
        <button
          className="flex-shrink-0 ml-4 w-8 h-8 rounded-sm flex items-center justify-center transition-all"
          style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.textDim }}
          title={`Download ${doc.file_name}`}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}60`; e.currentTarget.style.color = T.gold; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textDim; }}
        >
          <Download size={13} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>Vault</p>
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: T.text }}>Documents</h1>
        </div>
        {/* Search */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-sm w-full md:w-64"
          style={{ background: T.raised, border: `1px solid ${T.border}` }}
        >
          <Search size={13} style={{ color: T.textDim, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search documents…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm w-full outline-none"
            style={{ color: T.text }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const active = cat === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setCat(tab.key)}
              className="px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all"
              style={{
                background: active ? T.gold : T.raised,
                color: active ? '#000' : T.textDim,
                border: `1px solid ${active ? T.gold : T.border}`,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center rounded-sm"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          <File size={28} style={{ color: T.textDim, marginBottom: 12 }} />
          <p className="text-[10px] uppercase tracking-widest" style={{ color: T.textDim }}>No documents found</p>
        </div>
      ) : cat === 'all' ? (
        <div className="space-y-8">
          {(Object.entries(grouped) as [string, PlatformDocument[]][]).map(([category, docs]) => {
            const meta = CATEGORY_META[category];
            const Icon = meta?.icon || File;
            return (
              <section key={category} className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={12} style={{ color: meta?.color || T.textSub }} />
                  <h2 className="text-[10px] font-black uppercase tracking-widest" style={{ color: meta?.color || T.textSub }}>
                    {meta?.label || category}
                  </h2>
                  <span className="text-[9px]" style={{ color: T.textDim }}>({docs.length})</span>
                </div>
                {docs.map(renderDoc)}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">{filtered.map(renderDoc)}</div>
      )}
    </div>
  );
};
