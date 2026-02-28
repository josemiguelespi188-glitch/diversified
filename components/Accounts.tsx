import React, { useState } from 'react';
import { Card, Badge, Button, Input, Select, Modal, SectionHeading, T } from './UIElements';
import { Landmark, User, Briefcase, Users, ShieldCheck, AlertCircle, CheckCircle2, Plus, FileText, Clock, ChevronDown } from 'lucide-react';
import { InvestmentAccountType, DocumentStatus, InvestmentAccount, User as UserType } from '../types';

interface AccountsProps {
  user: UserType;
  accounts: InvestmentAccount[];
  onAddAccount: (data: Partial<InvestmentAccount>) => void;
  onNavigateToAccreditation: () => void;
}

const typeIcon = (type: string) => {
  if (type === InvestmentAccountType.INDIVIDUAL) return User;
  if (type === InvestmentAccountType.CORPORATION) return Briefcase;
  if (type === InvestmentAccountType.JOINT) return Users;
  if (type === InvestmentAccountType.IRA || type === InvestmentAccountType.K401) return Landmark;
  return FileText;
};

const needsEntityDoc = (type: string) =>
  [InvestmentAccountType.CORPORATION, InvestmentAccountType.IRA, InvestmentAccountType.K401,
   InvestmentAccountType.TRUST, InvestmentAccountType.REVOCABLE_TRUST].includes(type as InvestmentAccountType);

export const Accounts: React.FC<AccountsProps> = ({ user, accounts, onAddAccount, onNavigateToAccreditation }) => {
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newType, setNewType] = useState<InvestmentAccountType>(InvestmentAccountType.INDIVIDUAL);

  const idVerified = user.identity_status === DocumentStatus.VERIFIED;
  const accVerified = user.accreditation_status === DocumentStatus.VERIFIED;

  const accountStatus = (acc: InvestmentAccount) => {
    if (idVerified && accVerified && !needsEntityDoc(acc.type))
      return { label: 'Fully Verified', variant: 'jade' as const, color: T.jade };
    if (needsEntityDoc(acc.type))
      return { label: 'Docs Pending', variant: 'gold' as const, color: T.gold };
    return { label: 'In Progress', variant: 'sky' as const, color: T.sky };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Partial<InvestmentAccount> = {
      type: newType,
      display_name: fd.get('display_name') as string,
    };
    if (newType === InvestmentAccountType.CORPORATION) {
      data.entity_name = fd.get('entity_name') as string;
      data.ein = fd.get('ein') as string;
    } else if (newType === InvestmentAccountType.IRA || newType === InvestmentAccountType.K401) {
      data.custodian_name = fd.get('custodian_name') as string;
      data.account_number = fd.get('account_number') as string;
    } else if (newType === InvestmentAccountType.TRUST || newType === InvestmentAccountType.REVOCABLE_TRUST) {
      data.trust_name = fd.get('trust_name') as string;
    }
    onAddAccount(data);
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>Investment Ledger</p>
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: T.text }}>Accounts</h1>
        </div>
        <Badge variant="jade">{accounts.length} Active</Badge>
      </div>

      {/* Account List */}
      <div className="space-y-2">
        {accounts.map((acc) => {
          const status = accountStatus(acc);
          const isOpen = expanded === acc.id;
          const Icon = typeIcon(acc.type);

          return (
            <div key={acc.id} className="rounded-sm overflow-hidden" style={{ border: `1px solid ${isOpen ? T.gold + '40' : T.border}` }}>
              <button
                onClick={() => setExpanded(isOpen ? null : acc.id)}
                className="w-full flex items-center justify-between p-5 transition-all text-left"
                style={{ background: isOpen ? T.goldFaint : T.surface }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center transition-colors"
                    style={{
                      background: isOpen ? T.goldFaint : T.raised,
                      border: `1px solid ${isOpen ? T.gold + '40' : T.border}`,
                    }}
                  >
                    <Icon size={18} style={{ color: isOpen ? T.gold : T.textDim }} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide" style={{ color: T.text }}>{acc.display_name}</p>
                    <p className="text-[9px] mt-0.5 uppercase tracking-widest" style={{ color: T.textDim }}>
                      {acc.type} · ID: {acc.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <ChevronDown
                    size={14}
                    style={{ color: T.textDim, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="p-6" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: T.textSub }}>
                        <ShieldCheck size={12} style={{ color: T.gold }} /> Compliance Matrix
                      </p>
                      {[
                        { label: 'Global Identity', status: user.identity_status || DocumentStatus.NOT_UPLOADED },
                        { label: 'Accreditation', status: user.accreditation_status || DocumentStatus.NOT_UPLOADED },
                      ].map((row) => (
                        <StatusRow key={row.label} label={row.label} status={row.status} inherited />
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div
                        className="p-4 rounded-sm text-xs leading-relaxed"
                        style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.textSub }}
                      >
                        This account inherits your global identity and accreditation profile. Additional entity documents may be required to unlock full allocation capacity.
                      </div>
                      <Button variant="outline" onClick={onNavigateToAccreditation} className="w-full">
                        Visit Compliance Hub
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Account */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-5 rounded-sm flex items-center justify-center gap-3 transition-all"
        style={{ border: `1px dashed ${T.gold}40`, background: T.goldFaint }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}80`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${T.gold}40`; }}
      >
        <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: T.gold }}>
          <Plus size={14} style={{ color: '#000' }} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: T.gold }}>
          Add Investment Account
        </span>
      </button>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Initialize New Ledger" width="max-w-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Select label="Account Type" value={newType} onChange={(e) => setNewType(e.target.value as InvestmentAccountType)}>
            {Object.values(InvestmentAccountType).map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>

          <Input label="Ledger Display Name" name="display_name" required placeholder="e.g. Family Office" />

          {newType === InvestmentAccountType.CORPORATION && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Legal Entity Name" name="entity_name" required />
              <Input label="EIN / Tax ID" name="ein" required />
            </div>
          )}

          {(newType === InvestmentAccountType.IRA || newType === InvestmentAccountType.K401) && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Custodian Name" name="custodian_name" required />
              <Input label="Account Number" name="account_number" required />
            </div>
          )}

          {(newType === InvestmentAccountType.TRUST || newType === InvestmentAccountType.REVOCABLE_TRUST) && (
            <Input label="Full Legal Trust Name" name="trust_name" required />
          )}

          <div className="p-3 rounded-sm text-[10px] leading-relaxed" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30`, color: T.textSub }}>
            New accounts automatically inherit your global identity and accreditation profile.
          </div>

          <Button type="submit" className="w-full" size="lg">Create Ledger</Button>
        </form>
      </Modal>
    </div>
  );
};

const StatusRow: React.FC<{ label: string; status: DocumentStatus; inherited?: boolean }> = ({ label, status, inherited }) => {
  const verified = status === DocumentStatus.VERIFIED;
  const pending = status === DocumentStatus.UNDER_REVIEW;
  return (
    <div className="flex items-center justify-between p-3 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
      <div className="flex items-center gap-2">
        {verified ? <CheckCircle2 size={12} style={{ color: T.jade }} /> : pending ? <Clock size={12} style={{ color: T.gold }} /> : <AlertCircle size={12} style={{ color: T.ruby }} />}
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {inherited && <Badge variant="sky">Inherited</Badge>}
        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: verified ? T.jade : pending ? T.gold : T.ruby }}>
          {status}
        </span>
      </div>
    </div>
  );
};
