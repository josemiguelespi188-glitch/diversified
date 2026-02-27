
import React, { useState } from 'react';
import { Card, Badge, Button } from './UIElements';
import { MessageCircle, Plus, X, Send, ChevronDown, Clock, CheckCircle2, AlertCircle, Inbox } from 'lucide-react';

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
  {
    id: 'TKT-0041',
    subject: 'Distribution not reflected in dashboard',
    category: 'Distributions',
    description: 'My Q1 2025 distribution from Phoenix Multifamily Fund does not appear on the dashboard yet.',
    status: 'in_progress',
    priority: 'high',
    created_at: '2025-01-20T09:00:00Z',
    updated_at: '2025-01-21T14:30:00Z',
    last_reply: 'Our team is reviewing the transaction. Expected resolution within 24h.'
  },
  {
    id: 'TKT-0038',
    subject: 'Request for updated K-1 document',
    category: 'Tax & Legal',
    description: 'Requesting the updated Schedule K-1 for tax year 2024.',
    status: 'resolved',
    priority: 'medium',
    created_at: '2025-02-01T11:00:00Z',
    updated_at: '2025-02-03T16:00:00Z',
    last_reply: 'K-1 has been uploaded to your Documents vault.'
  },
  {
    id: 'TKT-0035',
    subject: 'Question about Cornerstone Debt Fund terms',
    category: 'Deals & Investments',
    description: 'I have questions about the preferred return structure on the Cornerstone Debt Fund.',
    status: 'resolved',
    priority: 'low',
    created_at: '2024-12-10T08:00:00Z',
    updated_at: '2024-12-11T10:00:00Z',
    last_reply: 'Please refer to the PPM document in your vault, section 4.2. We also sent you an email.'
  }
];

const CATEGORIES = ['Distributions', 'Deals & Investments', 'Accreditation & KYC', 'Tax & Legal', 'Funding & Wires', 'Other'];

const STATUS_CONFIG = {
  open: { label: 'Open', color: '#F59E0B', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: '#2F80ED', icon: Clock },
  resolved: { label: 'Resolved', color: '#00E0C6', icon: CheckCircle2 }
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#8FAEDB' },
  medium: { label: 'Medium', color: '#F59E0B' },
  high: { label: 'High', color: '#EF4444' }
};

export const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: '', category: CATEGORIES[0], description: '', priority: 'medium' as 'low' | 'medium' | 'high' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const newTicket: SupportTicket = {
      id: `TKT-${String(Math.floor(Math.random() * 900) + 100)}`,
      subject: form.subject,
      category: form.category,
      description: form.description,
      status: 'open',
      priority: form.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTickets(prev => [newTicket, ...prev]);
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setForm({ subject: '', category: CATEGORIES[0], description: '', priority: 'medium' });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-4xl">
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Support</h1>
          <p className="text-[#8FAEDB] text-sm uppercase tracking-widest font-medium opacity-60">
            Institutional client services
          </p>
        </div>
        <div className="flex items-center gap-3">
          {openCount > 0 && (
            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-3 py-1.5 rounded font-bold uppercase tracking-widest">
              {openCount} Active
            </span>
          )}
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-[10px]">
            <Plus size={14} /> Open Ticket
          </Button>
        </div>
      </header>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <Card className="text-center py-20 border-white/5">
          <Inbox size={40} className="mx-auto text-[#8FAEDB]/20 mb-4" />
          <p className="text-[10px] text-[#8FAEDB]/40 uppercase tracking-widest">No support tickets</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const statusCfg = STATUS_CONFIG[ticket.status];
            const StatusIcon = statusCfg.icon;
            const priorityCfg = PRIORITY_CONFIG[ticket.priority];
            const isExpanded = expandedId === ticket.id;

            return (
              <div key={ticket.id} className="rounded-xl overflow-hidden border border-white/5 bg-white/5">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                  className={`w-full text-left p-5 flex items-center gap-4 transition-all hover:bg-white/5 ${isExpanded ? 'bg-white/5' : ''}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: statusCfg.color + '15', border: `1px solid ${statusCfg.color}30` }}
                  >
                    <StatusIcon size={16} style={{ color: statusCfg.color }} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white uppercase tracking-tight truncate">
                        {ticket.subject}
                      </span>
                      <span className="text-[8px] text-[#8FAEDB]/50 font-bold uppercase">{ticket.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest opacity-60">{ticket.category}</span>
                      <span className="text-[#8FAEDB]/30 text-[9px]">•</span>
                      <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest opacity-60">
                        {new Date(ticket.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="hidden sm:block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                      style={{ color: priorityCfg.color, borderColor: priorityCfg.color + '40', background: priorityCfg.color + '10' }}
                    >
                      {priorityCfg.label}
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                      style={{ color: statusCfg.color, borderColor: statusCfg.color + '40', background: statusCfg.color + '10' }}
                    >
                      {statusCfg.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#8FAEDB] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-white/5 p-6 space-y-4 animate-in slide-in-from-top-2 duration-200 bg-black/10">
                    <div>
                      <p className="text-[9px] text-[#8FAEDB] uppercase tracking-widest font-bold mb-2">Description</p>
                      <p className="text-sm text-[#C9D8F0] leading-relaxed">{ticket.description}</p>
                    </div>
                    {ticket.last_reply && (
                      <div className="p-4 rounded-lg bg-[#2F80ED]/5 border border-[#2F80ED]/20">
                        <p className="text-[9px] text-[#2F80ED] uppercase tracking-widest font-bold mb-2">
                          Diversify Support Team
                        </p>
                        <p className="text-sm text-[#C9D8F0] leading-relaxed">{ticket.last_reply}</p>
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
      {showForm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081C3A]/95 backdrop-blur-md" onClick={() => !isSubmitting && setShowForm(false)} />
          <Card className="relative w-full max-w-lg p-0 overflow-hidden border-[#2F80ED]/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F2A4A]/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#2F80ED]/10 border border-[#2F80ED]/20 flex items-center justify-center text-[#2F80ED]">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight uppercase">New Support Ticket</h2>
                  <p className="text-[9px] text-[#8FAEDB] uppercase tracking-widest">Institutional Client Services</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} disabled={isSubmitting} className="text-[#8FAEDB] hover:text-white transition-colors p-2">
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="p-12 text-center space-y-4">
                <CheckCircle2 size={48} className="mx-auto text-[#00E0C6]" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Ticket Submitted</h3>
                <p className="text-sm text-[#8FAEDB]">Our team will respond within 1 business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-[#8FAEDB]">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="Brief description of your issue"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-[#2F80ED] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-[#8FAEDB]">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-[#2F80ED] outline-none appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-[#8FAEDB]">Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(f => ({ ...f, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-[#2F80ED] outline-none appearance-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-[#8FAEDB]">Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide as much detail as possible..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-[#2F80ED] outline-none transition-all resize-none"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full py-4 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Submit Ticket
                    </>
                  )}
                </Button>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
