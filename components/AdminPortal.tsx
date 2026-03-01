
import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  LayoutDashboard, Users, Briefcase, MessageSquare, FileText, Settings, LogOut,
  Search, ChevronRight, X, Plus, Edit2, Check, AlertCircle, Bell, TrendingUp,
  DollarSign, UserCheck, Activity, BarChart2, Shield,
} from 'lucide-react';
import { T } from './UIElements';
import { adminLogout, AdminSession } from '../lib/adminAuth';
import {
  generateAdminUsers, generateAdminAccounts, generateAdminInvestments,
  generateAdminDeals, generateAdminMessages, generateAdminDocuments,
  generateGrowthData, DEFAULT_SETTINGS,
  AdminUser, AdminDeal, AdminMessage, AdminDocument, AdminSettings,
} from '../lib/adminMockData';
import { InvestmentAccountType } from '../types';

// ── Pre-generate mock data once ────────────────────────────────────────────
const ALL_USERS   = generateAdminUsers();
const ALL_ACCOUNTS = generateAdminAccounts(ALL_USERS);
const ALL_INVESTMENTS = generateAdminInvestments(ALL_USERS, ALL_ACCOUNTS);
const ALL_DEALS   = generateAdminDeals();
const ALL_MESSAGES = generateAdminMessages(ALL_USERS);
const ALL_DOCUMENTS = generateAdminDocuments(ALL_USERS, ALL_DEALS);
const GROWTH_DATA = generateGrowthData();

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(0)}K` : `$${n}`;
const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const statusColor = (s: string) => s === 'verified' || s === 'resolved' || s === 'active' ? T.jade : s === 'pending' || s === 'in_progress' ? T.gold : '#ff8080';

// ── Shared sub-components ──────────────────────────────────────────────────
const Pill: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{label}</span>
);

const KpiCard: React.FC<{ icon: React.ElementType; label: string; value: string; sub?: string; color?: string }> = ({ icon: Icon, label, value, sub, color = T.gold }) => (
  <div className="p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: T.textDim }}>{label}</p>
      <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon size={13} style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-black" style={{ color: T.text }}>{value}</p>
    {sub && <p className="text-[10px] mt-1" style={{ color: T.textDim }}>{sub}</p>}
  </div>
);

const SectionHeader: React.FC<{ title: string; sub?: string; action?: React.ReactNode }> = ({ title, sub, action }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-base font-black uppercase tracking-widest" style={{ color: T.text }}>{title}</h2>
      {sub && <p className="text-xs mt-0.5" style={{ color: T.textDim }}>{sub}</p>}
    </div>
    {action}
  </div>
);

const FieldRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-start gap-4 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
    <span className="text-[10px] font-bold uppercase tracking-widest w-32 shrink-0 mt-0.5" style={{ color: T.textDim }}>{label}</span>
    <span className="text-xs flex-1" style={{ color: T.text }}>{value}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// ── DASHBOARD SECTION ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const AdminDashboardSection: React.FC = () => {
  const totalCapital = ALL_DEALS.reduce((s, d) => s + d.capital_raised, 0);
  const accreditedCount = ALL_USERS.filter((u) => u.accredited).length;
  const investedCount  = ALL_USERS.filter((u) => u.invested).length;
  const totalSessions  = ALL_USERS.reduce((s, u) => s + u.session_count, 0);
  const conversionRate = ((investedCount / ALL_USERS.length) * 100).toFixed(1);

  const accountTypeData = Object.entries(
    ALL_ACCOUNTS.reduce<Record<string, number>>((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {})
  ).map(([type, count]) => ({ type: type.split(' ')[0], count })).sort((a, b) => b.count - a.count).slice(0, 6);

  const tooltipStyle = { backgroundColor: T.raised, border: `1px solid ${T.border}`, borderRadius: 4, color: T.text, fontSize: 11 };

  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" sub="Platform-wide performance overview" />

      {/* AARRR KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Users}       label="Total Users"      value={ALL_USERS.length.toString()}   sub="Acquisition" />
        <KpiCard icon={Activity}    label="Avg Sessions"     value={(totalSessions / ALL_USERS.length).toFixed(1)} sub="Activation" color={T.jade} />
        <KpiCard icon={TrendingUp}  label="Active Investors" value={investedCount.toString()}       sub="Retention" color="#60a5fa" />
        <KpiCard icon={DollarSign}  label="Capital Deployed" value={fmt(totalCapital)}              sub="Revenue" color="#a78bfa" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={UserCheck}   label="Accredited"       value={accreditedCount.toString()}     sub={`${((accreditedCount / ALL_USERS.length) * 100).toFixed(0)}% of users`} />
        <KpiCard icon={BarChart2}   label="Conversion"       value={`${conversionRate}%`}           sub="Users → Investors" color={T.jade} />
        <KpiCard icon={Briefcase}   label="Active Deals"     value={ALL_DEALS.filter((d) => d.status === 'active').length.toString()} sub="Open offerings" color="#f97316" />
        <KpiCard icon={Shield}      label="KYC Verified"     value={ALL_USERS.filter((u) => u.kyc_status === 'verified').length.toString()} sub={`of ${ALL_USERS.length} users`} color="#e879f9" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: T.textDim }}>User Growth (12 months)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={GROWTH_DATA}>
              <defs>
                <linearGradient id="gU" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.gold} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.gold} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.jade} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.jade} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={`${T.border}80`} />
              <XAxis dataKey="month" tick={{ fill: T.textDim, fontSize: 9 }} />
              <YAxis tick={{ fill: T.textDim, fontSize: 9 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="users"    stroke={T.gold} fill="url(#gU)" name="Users" strokeWidth={2} />
              <Area type="monotone" dataKey="invested" stroke={T.jade} fill="url(#gI)" name="Investors" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: T.textDim }}>Accounts by Type</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={accountTypeData} layout="vertical">
              <XAxis type="number" tick={{ fill: T.textDim, fontSize: 9 }} />
              <YAxis type="category" dataKey="type" tick={{ fill: T.textDim, fontSize: 9 }} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={T.gold} radius={[0, 2, 2, 0]} name="Accounts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: T.textDim }}>Recent Inquiries</p>
        <div className="space-y-2">
          {ALL_MESSAGES.filter((m) => m.status === 'new').slice(0, 5).map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2.5 px-3 rounded-sm" style={{ background: T.raised }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: T.gold }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{m.subject}</p>
                <p className="text-[10px] truncate" style={{ color: T.textDim }}>{m.user_name} · {fmtDate(m.created_at)}</p>
              </div>
              <Pill label="New" color={T.gold} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ── USERS SECTION ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const AdminUsersSection: React.FC = () => {
  const [users, setUsers]           = useState<AdminUser[]>(ALL_USERS);
  const [query, setQuery]           = useState('');
  const [filter, setFilter]         = useState<'all' | 'accredited' | 'invested' | 'no_investment'>('all');
  const [selected, setSelected]     = useState<AdminUser | null>(null);
  const [editing, setEditing]       = useState(false);
  const [editNotes, setEditNotes]   = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]       = useState('');
  const [newEmail, setNewEmail]     = useState('');

  const filtered = useMemo(() => users.filter((u) => {
    const q = query.toLowerCase();
    const matchQ = !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchF = filter === 'all' ? true
      : filter === 'accredited' ? u.accredited
      : filter === 'invested'   ? u.invested
      : !u.invested;
    return matchQ && matchF;
  }), [users, query, filter]);

  const userAccounts = selected ? ALL_ACCOUNTS.filter((a) => a.user_id === selected.id) : [];
  const userInvestments = selected ? ALL_INVESTMENTS.filter((i) => i.user_id === selected.id) : [];

  const saveNotes = () => {
    if (!selected) return;
    setUsers((prev) => prev.map((u) => u.id === selected.id ? { ...u, notes: editNotes } : u));
    setSelected((s) => s ? { ...s, notes: editNotes } : null);
    setEditing(false);
  };

  const createUser = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const nu: AdminUser = {
      id: `usr_new_${Date.now()}`, full_name: newName, email: newEmail,
      phone: '', country: 'United States', account_type: InvestmentAccountType.INDIVIDUAL,
      accredited: false, invested: false, created_at: new Date().toISOString(),
      kyc_status: 'pending', referral_code: `DIV${Date.now().toString().slice(-5)}`,
      session_count: 0, last_login: new Date().toISOString(), notes: '',
    };
    setUsers((p) => [nu, ...p]);
    setNewName(''); setNewEmail(''); setShowCreate(false);
  };

  const FILTERS: Array<{ key: typeof filter; label: string }> = [
    { key: 'all', label: 'All' }, { key: 'accredited', label: 'Accredited' },
    { key: 'invested', label: 'Invested' }, { key: 'no_investment', label: 'No Investment' },
  ];

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* List */}
      <div className="flex-1 flex flex-col min-w-0">
        <SectionHeader
          title="Users"
          sub={`${filtered.length} of ${users.length} users`}
          action={
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold" style={{ background: T.gold, color: '#000' }}>
              <Plus size={12} /> New User
            </button>
          }
        />

        {showCreate && (
          <div className="mb-4 p-4 rounded-sm flex gap-3" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Full name" className="flex-1 px-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className="flex-1 px-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
            <button onClick={createUser} className="px-3 py-2 rounded-sm text-xs font-bold" style={{ background: T.gold, color: '#000' }}><Check size={12} /></button>
            <button onClick={() => setShowCreate(false)} className="px-3 py-2 rounded-sm text-xs" style={{ background: T.raised, color: T.textDim }}><X size={12} /></button>
          </div>
        )}

        {/* Search + filters */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.textDim }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users…" className="w-full pl-8 pr-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text }} />
          </div>
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className="px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors" style={{ background: filter === f.key ? T.gold : T.surface, color: filter === f.key ? '#000' : T.textDim, border: `1px solid ${filter === f.key ? T.gold : T.border}` }}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
          {filtered.map((u) => (
            <button key={u.id} onClick={() => setSelected(u)} className="w-full text-left p-3 rounded-sm transition-all" style={{ background: selected?.id === u.id ? T.raised : T.surface, border: `1px solid ${selected?.id === u.id ? T.gold + '50' : T.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 text-[11px] font-black" style={{ background: T.goldFaint, color: T.gold }}>
                  {u.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{u.full_name}</p>
                  <p className="text-[10px] truncate" style={{ color: T.textDim }}>{u.email}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {u.accredited && <Pill label="Acc" color={T.jade} />}
                  {u.invested && <Pill label="Inv" color={T.gold} />}
                </div>
                <ChevronRight size={12} style={{ color: T.textDim }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-96 shrink-0 overflow-y-auto rounded-sm p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>User Detail</h3>
            <button onClick={() => setSelected(null)} style={{ color: T.textDim }}><X size={14} /></button>
          </div>

          <div className="w-14 h-14 rounded-sm flex items-center justify-center mx-auto mb-4 text-xl font-black" style={{ background: T.goldFaint, color: T.gold }}>
            {selected.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <p className="text-center text-sm font-black mb-0.5" style={{ color: T.text }}>{selected.full_name}</p>
          <p className="text-center text-[10px] mb-4" style={{ color: T.textDim }}>{selected.email}</p>
          <div className="flex justify-center gap-2 mb-5">
            <Pill label={selected.kyc_status} color={statusColor(selected.kyc_status)} />
            {selected.accredited && <Pill label="Accredited" color={T.jade} />}
            {selected.invested && <Pill label="Invested" color={T.gold} />}
          </div>

          <div className="mb-4">
            <FieldRow label="Phone" value={selected.phone || '—'} />
            <FieldRow label="Country" value={selected.country} />
            <FieldRow label="Account Type" value={selected.account_type} />
            <FieldRow label="Joined" value={fmtDate(selected.created_at)} />
            <FieldRow label="Last Login" value={fmtDate(selected.last_login)} />
            <FieldRow label="Sessions" value={selected.session_count.toString()} />
            <FieldRow label="Referral Code" value={selected.referral_code} />
            {selected.referred_by && <FieldRow label="Referred By" value={selected.referred_by} />}
          </div>

          {/* Notes */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Internal Notes</p>
              {!editing ? (
                <button onClick={() => { setEditNotes(selected.notes); setEditing(true); }} className="flex items-center gap-1 text-[10px]" style={{ color: T.gold }}>
                  <Edit2 size={10} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveNotes} className="text-[10px]" style={{ color: T.jade }}>Save</button>
                  <button onClick={() => setEditing(false)} className="text-[10px]" style={{ color: T.textDim }}>Cancel</button>
                </div>
              )}
            </div>
            {editing ? (
              <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-sm text-xs outline-none resize-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
            ) : (
              <p className="text-xs" style={{ color: selected.notes ? T.text : T.textDim }}>{selected.notes || 'No notes yet.'}</p>
            )}
          </div>

          {/* Accounts */}
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textDim }}>Investment Accounts ({userAccounts.length})</p>
          <div className="space-y-1.5 mb-4">
            {userAccounts.length === 0 ? <p className="text-xs" style={{ color: T.textDim }}>None</p> : userAccounts.map((a) => (
              <div key={a.id} className="px-3 py-2 rounded-sm text-xs" style={{ background: T.raised }}>
                <p style={{ color: T.text }}>{a.display_name}</p>
                <p style={{ color: T.textDim }}>{a.type}</p>
              </div>
            ))}
          </div>

          {/* Investments */}
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textDim }}>Investments ({userInvestments.length})</p>
          <div className="space-y-1.5">
            {userInvestments.length === 0 ? <p className="text-xs" style={{ color: T.textDim }}>No investments</p> : userInvestments.map((inv) => (
              <div key={inv.id} className="px-3 py-2 rounded-sm" style={{ background: T.raised }}>
                <p className="text-xs truncate" style={{ color: T.text }}>{inv.deal_name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px]" style={{ color: T.textDim }}>{fmt(inv.amount)}</p>
                  <Pill label={inv.status.split(' ')[0]} color={statusColor(inv.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ── DEALS SECTION ─────────────────────────────────────────════════════════
// ═══════════════════════════════════════════════════════════════════════════
const AdminDealsSection: React.FC = () => {
  const [deals, setDeals]         = useState<AdminDeal[]>(ALL_DEALS);
  const [selected, setSelected]   = useState<AdminDeal | null>(null);
  const [showForm, setShowForm]   = useState(false);
  const [editDeal, setEditDeal]   = useState<AdminDeal | null>(null);

  const dealInvestments = selected ? ALL_INVESTMENTS.filter((i) => i.deal_id === selected.id) : [];
  const totalCommitted = dealInvestments.reduce((s, i) => s + i.amount, 0);

  const openCreate = () => {
    setEditDeal({
      id: '', title: '', location: '', asset_class: 'Multifamily', strategy: '', structure: '506(c) Reg D',
      target_raise: 10000000, capital_raised: 0, minimum_investment: 25000, projected_irr: 12,
      cash_yield: 7, term_years: 5, lockup_months: 60, status: 'active', committee_approved: false,
      sponsor: '', thumbnail_url: '', youtube_url: '', mgmt_fee: 1.5, carry_fee: 20, preferred_return: 8,
      tags: [], investor_count: 0, total_committed: 0,
    });
    setShowForm(true);
  };

  const openEdit = (d: AdminDeal) => { setEditDeal({ ...d }); setShowForm(true); };

  const saveDeal = () => {
    if (!editDeal) return;
    if (!editDeal.id) {
      const nd = { ...editDeal, id: `d_${Date.now()}` };
      setDeals((p) => [nd, ...p]);
    } else {
      setDeals((p) => p.map((d) => d.id === editDeal.id ? editDeal : d));
      if (selected?.id === editDeal.id) setSelected(editDeal);
    }
    setShowForm(false);
    setEditDeal(null);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* List */}
      <div className="flex-1 flex flex-col min-w-0">
        <SectionHeader
          title="Deals"
          sub={`${deals.length} deals · ${deals.filter((d) => d.status === 'active').length} active`}
          action={
            <button onClick={openCreate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold" style={{ background: T.gold, color: '#000' }}>
              <Plus size={12} /> New Deal
            </button>
          }
        />

        <div className="overflow-y-auto flex-1 space-y-2">
          {deals.map((d) => {
            const pct = Math.round((d.capital_raised / d.target_raise) * 100);
            return (
              <button key={d.id} onClick={() => setSelected(d)} className="w-full text-left p-4 rounded-sm transition-all" style={{ background: selected?.id === d.id ? T.raised : T.surface, border: `1px solid ${selected?.id === d.id ? T.gold + '50' : T.border}` }}>
                <div className="flex items-center gap-4">
                  <img src={d.thumbnail_url} alt="" className="w-14 h-10 object-cover rounded-sm shrink-0 bg-gray-800" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{d.title}</p>
                      <Pill label={d.status} color={d.status === 'active' ? T.jade : T.textDim} />
                    </div>
                    <p className="text-[10px] mb-2" style={{ color: T.textDim }}>{d.location} · {d.asset_class} · {d.sponsor}</p>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: T.raised }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: T.gold }} />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: T.textDim }}>{fmt(d.capital_raised)} / {fmt(d.target_raise)} ({pct}%)</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black" style={{ color: T.gold }}>{d.projected_irr}%</p>
                    <p className="text-[9px]" style={{ color: T.textDim }}>Proj. IRR</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail / form panel */}
      {showForm && editDeal ? (
        <div className="w-96 shrink-0 overflow-y-auto rounded-sm p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>{editDeal.id ? 'Edit Deal' : 'New Deal'}</h3>
            <button onClick={() => setShowForm(false)} style={{ color: T.textDim }}><X size={14} /></button>
          </div>
          <div className="space-y-3">
            {([
              ['title','Title','text'], ['location','Location','text'], ['sponsor','Sponsor','text'],
              ['asset_class','Asset Class','text'], ['strategy','Strategy','text'], ['structure','Structure','text'],
              ['thumbnail_url','Thumbnail URL','text'], ['youtube_url','YouTube URL','text'],
            ] as [keyof AdminDeal, string, string][]).map(([key, label]) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>{label}</label>
                <input value={String(editDeal[key] ?? '')} onChange={(e) => setEditDeal({ ...editDeal, [key]: e.target.value })} className="w-full px-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
              </div>
            ))}
            {([
              ['target_raise','Target Raise'], ['minimum_investment','Min. Investment'],
              ['projected_irr','Proj. IRR %'], ['cash_yield','Cash Yield %'],
              ['term_years','Term (years)'], ['lockup_months','Lockup (months)'],
              ['mgmt_fee','Mgmt Fee %'], ['carry_fee','Carry %'], ['preferred_return','Pref. Return %'],
            ] as [keyof AdminDeal, string][]).map(([key, label]) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>{label}</label>
                <input type="number" value={Number(editDeal[key] ?? 0)} onChange={(e) => setEditDeal({ ...editDeal, [key]: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
              </div>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <input type="checkbox" id="comAppr" checked={editDeal.committee_approved} onChange={(e) => setEditDeal({ ...editDeal, committee_approved: e.target.checked })} />
              <label htmlFor="comAppr" className="text-xs" style={{ color: T.text }}>Committee Approved</label>
            </div>
          </div>
          <button onClick={saveDeal} className="mt-5 w-full py-2.5 rounded-sm text-xs font-black uppercase tracking-widest" style={{ background: T.gold, color: '#000' }}>
            {editDeal.id ? 'Save Changes' : 'Create Deal'}
          </button>
        </div>
      ) : selected ? (
        <div className="w-96 shrink-0 overflow-y-auto rounded-sm p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>Deal Detail</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(selected)} className="flex items-center gap-1 text-[10px]" style={{ color: T.gold }}><Edit2 size={10} /> Edit</button>
              <button onClick={() => setSelected(null)} style={{ color: T.textDim }}><X size={14} /></button>
            </div>
          </div>
          <img src={selected.thumbnail_url} alt="" className="w-full h-32 object-cover rounded-sm mb-4 bg-gray-800" />
          <p className="text-sm font-black mb-1" style={{ color: T.text }}>{selected.title}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Pill label={selected.status} color={selected.status === 'active' ? T.jade : T.textDim} />
            {selected.committee_approved && <Pill label="Approved" color={T.jade} />}
            <Pill label={selected.asset_class} color={T.gold} />
          </div>
          <FieldRow label="Sponsor" value={selected.sponsor} />
          <FieldRow label="Location" value={selected.location} />
          <FieldRow label="Structure" value={selected.structure} />
          <FieldRow label="Target Raise" value={fmt(selected.target_raise)} />
          <FieldRow label="Capital Raised" value={fmt(selected.capital_raised)} />
          <FieldRow label="Min. Investment" value={fmt(selected.minimum_investment)} />
          <FieldRow label="Proj. IRR" value={`${selected.projected_irr}%`} />
          <FieldRow label="Cash Yield" value={`${selected.cash_yield}%`} />
          <FieldRow label="Pref. Return" value={`${selected.preferred_return}%`} />
          <FieldRow label="Mgmt Fee" value={`${selected.mgmt_fee}%`} />
          <FieldRow label="Carry" value={`${selected.carry_fee}%`} />
          <FieldRow label="Term" value={`${selected.term_years}yr / ${selected.lockup_months}mo lockup`} />

          <p className="text-[10px] font-bold uppercase tracking-widest mt-5 mb-2" style={{ color: T.textDim }}>Investment Ledger ({dealInvestments.length})</p>
          <div className="space-y-1.5">
            {dealInvestments.length === 0 ? <p className="text-xs" style={{ color: T.textDim }}>No investments</p> : dealInvestments.slice(0, 20).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-3 py-2 rounded-sm" style={{ background: T.raised }}>
                <div>
                  <p className="text-xs" style={{ color: T.text }}>{ALL_USERS.find((u) => u.id === inv.user_id)?.full_name ?? inv.user_id}</p>
                  <p className="text-[10px]" style={{ color: T.textDim }}>{fmtDate(inv.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: T.gold }}>{fmt(inv.amount)}</p>
                  <Pill label={inv.status.split(' ')[0]} color={statusColor(inv.status)} />
                </div>
              </div>
            ))}
          </div>
          {dealInvestments.length > 0 && (
            <div className="mt-3 px-3 py-2 rounded-sm flex justify-between" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
              <p className="text-xs font-bold" style={{ color: T.gold }}>Total Committed</p>
              <p className="text-xs font-black" style={{ color: T.gold }}>{fmt(totalCommitted)}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ── MESSAGES SECTION ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const AdminMessagesSection: React.FC = () => {
  const [messages, setMessages]     = useState<AdminMessage[]>(ALL_MESSAGES);
  const [selected, setSelected]     = useState<AdminMessage | null>(null);
  const [noteText, setNoteText]     = useState('');
  const [filterStatus, setStatus]   = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  const filtered = messages.filter((m) => filterStatus === 'all' || m.status === filterStatus);

  const updateStatus = (id: string, status: AdminMessage['status']) => {
    setMessages((p) => p.map((m) => m.id === id ? { ...m, status } : m));
    setSelected((s) => s ? { ...s, status } : null);
  };

  const saveNote = () => {
    if (!selected || !noteText.trim()) return;
    const updated = { ...selected, internal_notes: selected.internal_notes ? `${selected.internal_notes}\n\n${noteText}` : noteText };
    setMessages((p) => p.map((m) => m.id === selected.id ? updated : m));
    setSelected(updated);
    setNoteText('');
  };

  const STATUS_FILTERS: Array<{ key: typeof filterStatus; label: string; color: string }> = [
    { key: 'all', label: 'All', color: T.textDim },
    { key: 'new', label: 'New', color: T.gold },
    { key: 'in_progress', label: 'In Progress', color: '#60a5fa' },
    { key: 'resolved', label: 'Resolved', color: T.jade },
  ];

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      <div className="flex-1 flex flex-col min-w-0">
        <SectionHeader title="Messages" sub={`${filtered.length} inquiries`} />

        <div className="flex gap-2 mb-4">
          {STATUS_FILTERS.map((f) => (
            <button key={f.key} onClick={() => setStatus(f.key)} className="px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider" style={{ background: filterStatus === f.key ? f.color : T.surface, color: filterStatus === f.key ? '#000' : T.textDim, border: `1px solid ${filterStatus === f.key ? f.color : T.border}` }}>
              {f.label} ({f.key === 'all' ? messages.length : messages.filter((m) => m.status === f.key).length})
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 space-y-1.5">
          {filtered.map((m) => (
            <button key={m.id} onClick={() => setSelected(m)} className="w-full text-left p-3 rounded-sm transition-all" style={{ background: selected?.id === m.id ? T.raised : T.surface, border: `1px solid ${selected?.id === m.id ? T.gold + '50' : T.border}` }}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: statusColor(m.status) }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: T.text }}>{m.subject}</p>
                  <p className="text-[10px] truncate" style={{ color: T.textDim }}>{m.user_name} · {fmtDate(m.created_at)}</p>
                </div>
                <Pill label={m.status.replace('_', ' ')} color={statusColor(m.status)} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="w-96 shrink-0 overflow-y-auto rounded-sm p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>Inquiry</h3>
            <button onClick={() => setSelected(null)} style={{ color: T.textDim }}><X size={14} /></button>
          </div>
          <p className="text-sm font-bold mb-1" style={{ color: T.text }}>{selected.subject}</p>
          <p className="text-[10px] mb-1" style={{ color: T.textDim }}>{selected.user_name} · {selected.user_email}</p>
          <p className="text-[10px] mb-4" style={{ color: T.textDim }}>{fmtDate(selected.created_at)}</p>
          <p className="text-xs leading-relaxed mb-5 p-3 rounded-sm" style={{ background: T.raised, color: T.text }}>{selected.body}</p>

          {/* Status actions */}
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textDim }}>Update Status</p>
          <div className="flex gap-2 mb-5">
            {(['new','in_progress','resolved'] as const).map((s) => (
              <button key={s} onClick={() => updateStatus(selected.id, s)} className="flex-1 py-1.5 rounded-sm text-[10px] font-bold transition-all" style={{ background: selected.status === s ? statusColor(s) : T.raised, color: selected.status === s ? '#000' : T.textDim, border: `1px solid ${selected.status === s ? statusColor(s) : T.border}` }}>
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Internal notes */}
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textDim }}>Internal Notes</p>
          {selected.internal_notes && (
            <div className="mb-3 p-3 rounded-sm text-xs whitespace-pre-line" style={{ background: T.raised, color: T.text }}>{selected.internal_notes}</div>
          )}
          <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={3} placeholder="Add note…" className="w-full px-3 py-2 rounded-sm text-xs outline-none resize-none mb-2" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
          <button onClick={saveNote} className="w-full py-2 rounded-sm text-xs font-bold uppercase tracking-wider" style={{ background: T.gold, color: '#000' }}>Add Note</button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ── DOCUMENTS SECTION ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const AdminDocumentsSection: React.FC = () => {
  const [docs, setDocs]           = useState<AdminDocument[]>(ALL_DOCUMENTS);
  const [typeFilter, setType]     = useState<string>('all');
  const [scopeFilter, setScope]   = useState<string>('all');
  const [yearFilter, setYear]     = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [newTitle, setNewTitle]   = useState('');
  const [newType, setNewType]     = useState<AdminDocument['type']>('legal');
  const [newScope, setNewScope]   = useState<AdminDocument['scope']>('platform');

  const TYPES = ['all','subscription','tax','distribution_notice','ppm','legal','report'];
  const SCOPES = ['all','user','deal','platform'];
  const years = ['all', ...Array.from(new Set(docs.map((d) => d.year.toString()))).sort().reverse()];

  const filtered = docs.filter((d) => {
    const tOk = typeFilter === 'all' || d.type === typeFilter;
    const sOk = scopeFilter === 'all' || d.scope === scopeFilter;
    const yOk = yearFilter === 'all' || d.year.toString() === yearFilter;
    return tOk && sOk && yOk;
  });

  const addDoc = () => {
    if (!newTitle.trim()) return;
    const nd: AdminDocument = {
      id: `adoc_${Date.now()}`, title: newTitle, type: newType, scope: newScope,
      year: new Date().getFullYear(), file_name: `${newTitle.replace(/\s+/g, '_')}.pdf`,
      size_kb: 0, uploaded_at: new Date().toISOString(),
    };
    setDocs((p) => [nd, ...p]);
    setNewTitle(''); setShowUpload(false);
  };

  const typeLabel: Record<string, string> = {
    subscription: 'Sub', tax: 'Tax', distribution_notice: 'Dist', ppm: 'PPM', legal: 'Legal', report: 'Report',
  };
  const scopeColor: Record<string, string> = { user: '#60a5fa', deal: T.gold, platform: '#a78bfa' };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Documents"
        sub={`${filtered.length} of ${docs.length} documents`}
        action={
          <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold" style={{ background: T.gold, color: '#000' }}>
            <Plus size={12} /> Upload
          </button>
        }
      />

      {showUpload && (
        <div className="p-4 rounded-sm flex flex-wrap gap-3" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Document title" className="flex-1 min-w-40 px-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }} />
          <select value={newType} onChange={(e) => setNewType(e.target.value as AdminDocument['type'])} className="px-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}>
            {TYPES.filter((t) => t !== 'all').map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={newScope} onChange={(e) => setNewScope(e.target.value as AdminDocument['scope'])} className="px-3 py-2 rounded-sm text-xs outline-none" style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}>
            {SCOPES.filter((s) => s !== 'all').map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={addDoc} className="px-3 py-2 rounded-sm text-xs font-bold" style={{ background: T.gold, color: '#000' }}><Check size={12} /></button>
          <button onClick={() => setShowUpload(false)} className="px-3 py-2 rounded-sm text-xs" style={{ background: T.raised, color: T.textDim }}><X size={12} /></button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 items-center">
          <p className="text-[10px] uppercase tracking-widest mr-1" style={{ color: T.textDim }}>Type:</p>
          {TYPES.map((t) => <button key={t} onClick={() => setType(t)} className="px-2.5 py-1 rounded-sm text-[10px] font-bold capitalize" style={{ background: typeFilter === t ? T.gold : T.surface, color: typeFilter === t ? '#000' : T.textDim, border: `1px solid ${typeFilter === t ? T.gold : T.border}` }}>{t}</button>)}
        </div>
        <div className="flex gap-1 items-center">
          <p className="text-[10px] uppercase tracking-widest mr-1" style={{ color: T.textDim }}>Scope:</p>
          {SCOPES.map((s) => <button key={s} onClick={() => setScope(s)} className="px-2.5 py-1 rounded-sm text-[10px] font-bold capitalize" style={{ background: scopeFilter === s ? T.gold : T.surface, color: scopeFilter === s ? '#000' : T.textDim, border: `1px solid ${scopeFilter === s ? T.gold : T.border}` }}>{s}</button>)}
        </div>
        <div className="flex gap-1 items-center">
          <p className="text-[10px] uppercase tracking-widest mr-1" style={{ color: T.textDim }}>Year:</p>
          {years.map((y) => <button key={y} onClick={() => setYear(y)} className="px-2.5 py-1 rounded-sm text-[10px] font-bold" style={{ background: yearFilter === y ? T.gold : T.surface, color: yearFilter === y ? '#000' : T.textDim, border: `1px solid ${yearFilter === y ? T.gold : T.border}` }}>{y}</button>)}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
        <div className="grid text-[10px] font-black uppercase tracking-widest px-4 py-2" style={{ gridTemplateColumns: '1fr auto auto auto auto', background: T.raised, color: T.textDim }}>
          <span>Title</span><span>Type</span><span>Scope</span><span>Year</span><span>Size</span>
        </div>
        {filtered.map((d) => (
          <div key={d.id} className="grid items-center px-4 py-3 transition-colors hover:bg-opacity-50" style={{ gridTemplateColumns: '1fr auto auto auto auto', borderTop: `1px solid ${T.border}` }}>
            <div>
              <p className="text-xs font-semibold" style={{ color: T.text }}>{d.title}</p>
              <p className="text-[10px]" style={{ color: T.textDim }}>{d.file_name}</p>
            </div>
            <Pill label={typeLabel[d.type] ?? d.type} color={T.textDim} />
            <span className="mx-3"><Pill label={d.scope} color={scopeColor[d.scope] ?? T.textDim} /></span>
            <span className="text-xs mx-3" style={{ color: T.textDim }}>{d.year}</span>
            <span className="text-xs" style={{ color: T.textDim }}>{d.size_kb > 0 ? `${(d.size_kb / 1000).toFixed(1)}MB` : '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ── SETTINGS SECTION ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const AdminSettingsSection: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_SETTINGS);

  return (
    <div className="max-w-xl space-y-6">
      <SectionHeader title="Settings" sub="Platform configuration" />

      <div className="p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: T.text }}>Urgent Banner</p>
            <p className="text-[10px]" style={{ color: T.textDim }}>Displays a pinned notice at the top of the investor portal.</p>
          </div>
          <button
            onClick={() => setSettings((s) => ({ ...s, urgent_banner_enabled: !s.urgent_banner_enabled }))}
            className="shrink-0 w-10 h-6 rounded-full relative transition-colors"
            style={{ background: settings.urgent_banner_enabled ? T.gold : T.border }}
          >
            <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: settings.urgent_banner_enabled ? '1.375rem' : '0.25rem' }} />
          </button>
        </div>

        {settings.urgent_banner_enabled && (
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Banner Text</label>
            <textarea
              value={settings.urgent_banner_text}
              onChange={(e) => setSettings((s) => ({ ...s, urgent_banner_text: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 rounded-sm text-xs outline-none resize-none"
              style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text }}
            />
            <div className="mt-3 px-4 py-3 rounded-sm flex items-start gap-2" style={{ background: '#f97316', opacity: 0.9 }}>
              <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#fff' }} />
              <p className="text-xs" style={{ color: '#fff' }}>{settings.urgent_banner_text}</p>
            </div>
            <p className="text-[10px]" style={{ color: T.textDim }}>Preview of how the banner will appear in the investor portal.</p>
          </div>
        )}
      </div>

      {/* Admin credentials reminder */}
      <div className="p-5 rounded-sm" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: T.text }}>Admin Credentials</p>
        <p className="text-[10px] mb-3" style={{ color: T.textDim }}>Set via environment variables in production. Defaults are pre-filled in development only.</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-xs" style={{ background: T.raised }}>
            <span style={{ color: T.gold }}>VITE_ADMIN_EMAIL</span>
            <span style={{ color: T.textDim }}>admin@axisplatform.com</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-xs" style={{ background: T.raised }}>
            <span style={{ color: T.gold }}>VITE_ADMIN_PASSWORD</span>
            <span style={{ color: T.textDim }}>••••••••••••••</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ── ADMIN PORTAL SHELL ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
type AdminView = 'dashboard' | 'users' | 'deals' | 'messages' | 'documents' | 'settings';

const NAV_ITEMS: Array<{ key: AdminView; label: string; icon: React.ElementType }> = [
  { key: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { key: 'users',      label: 'Users',      icon: Users },
  { key: 'deals',      label: 'Deals',      icon: Briefcase },
  { key: 'messages',   label: 'Messages',   icon: MessageSquare },
  { key: 'documents',  label: 'Documents',  icon: FileText },
  { key: 'settings',   label: 'Settings',   icon: Settings },
];

interface Props {
  session: AdminSession;
  onLogout: () => void;
}

export const AdminPortal: React.FC<Props> = ({ session, onLogout }) => {
  const [view, setView] = useState<AdminView>('dashboard');
  const newMsgCount = ALL_MESSAGES.filter((m) => m.status === 'new').length;

  const handleLogout = () => {
    adminLogout();
    onLogout();
  };

  return (
    <div className="min-h-screen flex" style={{ background: T.bg }}>
      {/* Sidebar */}
      <aside className="w-52 shrink-0 flex flex-col fixed top-0 left-0 h-screen" style={{ background: T.surface, borderRight: `1px solid ${T.border}` }}>
        {/* Logo */}
        <div className="p-5 pb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
              <div className="absolute inset-0.5 rotate-45 rounded-sm" style={{ background: T.surface }} />
            </div>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: T.text }}>Diversify</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] px-1.5 py-0.5 rounded" style={{ background: T.goldFaint, color: T.gold }}>Admin Portal</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-left transition-all text-xs font-semibold"
              style={{
                background: view === key ? T.goldFaint : 'transparent',
                color: view === key ? T.gold : T.textDim,
                border: `1px solid ${view === key ? T.gold + '30' : 'transparent'}`,
              }}
            >
              <Icon size={13} />
              <span>{label}</span>
              {key === 'messages' && newMsgCount > 0 && (
                <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background: T.gold, color: '#000' }}>{newMsgCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4" style={{ borderTop: `1px solid ${T.border}` }}>
          <p className="text-[10px] truncate mb-2" style={{ color: T.textDim }}>{session.email}</p>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-xs transition-colors" style={{ color: T.textDim }}>
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-52 p-8 min-h-screen overflow-y-auto">
        {view === 'dashboard'  && <AdminDashboardSection />}
        {view === 'users'      && <AdminUsersSection />}
        {view === 'deals'      && <AdminDealsSection />}
        {view === 'messages'   && <AdminMessagesSection />}
        {view === 'documents'  && <AdminDocumentsSection />}
        {view === 'settings'   && <AdminSettingsSection />}
      </main>
    </div>
  );
};
