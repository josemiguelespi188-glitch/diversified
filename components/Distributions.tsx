import React, { useState, useMemo } from 'react';
import { Card, Badge, Button, Table, TableRow, TableCell, StatCard, T } from './UIElements';
import { MOCK_DISTRIBUTIONS } from '../constants';
import { Download, TrendingUp, DollarSign, Calendar, BarChart2, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Filter = 'all' | 'monthly' | 'quarterly' | 'annual' | 'special';

const TYPE_LABEL: Record<string, string> = { monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual', special: 'Special' };
const TYPE_COLOR: Record<string, string> = { monthly: T.gold, quarterly: T.jade, annual: T.sky, special: '#A78BFA' };

export const Distributions: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    const items = filter === 'all' ? MOCK_DISTRIBUTIONS : MOCK_DISTRIBUTIONS.filter((d) => d.type === filter);
    return [...items].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortDesc ? diff : -diff;
    });
  }, [filter, sortDesc]);

  const totalReceived = MOCK_DISTRIBUTIONS.reduce((s, d) => s + d.amount, 0);
  const ytd = MOCK_DISTRIBUTIONS.filter((d) => new Date(d.date).getFullYear() === new Date().getFullYear()).reduce((s, d) => s + d.amount, 0);
  const next = MOCK_DISTRIBUTIONS.filter((d) => new Date(d.date) > new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    MOCK_DISTRIBUTIONS.forEach((d) => {
      const label = new Date(d.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      map[label] = (map[label] || 0) + d.amount;
    });
    return Object.entries(map)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => {
        const [aM, aY] = a.month.split(' ');
        const [bM, bY] = b.month.split(' ');
        return new Date(`${aM} 20${aY}`).getTime() - new Date(`${bM} 20${bY}`).getTime();
      })
      .slice(-6);
  }, []);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>Income</p>
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: T.text }}>Distributions</h1>
        </div>
        <Button variant="outline" size="sm">
          <Download size={12} /> Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Received" value={`$${totalReceived.toLocaleString()}`} sub="All time" accent="jade" />
        <StatCard label="YTD Distributions" value={`$${ytd.toLocaleString()}`} sub={`${new Date().getFullYear()}`} accent="gold" />
        <StatCard
          label="Next Expected"
          value={next ? `$${next.amount.toLocaleString()}` : '—'}
          sub={next ? `${new Date(next.date).toLocaleDateString()} · ${next.deal_name}` : 'No upcoming'}
          accent="sky"
        />
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <Card className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={13} style={{ color: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Monthly Cash Flow</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={18}>
                <XAxis dataKey="month" tick={{ fill: T.textDim, fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: T.raised, border: `1px solid ${T.border}`, color: T.text, fontSize: 11, borderRadius: 4 }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Total']}
                />
                <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? T.jade : T.gold} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distribution Table */}
        <Card noPad className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Ledger</p>
            <div className="flex gap-1 flex-wrap">
              {(['all', 'monthly', 'quarterly', 'annual', 'special'] as Filter[]).map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all"
                    style={{
                      background: active ? T.gold : T.raised,
                      color: active ? '#000' : T.textDim,
                      border: `1px solid ${active ? T.gold : T.border}`,
                    }}
                  >
                    {f === 'all' ? 'All' : TYPE_LABEL[f]}
                  </button>
                );
              })}
            </div>
          </div>

          <Table headers={['Deal', 'Date ↕', 'Type', 'Yield', 'Amount', '']}>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: T.textDim }}>No distributions found</p>
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <p className="font-black text-xs uppercase" style={{ color: T.text }}>{d.deal_name}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: T.textDim }}>#{d.deal_id}</p>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => setSortDesc((v) => !v)} className="flex items-center gap-1 text-xs" style={{ color: T.textSub }}>
                      {new Date(d.date).toLocaleDateString()}
                    </button>
                  </TableCell>
                  <TableCell>
                    <span
                      className="px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest"
                      style={{ color: TYPE_COLOR[d.type], background: `${TYPE_COLOR[d.type]}15`, border: `1px solid ${TYPE_COLOR[d.type]}40` }}
                    >
                      {TYPE_LABEL[d.type]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-xs" style={{ color: T.gold }}>{d.yield_percent}%</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-xs" style={{ color: T.jade }}>${d.amount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    {d.document_url ? (
                      <button title="Download" style={{ color: T.textDim }} className="hover:text-amber-400 transition-colors">
                        <Download size={13} />
                      </button>
                    ) : (
                      <span className="text-[9px]" style={{ color: T.textDim }}>—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
};
