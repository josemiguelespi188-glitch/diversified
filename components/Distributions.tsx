
import React, { useState, useMemo } from 'react';
import { Card, Badge, Button } from './UIElements';
import { Distribution } from '../types';
import { MOCK_DISTRIBUTIONS } from '../constants';
import { Download, TrendingUp, DollarSign, Calendar, ChevronDown, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type FilterType = 'all' | 'monthly' | 'quarterly' | 'annual' | 'special';

const TYPE_LABEL: Record<string, string> = {
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
  special: 'Special'
};

const TYPE_COLOR: Record<string, string> = {
  monthly: '#2F80ED',
  quarterly: '#00E0C6',
  annual: '#56CCF2',
  special: '#F59E0B'
};

export const Distributions: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    let items = filter === 'all'
      ? MOCK_DISTRIBUTIONS
      : MOCK_DISTRIBUTIONS.filter(d => d.type === filter);
    return [...items].sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortDesc ? diff : -diff;
    });
  }, [filter, sortDesc]);

  const totalReceived = MOCK_DISTRIBUTIONS.reduce((s, d) => s + d.amount, 0);

  const ytdTotal = MOCK_DISTRIBUTIONS.filter(d => {
    const year = new Date(d.date).getFullYear();
    return year === new Date().getFullYear();
  }).reduce((s, d) => s + d.amount, 0);

  const nextExpected = MOCK_DISTRIBUTIONS
    .filter(d => new Date(d.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Chart: last 6 months aggregated
  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    MOCK_DISTRIBUTIONS.forEach(d => {
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

  const filterButtons: FilterType[] = ['all', 'monthly', 'quarterly', 'annual', 'special'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Distributions</h1>
          <p className="text-[#8FAEDB] text-sm uppercase tracking-widest font-medium opacity-60">
            Cash flow history & projected payments
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 text-[10px]" onClick={() => {}}>
          <Download size={14} /> Export CSV
        </Button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col gap-2 border-white/5 hover:border-[#2F80ED]/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">Total Received</span>
            <DollarSign size={16} className="text-[#00E0C6]" />
          </div>
          <span className="text-2xl font-bold text-[#00E0C6]">${totalReceived.toLocaleString()}</span>
          <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">All time</span>
        </Card>

        <Card className="flex flex-col gap-2 border-white/5 hover:border-[#2F80ED]/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">YTD Distributions</span>
            <TrendingUp size={16} className="text-[#2F80ED]" />
          </div>
          <span className="text-2xl font-bold text-white">${ytdTotal.toLocaleString()}</span>
          <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">{new Date().getFullYear()}</span>
        </Card>

        <Card className="flex flex-col gap-2 border-white/5 hover:border-[#2F80ED]/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">Next Expected</span>
            <Calendar size={16} className="text-yellow-500" />
          </div>
          {nextExpected ? (
            <>
              <span className="text-2xl font-bold text-yellow-500">${nextExpected.amount.toLocaleString()}</span>
              <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">
                {new Date(nextExpected.date).toLocaleDateString()} — {nextExpected.deal_name}
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-[#8FAEDB]/40">—</span>
              <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">No upcoming payments</span>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={16} className="text-[#2F80ED]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Monthly Cash Flow</h3>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#8FAEDB', fontSize: 9, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2A4A', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Total']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? '#00E0C6' : '#2F80ED'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distribution Table */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Distribution Ledger</h3>
            <div className="flex flex-wrap gap-1">
              {filterButtons.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-[#2F80ED] text-white' : 'bg-white/5 text-[#8FAEDB] hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'All' : TYPE_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#8FAEDB] uppercase text-[9px] tracking-[0.2em] border-b border-white/5">
                <tr>
                  <th className="pb-4 font-bold">Deal</th>
                  <th className="pb-4 font-bold">
                    <button
                      onClick={() => setSortDesc(v => !v)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      Date <ChevronDown size={10} className={`transition-transform ${sortDesc ? '' : 'rotate-180'}`} />
                    </button>
                  </th>
                  <th className="pb-4 font-bold">Type</th>
                  <th className="pb-4 font-bold">Yield</th>
                  <th className="pb-4 font-bold text-right">Amount</th>
                  <th className="pb-4 font-bold text-right">Notice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <p className="text-[10px] text-[#8FAEDB]/40 uppercase tracking-widest">No distributions found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map(d => (
                    <tr key={d.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <span className="block font-bold text-white text-sm uppercase tracking-tight">{d.deal_name}</span>
                        <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest opacity-60">#{d.deal_id}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-white text-sm font-medium">{new Date(d.date).toLocaleDateString()}</span>
                      </td>
                      <td className="py-4">
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border"
                          style={{
                            color: TYPE_COLOR[d.type],
                            borderColor: TYPE_COLOR[d.type] + '40',
                            background: TYPE_COLOR[d.type] + '10'
                          }}
                        >
                          {TYPE_LABEL[d.type]}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-[#2F80ED] font-bold text-sm">{d.yield_percent}%</span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-[#00E0C6] font-bold text-sm">${d.amount.toLocaleString()}</span>
                      </td>
                      <td className="py-4 text-right">
                        {d.document_url ? (
                          <button
                            className="p-2 text-[#8FAEDB] hover:text-[#2F80ED] transition-colors"
                            title="Download distribution notice"
                          >
                            <Download size={14} />
                          </button>
                        ) : (
                          <span className="text-[9px] text-[#8FAEDB]/30 uppercase">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
