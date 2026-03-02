import React, { useState, useRef, useEffect } from 'react';
import { T } from './UIElements';
import { MessageCircle, Plus, Send, CheckCircle2, Clock, AlertCircle, Bot } from 'lucide-react';
import { InvestmentAccount } from '../types';

interface SupportProps {
  userName: string;
  accounts: InvestmentAccount[];
}

interface ChatMessage {
  id: string;
  from: 'user' | 'bot' | 'support';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  subject: string;
  account: string;
  status: 'open' | 'in_progress' | 'resolved';
  botStep: 'account_selection' | 'open';
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const STATUS_CFG = {
  open:        { label: 'Open',        color: T.gold,    icon: AlertCircle },
  in_progress: { label: 'In Progress', color: '#60a5fa', icon: Clock },
  resolved:    { label: 'Resolved',    color: T.jade,    icon: CheckCircle2 },
};

const SEED_CONVOS: Conversation[] = [
  {
    id: 'conv_seed_1',
    subject: 'Distribution timing question',
    account: 'Vanderbilt Family Trust',
    status: 'in_progress',
    botStep: 'open',
    created_at: '2025-01-20T09:00:00Z',
    updated_at: '2025-01-21T14:30:00Z',
    messages: [
      { id: 'cs1_b1', from: 'bot',     text: 'Hi! Which investment account is this inquiry about?', timestamp: '2025-01-20T09:00:00Z' },
      { id: 'cs1_u1', from: 'user',    text: 'Vanderbilt Family Trust', timestamp: '2025-01-20T09:00:30Z' },
      { id: 'cs1_b2', from: 'bot',     text: "Got it — I'm connecting you with a specialist regarding your Vanderbilt Family Trust account. Please describe your question below.", timestamp: '2025-01-20T09:00:35Z' },
      { id: 'cs1_u2', from: 'user',    text: 'My Q1 2025 distribution from Phoenix Multifamily Fund does not appear yet in my dashboard.', timestamp: '2025-01-20T09:02:00Z' },
      { id: 'cs1_s1', from: 'support', text: 'Our team is reviewing the transaction. Expected resolution within 24 hours. We apologize for the inconvenience.', timestamp: '2025-01-21T14:30:00Z' },
    ],
  },
  {
    id: 'conv_seed_2',
    subject: 'K-1 document for tax year 2024',
    account: 'General Inquiry',
    status: 'resolved',
    botStep: 'open',
    created_at: '2025-02-01T11:00:00Z',
    updated_at: '2025-02-03T16:00:00Z',
    messages: [
      { id: 'cs2_b1', from: 'bot',     text: 'Hi! Which investment account is this inquiry about?', timestamp: '2025-02-01T11:00:00Z' },
      { id: 'cs2_u1', from: 'user',    text: 'General Inquiry', timestamp: '2025-02-01T11:00:30Z' },
      { id: 'cs2_b2', from: 'bot',     text: 'Understood. A support specialist will assist you shortly. Please describe your question below.', timestamp: '2025-02-01T11:00:35Z' },
      { id: 'cs2_u2', from: 'user',    text: 'Requesting the updated Schedule K-1 for tax year 2024.', timestamp: '2025-02-01T11:02:00Z' },
      { id: 'cs2_s1', from: 'support', text: 'Your K-1 has been uploaded to your Documents vault. Please check the Documents section.', timestamp: '2025-02-03T16:00:00Z' },
    ],
  },
];

export const Support: React.FC<SupportProps> = ({ userName, accounts }) => {
  const [convos, setConvos]   = useState<Conversation[]>(SEED_CONVOS);
  const [selected, setSelected] = useState<Conversation | null>(SEED_CONVOS[0]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages.length]);

  const updateConvo = (updated: Conversation) => {
    setConvos((p) => p.map((c) => c.id === updated.id ? updated : c));
    setSelected(updated);
  };

  const startNew = () => {
    const id = `conv_${Date.now()}`;
    const firstName = userName.split(' ')[0];
    const newConvo: Conversation = {
      id,
      subject: 'New Conversation',
      account: '',
      status: 'open',
      botStep: 'account_selection',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      messages: [
        {
          id: `${id}_b1`,
          from: 'bot',
          text: `Hi ${firstName}! Before we get started, which investment account is this inquiry about?`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setConvos((p) => [newConvo, ...p]);
    setSelected(newConvo);
  };

  const selectAccount = (accountName: string) => {
    if (!selected) return;
    const ts = new Date().toISOString();
    const botReply = accountName === 'General Inquiry'
      ? 'Understood. A support specialist will assist you shortly. Please describe your question below.'
      : `Got it — I'm connecting you with a specialist regarding your ${accountName} account. Please describe your question below.`;

    const updated: Conversation = {
      ...selected,
      subject: accountName === 'General Inquiry' ? 'General Inquiry' : `${accountName}`,
      account: accountName,
      botStep: 'open',
      updated_at: ts,
      messages: [
        ...selected.messages,
        { id: `${selected.id}_ua`, from: 'user', text: accountName, timestamp: ts },
        { id: `${selected.id}_b2`, from: 'bot',  text: botReply,    timestamp: new Date(Date.now() + 300).toISOString() },
      ],
    };
    updateConvo(updated);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !input.trim() || selected.botStep === 'account_selection') return;
    const ts = new Date().toISOString();
    const msg: ChatMessage = { id: `m_${Date.now()}`, from: 'user', text: input.trim(), timestamp: ts };
    const updated: Conversation = { ...selected, updated_at: ts, messages: [...selected.messages, msg] };
    updateConvo(updated);
    setInput('');

    // Simulate support auto-acknowledgement
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply: ChatMessage = {
        id: `m_sup_${Date.now()}`,
        from: 'support',
        text: 'Thank you for reaching out. A member of our team has received your message and will respond within 1 business day.',
        timestamp: new Date().toISOString(),
      };
      const withReply: Conversation = { ...updated, status: 'in_progress', updated_at: reply.timestamp, messages: [...updated.messages, reply] };
      setConvos((p) => p.map((c) => c.id === withReply.id ? withReply : c));
      setSelected((s) => s?.id === withReply.id ? withReply : s);
    }, 1800);
  };

  return (
    <div
      className="flex rounded-sm overflow-hidden"
      style={{ height: 'calc(100vh - 6rem)', border: `1px solid ${T.border}` }}
    >
      {/* ── Left: conversation list ── */}
      <div className="w-72 shrink-0 flex flex-col" style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}>
        <div className="px-4 py-3.5 flex items-center justify-between shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>Client Services</p>
            <h1 className="text-sm font-black uppercase tracking-wider" style={{ color: T.text }}>Support</h1>
          </div>
          <button
            onClick={startNew}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-xs font-bold"
            style={{ background: T.gold, color: '#000' }}
          >
            <Plus size={11} /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convos.map((c) => {
            const sc = STATUS_CFG[c.status];
            const last = c.messages[c.messages.length - 1];
            const isActive = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="w-full text-left p-3.5 transition-all"
                style={{
                  background: isActive ? T.raised : 'transparent',
                  borderBottom: `1px solid ${T.border}`,
                  borderLeft: `3px solid ${isActive ? sc.color : 'transparent'}`,
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold truncate leading-tight flex-1" style={{ color: T.text }}>{c.subject}</p>
                  <span className="text-[9px] shrink-0" style={{ color: T.textDim }}>{fmtTime(c.updated_at)}</span>
                </div>
                <p className="text-[10px] truncate mb-1.5 leading-tight" style={{ color: T.textDim }}>{last?.text}</p>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ background: `${sc.color}15`, color: sc.color }}
                >
                  {sc.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: chat panel ── */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0" style={{ background: T.bg }}>
          {/* Chat header */}
          <div
            className="px-6 py-3 flex items-center justify-between shrink-0"
            style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}
          >
            <div>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{selected.subject}</p>
              {selected.account && (
                <p className="text-[10px] mt-0.5" style={{ color: T.textDim }}>{selected.account}</p>
              )}
            </div>
            {(() => {
              const sc = STATUS_CFG[selected.status];
              const Icon = sc.icon;
              return (
                <span
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm"
                  style={{ background: `${sc.color}15`, color: sc.color, border: `1px solid ${sc.color}30` }}
                >
                  <Icon size={10} /> {sc.label}
                </span>
              );
            })()}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {selected.messages.map((msg) => {
              if (msg.from === 'bot') {
                return (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <div
                      className="w-6 h-6 rounded-sm shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: T.raised, border: `1px solid ${T.border}` }}
                    >
                      <Bot size={11} style={{ color: T.textDim }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: T.textDim }}>Diversify Bot</p>
                      <div
                        className="px-3.5 py-2.5 rounded-sm"
                        style={{ background: T.surface, border: `1px solid ${T.border}`, maxWidth: 320 }}
                      >
                        <p className="text-xs leading-relaxed" style={{ color: T.text }}>{msg.text}</p>
                      </div>
                      <p className="text-[9px] mt-1" style={{ color: T.textDim }}>{fmtTime(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              }

              if (msg.from === 'support') {
                return (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    <div
                      className="w-6 h-6 rounded-sm shrink-0 flex items-center justify-center mt-0.5"
                      style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}
                    >
                      <MessageCircle size={11} style={{ color: T.gold }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: T.gold }}>Diversify Support</p>
                      <div
                        className="px-3.5 py-2.5 rounded-sm"
                        style={{ background: T.goldFaint, border: `1px solid ${T.gold}30`, maxWidth: 320 }}
                      >
                        <p className="text-xs leading-relaxed" style={{ color: T.text }}>{msg.text}</p>
                      </div>
                      <p className="text-[9px] mt-1" style={{ color: T.textDim }}>{fmtTime(msg.timestamp)}</p>
                    </div>
                  </div>
                );
              }

              // User message — right-aligned, gold
              return (
                <div key={msg.id} className="flex justify-end">
                  <div style={{ maxWidth: 320 }}>
                    <div className="px-3.5 py-2.5 rounded-sm" style={{ background: T.gold }}>
                      <p className="text-xs leading-relaxed" style={{ color: '#000' }}>{msg.text}</p>
                    </div>
                    <p className="text-[9px] mt-1 text-right" style={{ color: T.textDim }}>{fmtTime(msg.timestamp)}</p>
                  </div>
                </div>
              );
            })}

            {/* Account selection chips shown during bot pre-screening */}
            {selected.botStep === 'account_selection' && (
              <div className="flex flex-wrap gap-2 pl-8 mt-1">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => selectAccount(acc.display_name)}
                    className="px-3 py-1.5 rounded-sm text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text }}
                  >
                    {acc.display_name}
                  </button>
                ))}
                <button
                  onClick={() => selectAccount('General Inquiry')}
                  className="px-3 py-1.5 rounded-sm text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.textDim }}
                >
                  General Inquiry
                </button>
              </div>
            )}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-sm shrink-0 flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                  <MessageCircle size={11} style={{ color: T.gold }} />
                </div>
                <div className="px-3.5 py-2.5 rounded-sm flex items-center gap-1" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: T.gold, animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: T.gold, animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: T.gold, animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          {selected.botStep === 'open' && selected.status !== 'resolved' && (
            <form
              onSubmit={sendMessage}
              className="shrink-0 p-4 flex gap-2"
              style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2.5 rounded-sm text-sm outline-none"
                style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="px-4 py-2 rounded-sm transition-opacity"
                style={{ background: T.gold, color: '#000', opacity: input.trim() && !typing ? 1 : 0.4 }}
              >
                <Send size={14} />
              </button>
            </form>
          )}

          {selected.status === 'resolved' && (
            <div
              className="shrink-0 px-6 py-3 text-center text-[10px] uppercase tracking-widest"
              style={{ background: T.surface, borderTop: `1px solid ${T.border}`, color: T.textDim }}
            >
              This conversation has been resolved
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs uppercase tracking-widest" style={{ color: T.textDim }}>Select a conversation or start a new one</p>
        </div>
      )}
    </div>
  );
};
