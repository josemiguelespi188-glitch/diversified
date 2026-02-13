
import React, { useState, useMemo, useEffect } from 'react';
import { Card, Badge, Button } from './UIElements';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Users, Building, ShieldCheck, FileText, Download, PieChart as PieChartIcon, ChevronDown } from 'lucide-react';
import { Deal, InvestmentRequest, RequestStatus } from '../types';
import { MOCK_ACCOUNTS, MOCK_REQUESTS } from '../constants';

const STRATEGY_COLORS: Record<string, string> = {
  'Multifamily': '#2F80ED',
  'Industrial': '#00E0C6',
  'Private Debt': '#56CCF2',
  'Development': '#1457B6',
  'Other': '#8FAEDB'
};

interface DashboardProps {
  onAllocate: (deal: Deal) => void;
  onViewPortfolio: () => void;
  requests?: InvestmentRequest[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onAllocate, onViewPortfolio, requests: initialRequests }) => {
  const [activeAccountFilter, setActiveAccountFilter] = useState<string>('all');
  // State to manage requests locally for real-time status updates in the MVP environment
  const [ledgerRequests, setLedgerRequests] = useState<InvestmentRequest[]>([]);

  // Initialize ledger requests with provided requests or default mock data
  useEffect(() => {
    if (initialRequests && initialRequests.length > 0) {
      setLedgerRequests(initialRequests);
    } else {
      setLedgerRequests(MOCK_REQUESTS);
    }
  }, [initialRequests]);

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setLedgerRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
  };

  // Filter requests based on selected account
  const filteredRequests = useMemo(() => {
    if (activeAccountFilter === 'all') return ledgerRequests;
    return ledgerRequests.filter(req => req.account_id === activeAccountFilter);
  }, [ledgerRequests, activeAccountFilter]);

  // COMPUTE METRICS IN REAL-TIME
  const metrics = useMemo(() => {
    // Logic as per user request:
    // - Total Commitment: Sum only orders with status = Completed
    // - Pending Allocation: Sum all orders with status = Waiting for Allocation
    // - Diversified Deals: Unique deals with at least one Completed allocation
    // - Average IRR: Weighted average based only on Completed allocations
    // - Strategy Diversification: Using only Completed allocations
    
    const completedRequests = filteredRequests.filter(r => r.status === RequestStatus.FUNDED);
    const waitingRequests = filteredRequests.filter(r => r.status === RequestStatus.UNDER_REVIEW);

    // 1. Total Commitment
    const totalCommitment = completedRequests.reduce((sum, r) => sum + r.amount, 0);

    // 2. Diversified Deals (Unique deal count with Completed status)
    const uniqueDealIds = new Set(completedRequests.map(r => r.deal_id));
    const diversifiedDealsCount = uniqueDealIds.size;

    // 3. Pending Allocation
    const pendingAllocation = waitingRequests.reduce((sum, r) => sum + r.amount, 0);

    // 4. Weighted Average IRR
    let weightedIrr = 0;
    if (totalCommitment > 0) {
      const totalWeightedIrr = completedRequests.reduce((sum, r) => {
        const irr = r.projected_irr || 0;
        return sum + (r.amount * irr);
      }, 0);
      weightedIrr = totalWeightedIrr / totalCommitment;
    }

    // 5. Strategy Diversification
    const strategyMap: Record<string, { name: string, value: number, capital: number }> = {};
    completedRequests.forEach(r => {
      const strategy = r.strategy || 'Other';
      if (!strategyMap[strategy]) {
        strategyMap[strategy] = { name: strategy, value: 0, capital: 0 };
      }
      strategyMap[strategy].capital += r.amount;
    });

    const strategyData = Object.values(strategyMap).map(s => ({
      ...s,
      value: totalCommitment > 0 ? (s.capital / totalCommitment) * 100 : 0,
      color: STRATEGY_COLORS[s.name] || STRATEGY_COLORS['Other']
    }));

    return {
      totalCommitment,
      diversifiedDealsCount,
      pendingAllocation,
      weightedIrr,
      strategyData
    };
  }, [filteredRequests]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Command Center</h1>
          <p className="text-[#8FAEDB] text-sm uppercase tracking-widest font-medium opacity-60">Portfolio Overview & Private Ledger</p>
        </div>

        {/* Account Toggle System */}
        <div className="flex flex-wrap items-center bg-white/5 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveAccountFilter('all')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
              activeAccountFilter === 'all' ? 'bg-[#2F80ED] text-white shadow-lg shadow-[#2F80ED]/20' : 'text-[#8FAEDB] hover:text-white'
            }`}
          >
            All Accounts
          </button>
          {MOCK_ACCOUNTS.map(acc => (
            <button
              key={acc.id}
              onClick={() => setActiveAccountFilter(acc.id)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${
                activeAccountFilter === acc.id ? 'bg-[#2F80ED] text-white shadow-lg shadow-[#2F80ED]/20' : 'text-[#8FAEDB] hover:text-white'
              }`}
            >
              {acc.type}
            </button>
          ))}
        </div>
      </header>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col gap-2 border-white/5 hover:border-[#2F80ED]/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">Total Committed</span>
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white transition-all duration-500">
            ${metrics.totalCommitment.toLocaleString()}
          </span>
          <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">Settled Funds</span>
        </Card>

        <Card className="flex flex-col gap-2 border-white/5 hover:border-[#2F80ED]/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">Diversified Deals</span>
            <Building size={16} className="text-[#00E0C6]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#00E0C6] transition-all duration-500">
            {metrics.diversifiedDealsCount} {metrics.diversifiedDealsCount === 1 ? 'Deal' : 'Deals'}
          </span>
          <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">
            {metrics.diversifiedDealsCount === 0 ? 'No active allocations' : 'Unique Project IDs'}
          </span>
        </Card>

        <Card className="flex flex-col gap-2 border-white/5 hover:border-[#2F80ED]/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">Pending Allocation</span>
            <Users size={16} className="text-yellow-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-yellow-500 transition-all duration-500">
            ${metrics.pendingAllocation.toLocaleString()}
          </span>
          <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">
            {metrics.pendingAllocation === 0 ? 'No pending allocations' : 'Awaiting Committee'}
          </span>
        </Card>

        <Card className="flex flex-col gap-2 border-white/5 hover:border-[#2F80ED]/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">Avg Weighted IRR</span>
            <ShieldCheck size={16} className="text-[#2F80ED]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#2F80ED] transition-all duration-500">
            {metrics.totalCommitment > 0 ? `${metrics.weightedIrr.toFixed(1)}%` : '—'}
          </span>
          <span className="text-[9px] text-[#8FAEDB] uppercase font-bold opacity-50">
            {metrics.totalCommitment > 0 ? 'Portfolio Wide' : 'No active portfolio'}
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Diversification Card */}
        <Card className="lg:col-span-1 flex flex-col h-auto min-h-[400px]">
          <h3 className="text-xs font-bold text-white mb-6 uppercase tracking-[0.2em] opacity-80">Strategy Diversification</h3>
          
          {metrics.strategyData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center gap-4">
               <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#8FAEDB] flex items-center justify-center">
                  <PieChartIcon size={24} />
               </div>
               <p className="text-[10px] uppercase tracking-widest font-bold">No active allocations yet</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.strategyData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {metrics.strategyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F2A4A', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col gap-3">
                {metrics.strategyData.sort((a,b) => b.capital - a.capital).map((s, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                      <span className="text-[10px] text-[#8FAEDB] uppercase tracking-widest font-bold group-hover:text-white transition-colors">{s.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-white font-bold">{s.value.toFixed(1)}%</span>
                      <span className="block text-[8px] text-[#8FAEDB] font-medium opacity-60">${s.capital.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Allocations Ledger */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] opacity-80">Allocation Ledger</h3>
            <Badge variant="info">Institutional Feed</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[#8FAEDB] uppercase text-[9px] tracking-[0.2em] border-b border-white/5">
                <tr>
                  <th className="pb-4 font-bold">Project / Account</th>
                  <th className="pb-4 font-bold">Allocation</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold text-right">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-30">
                         <FileText size={40} />
                         <p className="text-[10px] uppercase tracking-widest font-bold">No records in the current view</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((row) => (
                    <tr key={row.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-5">
                        <span className="block font-bold text-white uppercase tracking-tight text-sm">{row.deal_name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest">{MOCK_ACCOUNTS.find(a => a.id === row.account_id)?.type}</span>
                           <span className="text-[9px] text-[#8FAEDB]/40">•</span>
                           <span className="text-[9px] text-[#2F80ED] uppercase tracking-widest font-bold">{row.strategy}</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-white font-bold">${row.amount.toLocaleString()}</span>
                        <span className="block text-[9px] text-[#8FAEDB] uppercase tracking-widest opacity-60">{new Date(row.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="py-5">
                        <div className="relative inline-block group/select">
                          <select
                            value={row.status}
                            onChange={(e) => handleStatusChange(row.id, e.target.value)}
                            className={`appearance-none bg-[#0F2A4A] border border-white/10 rounded px-2 py-1 pr-8 text-[10px] font-bold uppercase tracking-widest cursor-pointer focus:border-[#2F80ED] focus:outline-none transition-all ${
                              row.status === RequestStatus.FUNDED ? 'text-[#00E0C6] border-[#00E0C6]/30' :
                              row.status === RequestStatus.UNDER_REVIEW ? 'text-yellow-500 border-yellow-500/30' :
                              'text-[#8FAEDB] border-white/10'
                            }`}
                          >
                            <option value={RequestStatus.PENDING_FUNDING}>{RequestStatus.PENDING_FUNDING}</option>
                            <option value={RequestStatus.UNDER_REVIEW}>{RequestStatus.UNDER_REVIEW}</option>
                            <option value={RequestStatus.FUNDED}>{RequestStatus.FUNDED}</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                        </div>
                      </td>
                      <td className="py-5 text-right">
                        <button className="p-2 text-[#8FAEDB] hover:text-[#2F80ED] transition-colors" title="Download Subscription PDF">
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Embedded Portfolio Section */}
      <div className="pt-12 border-t border-white/5">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Active Opportunities</h2>
            <p className="text-[#8FAEDB] text-xs uppercase tracking-widest opacity-60 mt-1">Institutional Deal Flow</p>
          </div>
          <Button variant="outline" onClick={onViewPortfolio} className="text-[10px] px-6">Marketplace</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {metrics.strategyData.slice(0, 3).map((s, idx) => (
             <Card key={idx} className="p-4 bg-white/5 border-white/5 flex gap-4 items-center">
                <div className="w-16 h-16 rounded overflow-hidden">
                   <img src={`https://images.unsplash.com/photo-${1545324418 + idx}-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200`} alt="Deal" className="w-full h-full object-cover" />
                </div>
                <div>
                   <span className="block text-[10px] font-bold text-white uppercase tracking-wider">{s.name} Series {idx + 1}</span>
                   <span className="text-[9px] text-[#2F80ED] font-bold">18.4% Est. IRR</span>
                   <button onClick={onViewPortfolio} className="block text-[9px] text-[#8FAEDB] uppercase tracking-widest mt-1 hover:text-white">View Details →</button>
                </div>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
};
