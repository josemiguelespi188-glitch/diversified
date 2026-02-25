
import React, { useState } from 'react';
import { Card, Badge, Button } from './UIElements';
import { 
  Landmark, 
  User, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  X, 
  FileText,
  Clock,
  ChevronDown
} from 'lucide-react';
import { InvestmentAccountType, DocumentStatus, InvestmentAccount, User as UserType } from '../types';

interface AccountsProps {
  user: UserType;
  accounts: InvestmentAccount[];
  onAddAccount: (data: Partial<InvestmentAccount>) => void;
  onNavigateToAccreditation: () => void;
}

export const Accounts: React.FC<AccountsProps> = ({ user, accounts, onAddAccount, onNavigateToAccreditation }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [newAccountType, setNewAccountType] = useState<InvestmentAccountType>(InvestmentAccountType.INDIVIDUAL);

  const globalIdentityVerified = user.identity_status === DocumentStatus.VERIFIED;
  const globalAccreditationVerified = user.accreditation_status === DocumentStatus.VERIFIED;

  const getAccountStatus = (acc: InvestmentAccount) => {
    // Individual inherits everything, others might need specific docs
    const needsSpecificDoc = 
      acc.type === InvestmentAccountType.CORPORATION || 
      acc.type === InvestmentAccountType.IRA || 
      acc.type === InvestmentAccountType.TRUST || 
      acc.type === InvestmentAccountType.REVOCABLE_TRUST ||
      acc.type === InvestmentAccountType.K401;
    
    if (globalIdentityVerified && globalAccreditationVerified && !needsSpecificDoc) {
      return { label: 'Fully Verified', variant: 'success' as const, color: '#00E0C6' };
    }
    
    if (needsSpecificDoc) {
      return { label: 'Pending Additional Documents', variant: 'warning' as const, color: '#F59E0B' };
    }
    
    return { label: 'Partially Verified', variant: 'info' as const, color: '#2F80ED' };
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {
      type: newAccountType,
      display_name: formData.get('display_name') as string,
    };

    if (newAccountType === InvestmentAccountType.CORPORATION) {
      data.entity_name = formData.get('entity_name');
      data.ein = formData.get('ein');
    } else if (newAccountType === InvestmentAccountType.IRA || newAccountType === InvestmentAccountType.K401) {
      data.custodian_name = formData.get('custodian_name');
      data.account_number = formData.get('account_number');
    } else if (newAccountType === InvestmentAccountType.TRUST || newAccountType === InvestmentAccountType.REVOCABLE_TRUST) {
      data.trust_name = formData.get('trust_name');
    }

    onAddAccount(data);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Investment Accounts</h1>
          <p className="text-[#8FAEDB] text-sm uppercase tracking-widest font-medium opacity-60">Manage Legal Entities & Investment Ledgers</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="success">{accounts.length} Active Accounts</Badge>
        </div>
      </header>

      <section className="space-y-4">
        {accounts.map((acc) => {
          const status = getAccountStatus(acc);
          const isExpanded = expandedAccount === acc.id;
          
          return (
            <div key={acc.id} className="space-y-1">
              <button 
                onClick={() => setExpandedAccount(isExpanded ? null : acc.id)}
                className={`w-full text-left glass-panel p-5 rounded-xl border transition-all flex items-center justify-between group ${
                  isExpanded ? 'border-[#2F80ED]/40 bg-[#2F80ED]/5' : 'border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors ${
                    isExpanded ? 'bg-[#2F80ED]/20 text-[#2F80ED] border-[#2F80ED]/30' : 'bg-white/5 text-[#8FAEDB] border-white/10'
                  }`}>
                    {acc.type === InvestmentAccountType.INDIVIDUAL && <User size={24} />}
                    {acc.type === InvestmentAccountType.CORPORATION && <Briefcase size={24} />}
                    {acc.type === InvestmentAccountType.JOINT && <Users size={24} />}
                    {(acc.type === InvestmentAccountType.IRA || acc.type === InvestmentAccountType.K401) && <Landmark size={24} />}
                    {(acc.type === InvestmentAccountType.TRUST || acc.type === InvestmentAccountType.REVOCABLE_TRUST) && <FileText size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{acc.display_name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#8FAEDB] uppercase tracking-widest font-bold opacity-60">{acc.type}</span>
                      <span className="text-[8px] text-[#8FAEDB]/30">•</span>
                      <span className="text-[10px] text-[#8FAEDB] uppercase tracking-widest font-bold opacity-60">ID: {acc.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                     <span className={`block text-[10px] font-bold uppercase tracking-widest`} style={{ color: status.color }}>{status.label}</span>
                     <span className="text-[8px] text-[#8FAEDB]/50 uppercase tracking-widest">Compliance Status</span>
                  </div>
                  <ChevronDown size={20} className={`text-[#8FAEDB] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="mx-2 p-6 bg-white/5 border-x border-b border-white/5 rounded-b-xl animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck size={14} className="text-[#2F80ED]" />
                          Ledger Compliance Matrix
                       </h4>
                       <div className="space-y-2">
                          <StatusRow label="Global Identity Verification" status={user.identity_status || DocumentStatus.NOT_UPLOADED} inherited />
                          <StatusRow label="Accreditation Certificate" status={user.accreditation_status || DocumentStatus.NOT_UPLOADED} inherited />
                          
                          {acc.type === InvestmentAccountType.CORPORATION && (
                            <StatusRow label="Articles of Incorporation" status={DocumentStatus.NOT_UPLOADED} />
                          )}
                          {(acc.type === InvestmentAccountType.IRA || acc.type === InvestmentAccountType.K401) && (
                            <StatusRow label="Custodian Confirmation" status={DocumentStatus.NOT_UPLOADED} />
                          )}
                          {(acc.type === InvestmentAccountType.TRUST || acc.type === InvestmentAccountType.REVOCABLE_TRUST) && (
                            <StatusRow label="Trust Agreement" status={DocumentStatus.NOT_UPLOADED} />
                          )}
                       </div>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                       <div className="p-4 rounded-lg bg-black/20 border border-white/5 space-y-2">
                          <p className="text-[10px] text-white font-bold uppercase tracking-widest">Institutional Note</p>
                          <p className="text-[10px] text-[#8FAEDB] leading-relaxed">
                             This account inherits documents from your Global Profile. If additional entity papers are needed, 
                             they must be uploaded to unlock full allocation capacity.
                          </p>
                       </div>
                       <Button onClick={onNavigateToAccreditation} variant="outline" className="w-full text-[10px]">
                          Visit Compliance Hub
                       </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </section>

        <div className="pt-6">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full group py-6 rounded-xl border border-dashed border-[#00E0C6]/30 bg-[#00E0C6]/5 hover:bg-[#00E0C6]/10 hover:border-[#00E0C6]/60 transition-all flex items-center justify-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#00E0C6]/20 flex items-center justify-center text-[#00E0C6] group-hover:cyan-glow">
              <Plus size={20} />
            </div>
            <span className="text-sm font-bold text-[#00E0C6] uppercase tracking-[0.2em]">Add New Investment Account</span>
          </button>
        </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081C3A]/90 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
          <Card className="relative w-full max-w-lg p-0 overflow-hidden border-[#2F80ED]/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F2A4A]/50">
               <div>
                  <h2 className="text-lg font-bold text-white tracking-tight uppercase">Initialize Ledger</h2>
                  <p className="text-[10px] text-[#8FAEDB] uppercase tracking-widest font-bold">New Institutional Entity</p>
               </div>
               <button onClick={() => setShowAddModal(false)} className="text-[#8FAEDB] hover:text-white transition-colors p-2">
                  <X size={20} />
               </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-8 space-y-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Select Account Type</label>
                  <select 
                    name="type" 
                    required 
                    className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-[#2F80ED] outline-none appearance-none"
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value as InvestmentAccountType)}
                  >
                    {Object.values(InvestmentAccountType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Ledger Display Name</label>
                  <input name="display_name" required type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-sm focus:border-[#2F80ED] outline-none" placeholder="e.g. Vanderbilt Family Office" />
               </div>

               {/* Conditional Fields */}
               {newAccountType === InvestmentAccountType.CORPORATION && (
                 <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Legal Entity Name</label>
                      <input name="entity_name" required type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-xs" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">EIN / Tax ID</label>
                      <input name="ein" required type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-xs" />
                   </div>
                 </div>
               )}

               {(newAccountType === InvestmentAccountType.IRA || newAccountType === InvestmentAccountType.K401) && (
                 <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Custodian Name</label>
                      <input name="custodian_name" required type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-xs" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Account Number</label>
                      <input name="account_number" required type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-xs" />
                   </div>
                 </div>
               )}

               {(newAccountType === InvestmentAccountType.TRUST || newAccountType === InvestmentAccountType.REVOCABLE_TRUST) && (
                 <div className="space-y-1.5 animate-in slide-in-from-top-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Full Legal Trust Name</label>
                    <input name="trust_name" required type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-xs" />
                 </div>
               )}

               <div className="p-4 bg-[#2F80ED]/5 border border-[#2F80ED]/20 rounded text-[10px] text-[#8FAEDB] leading-relaxed italic">
                 New accounts will automatically inherit your verified Global Identity and Accreditation status. 
                 Additional entity documents may be required to complete the ledger verification.
               </div>

               <Button type="submit" className="w-full py-4 uppercase tracking-[0.2em] text-sm bg-[#00E0C6] hover:bg-[#00E0C6]/80 text-[#081C3A]">Create Investment Ledger</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

const StatusRow: React.FC<{ label: string, status: DocumentStatus, inherited?: boolean }> = ({ label, status, inherited }) => {
  const isVerified = status === DocumentStatus.VERIFIED;
  const isPending = status === DocumentStatus.UNDER_REVIEW;
  
  return (
    <div className="flex items-center justify-between p-2.5 rounded bg-white/5 border border-white/5">
      <div className="flex items-center gap-2">
        {isVerified ? (
          <CheckCircle2 size={12} className="text-[#00E0C6]" />
        ) : isPending ? (
          <Clock size={12} className="text-yellow-500" />
        ) : (
          <AlertCircle size={12} className="text-red-500" />
        )}
        <span className="text-[10px] text-[#8FAEDB] uppercase tracking-wider font-bold">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {inherited && (
          <span className="text-[8px] bg-[#2F80ED]/10 text-[#2F80ED] px-1.5 py-0.5 rounded border border-[#2F80ED]/20 uppercase font-bold tracking-tighter">Inherited</span>
        )}
        <span className={`text-[8px] uppercase tracking-widest font-bold ${
          isVerified ? 'text-[#00E0C6]' : isPending ? 'text-yellow-500' : 'text-red-400'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};
