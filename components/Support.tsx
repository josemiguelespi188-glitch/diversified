import React, { useState } from 'react';
import { Button, Badge, Input, Select, Modal, T } from './UIElements';
import { MessageCircle, Plus, Send, ChevronDown, Clock, CheckCircle2, AlertCircle, Inbox } from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  last_reply?: string;
}

const MOCK_TICKETS: SupportTicket[] = [
  { id: 'TKT-0041', subject: 'Distribution not reflected in dashboard', category: 'Distributions', description: 'My Q1 2025 distribution from Phoenix Multifamily Fund does not appear yet.', status: 'in_progress', priority: 'high', created_at: '2025-01-20T09:00:00Z', updated_at: '2025-01-21T14:30:00Z', last_reply: 'Our team is reviewing the transaction. Expected resolution within 24h.' },
  { id: 'TKT-0038', subject: 'Request for updated K-1 document', category: 'Tax & Legal', description: 'Requesting the updated Schedule K-1 for tax year 2024.', status: 'resolved', priority: 'medium', created_at: '2025-02-01T11:00:00Z', updated_at: '2025-02-03T16:00:00Z', last_reply: 'K-1 has been uploaded to your Documents vault.' },
  { id: 'TKT-0035', subject: 'Question about Cornerstone Debt Fund terms', category: 'Deals & Investments', description: 'Questions about the preferred return structure on the Cornerstone Debt Fund.', status: 'resolved', priority: 'low', created_at: '2024-12-10T08:00:00Z', updated_at: '2024-12-11T10:00:00Z', last_reply: 'Please refer to PPM section 4.2. We also sent you an email.' },
];

const CATEGORIES = ['Distributions', 'Deals & Investments', 'Accreditation & KYC', 'Tax & Legal', 'Funding & Wires', 'Other'];

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.FC<{ size?: number }> }> = {
  open:        { label: 'Open',        color: T.gold,   icon: AlertCircle },
  in_progress: { label: 'In Progress', color: T.sky,    icon: Clock },
  resolved:    { label: 'Resolved',    color: T.jade,   icon: CheckCircle2 },
};

const PRIORITY_CFG: Record<string, { label: string; color: string }> = {
  low:    { label: 'Low',    color: T.textSub },
  medium: { label: 'Medium', color: T.gold },
  high:   { label: 'High',   color: T.ruby },
};

export const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: '', category: CATEGORIES[0], description: '', priority: 'medium' as const });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const openCount = tickets.filter((t) => t.status !== 'resolved').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const newTicket: SupportTicket = {
      id: `TKT-${String(Math.floor(Math.random() * 900 + 100))}`,
      ...form,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
    setSubmitting(false);
    setDone(true);
    setTimeout(() => { setDone(false); setShowForm(false); setForm({ subject: '', category: CATEGORIES[0], description: '', priority: 'medium' }); }, 2000);
  };

  return (
    <div className="max-w-3xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>Client Services</p>
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: T.text }}>Support</h1>
        </div>
        <div className="flex items-center gap-3">
          {openCount > 0 && <Badge variant="gold">{openCount} Active</Badge>}
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={12} /> Open Ticket
          </Button>
        </div>
      </div>

      {/* Tickets */}
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6 }}>
          <Inbox size={24} style={{ color: T.textDim, marginBottom: 12 }} />
          <p className="text-[10px] uppercase tracking-widest" style={{ color: T.textDim }}>No support tickets</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => {
            const sc = STATUS_CFG[ticket.status];
            const pc = PRIORITY_CFG[ticket.priority];
            const StatusIcon = sc.icon;
            const open = expanded === ticket.id;

            return (
              <div key={ticket.id} className="rounded-sm overflow-hidden" style={{ border: `1px solid ${open ? T.gold + '40' : T.border}` }}>
                <button
                  onClick={() => setExpanded(open ? null : ticket.id)}
                  className="w-full text-left p-4 flex items-center gap-4 transition-all"
                  style={{ background: open ? T.goldFaint : T.surface }}
                >
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0" style={{ background: `${sc.color}15`, border: `1px solid ${sc.color}30` }}>
                    <StatusIcon size={14} style={{ color: sc.color }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wide truncate" style={{ color: T.text }}>{ticket.subject}</span>
                      <span className="text-[9px]" style={{ color: T.textDim }}>{ticket.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] uppercase tracking-widest" style={{ color: T.textDim }}>{ticket.category}</span>
                      <span style={{ color: T.textDim }}>·</span>
                      <span className="text-[9px]" style={{ color: T.textDim }}>{new Date(ticket.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ color: pc.color, background: `${pc.color}15`, border: `1px solid ${pc.color}40` }}>
                      {pc.label}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm" style={{ color: sc.color, background: `${sc.color}15`, border: `1px solid ${sc.color}40` }}>
                      {sc.label}
                    </span>
                    <ChevronDown size={13} style={{ color: T.textDim, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </button>

                {open && (
                  <div className="p-5 space-y-4" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: T.textDim }}>Description</p>
                      <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{ticket.description}</p>
                    </div>
                    {ticket.last_reply && (
                      <div className="p-4 rounded-sm" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: T.gold }}>Diversify Support Team</p>
                        <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>{ticket.last_reply}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Ticket Modal */}
      <Modal isOpen={showForm} onClose={() => !submitting && setShowForm(false)} title="Open Support Ticket" width="max-w-lg">
        {done ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-sm flex items-center justify-center mx-auto" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
              <CheckCircle2 size={24} style={{ color: T.jade }} />
            </div>
            <p className="text-sm font-black uppercase tracking-widest" style={{ color: T.text }}>Ticket Submitted</p>
            <p className="text-xs" style={{ color: T.textSub }}>Our team will respond within 1 business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Subject"
              required
              placeholder="Brief description of your issue"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Select label="Priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as 'low' | 'medium' | 'high' }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>Description</label>
              <textarea
                required
                rows={4}
                placeholder="Provide as much detail as possible…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-sm px-4 py-2.5 text-sm outline-none transition-all resize-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/10"
                style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full" size="lg">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : (
                <><Send size={13} /> Submit Ticket</>
              )}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
