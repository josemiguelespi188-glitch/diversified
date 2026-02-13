
import React, { useState } from 'react';
import { Deal, InvestmentAccountType, RequestStatus, DocumentStatus } from '../types';
import { MOCK_ACCOUNTS } from '../constants';
import { Card, Button, Badge } from './UIElements';
// Added ChevronDown to imports to fix "Cannot find name 'ChevronDown'" errors
import { X, CheckCircle2, ChevronRight, ChevronDown, Landmark, FileText, CreditCard, Shield, AlertTriangle, Building2, Copy, Info } from 'lucide-react';

interface InvestmentModalProps {
  deal: Deal;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onComplete?: () => void;
  userFullName?: string;
}

type FundingMethod = 'WIRE' | 'ACH' | 'CC' | 'IRA';

export const InvestmentModal: React.FC<InvestmentModalProps> = ({ deal, onClose, onSubmit, onComplete, userFullName = "Alexander Vanderbilt" }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(deal.minimum_investment);
  const [account, setAccount] = useState(MOCK_ACCOUNTS[0].id);
  const [fundingMethod, setFundingMethod] = useState<FundingMethod | null>(null);
  const [iraAcknowledged, setIraAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulated Verification Check (MVP logic)
  const isAccountVerified = (accountId: string) => {
    return accountId === 'acc_ind'; 
  };

  const handleNext = () => {
    if (step === 1 && !isAccountVerified(account)) {
      setStep(99); // Error state
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Institutional simulation delay
    await new Promise(r => setTimeout(r, 2000));
    onSubmit({ 
      dealId: deal.id, 
      dealName: deal.title,
      amount, 
      accountId: account,
      status: 'Pending Funding'
    });
    setStep(5);
    setIsSubmitting(false);
  };

  const steps = [
    { id: 1, label: 'Investing Account' },
    { id: 2, label: 'Allocation' },
    { id: 3, label: 'Disclosure' },
    { id: 4, label: 'Funding' },
    { id: 5, label: 'Confirmation' },
  ];

  const canConfirmFunding = fundingMethod && (fundingMethod !== 'IRA' || iraAcknowledged) && !isSubmitting;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#081C3A]/95 backdrop-blur-md" onClick={onClose}></div>
      
      <Card className="relative w-full max-w-xl p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-[#2F80ED]/20 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F2A4A]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#2F80ED]/10 flex items-center justify-center text-[#2F80ED] border border-[#2F80ED]/20">
              <Landmark size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight uppercase">Capital Allocation</h2>
              <p className="text-xs text-[#8FAEDB]">{deal.title} • <span className="text-[#2F80ED]">{deal.strategy}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8FAEDB] hover:text-white transition-colors p-2">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar (Hidden in error state) */}
        {step !== 99 && (
          <div className="flex border-b border-white/5 shrink-0">
            {steps.map((s) => (
              <div key={s.id} className="flex-1 h-1 relative">
                <div className={`absolute inset-0 transition-all duration-500 ${step >= s.id ? 'bg-[#2F80ED] cyan-glow' : 'bg-white/5'}`}></div>
              </div>
            ))}
          </div>
        )}

        <div className="p-8 overflow-y-auto">
          {step === 99 && (
            <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                  <AlertTriangle size={40} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">Accreditation Required</h2>
                <p className="text-[#8FAEDB] text-sm max-w-sm mx-auto leading-relaxed">
                  Your selected account (<span className="text-white font-bold">{MOCK_ACCOUNTS.find(a => a.id === account)?.display_name}</span>) is not fully verified. Institutional compliance requires full verification before allocation requests.
                </p>
              </div>
              <div className="pt-6 flex flex-col gap-3">
                <Button onClick={onClose} variant="primary" className="w-full py-4 text-sm">Complete Accreditation</Button>
                <button onClick={() => setStep(1)} className="text-[10px] text-[#8FAEDB] uppercase tracking-widest font-bold hover:text-white">Change Investing Account</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <label className="text-[10px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">Step 1: Select Investing Account</label>
              <div className="grid grid-cols-1 gap-3">
                {MOCK_ACCOUNTS.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => setAccount(acc.id)}
                    className={`p-5 rounded-lg border text-left transition-all group ${
                      account === acc.id 
                        ? 'border-[#2F80ED] bg-[#2F80ED]/5 text-white ring-1 ring-[#2F80ED]/50' 
                        : 'border-white/5 bg-white/5 text-[#8FAEDB] hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold uppercase tracking-wider block">{acc.display_name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[#8FAEDB] uppercase tracking-widest">ID: {acc.id}</span>
                          {!isAccountVerified(acc.id) && <span className="text-[8px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20 uppercase font-bold">Unverified</span>}
                        </div>
                      </div>
                      <Badge variant="info">{acc.type}</Badge>
                    </div>
                  </button>
                ))}
              </div>
              <Button onClick={handleNext} className="w-full py-4 text-sm">Proceed to Allocation Amount <ChevronRight size={16} className="inline ml-1"/></Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">Step 2: Enter Allocation Amount</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2F80ED] font-bold text-3xl">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#081C3A] border border-white/10 rounded-lg py-6 pl-12 pr-6 text-4xl font-bold text-white outline-none focus:border-[#2F80ED] focus:ring-1 focus:ring-[#2F80ED]/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-[#8FAEDB] tracking-widest font-bold block">Est. Annual Yield</span>
                    <span className="text-xl font-bold text-[#00E0C6]">${(amount * (deal.cash_yield / 100)).toLocaleString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase text-[#8FAEDB] tracking-widest font-bold block">Target IRR</span>
                    <span className="text-xl font-bold text-[#2F80ED]">{deal.projected_irr}%</span>
                  </div>
                </div>
                <div className="text-[9px] text-[#8FAEDB] uppercase tracking-[0.15em] font-bold text-center">
                  Minimum Investment: <span className="text-white">${deal.minimum_investment.toLocaleString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="outline" onClick={handleBack} className="py-4">Back</Button>
                <Button onClick={handleNext} disabled={amount < deal.minimum_investment} className="py-4">Review Documents</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <label className="text-[10px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">Step 3: Subscription Agreement</label>
              
              <div className="p-6 rounded-lg bg-white/5 border border-white/10 space-y-4">
                 <div className="flex items-center gap-3 text-white">
                    <FileText size={24} className="text-[#2F80ED]" />
                    <span className="font-bold uppercase tracking-wider text-sm">SubscriptionAgreement_V2.pdf</span>
                 </div>
                 <div className="h-40 bg-black/40 rounded border border-white/5 flex items-center justify-center p-4">
                    <p className="text-[10px] text-[#8FAEDB]/50 uppercase tracking-widest text-center leading-relaxed">
                      By signing this document, you acknowledge the inherent risks of private capital investing including total loss of principal...
                    </p>
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex gap-3 items-start group cursor-pointer">
                    <input type="checkbox" id="risk" className="mt-1 accent-[#2F80ED]" required />
                    <label htmlFor="risk" className="text-[10px] text-[#8FAEDB] uppercase tracking-wider leading-relaxed cursor-pointer group-hover:text-white transition-colors">
                      I have read and agree to the Risk Disclosures and Private Placement Memorandum.
                    </label>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleBack} className="py-4">Back</Button>
                <Button onClick={handleNext} className="py-4">Sign & Proceed</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <label className="text-[10px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">Step 4: Funding Method</label>
              
              <div className="grid grid-cols-1 gap-4">
                {/* 1. Wire Transfer */}
                <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-white/5">
                  <button 
                    onClick={() => setFundingMethod(fundingMethod === 'WIRE' ? null : 'WIRE')}
                    className={`flex items-center justify-between p-5 transition-all ${fundingMethod === 'WIRE' ? 'bg-[#2F80ED]/10' : 'hover:bg-white/5'}`}
                  >
                     <div className="flex items-center gap-4">
                        <Building2 className={fundingMethod === 'WIRE' ? 'text-[#2F80ED]' : 'text-[#8FAEDB]'} />
                        <div className="text-left">
                          <span className="block text-sm font-bold text-white uppercase tracking-wider">Wire Transfer</span>
                          <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest">Instant institutional instructions</span>
                        </div>
                     </div>
                     <ChevronDown size={18} className={`text-[#8FAEDB] transition-transform ${fundingMethod === 'WIRE' ? 'rotate-180' : ''}`} />
                  </button>
                  {fundingMethod === 'WIRE' && (
                    <div className="p-6 border-t border-white/5 bg-black/20 space-y-4 animate-in slide-in-from-top-2">
                       <div className="grid grid-cols-2 gap-4">
                          <DetailItem label="Bank Name" value="Chase Bank, N.A." />
                          <DetailItem label="Beneficiary" value="AXIS KEY HOLDINGS LLC" />
                          <DetailItem label="Account Number" value="9876543210" copyable />
                          <DetailItem label="Routing Number" value="021000021" copyable />
                          <DetailItem label="SWIFT Code" value="CHASEUS33" />
                          <DetailItem label="Bank Address" value="270 Park Ave, New York, NY" />
                       </div>
                       <div className="p-3 bg-[#2F80ED]/5 border border-[#2F80ED]/20 rounded">
                          <span className="block text-[8px] text-[#2F80ED] font-bold uppercase tracking-widest mb-1">Critical: Reference Memo</span>
                          <span className="text-sm font-bold text-white uppercase">{userFullName} - {deal.title}</span>
                       </div>
                    </div>
                  )}
                </div>

                {/* 2. ACH Direct Debit */}
                <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-white/5">
                  <button 
                    onClick={() => setFundingMethod(fundingMethod === 'ACH' ? null : 'ACH')}
                    className={`flex items-center justify-between p-5 transition-all ${fundingMethod === 'ACH' ? 'bg-[#2F80ED]/10' : 'hover:bg-white/5'}`}
                  >
                     <div className="flex items-center gap-4">
                        <Landmark className={fundingMethod === 'ACH' ? 'text-[#2F80ED]' : 'text-[#8FAEDB]'} />
                        <div className="text-left">
                          <span className="block text-sm font-bold text-white uppercase tracking-wider">ACH Direct Debit</span>
                          <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest">Verified institutional link</span>
                        </div>
                     </div>
                     <ChevronDown size={18} className={`text-[#8FAEDB] transition-transform ${fundingMethod === 'ACH' ? 'rotate-180' : ''}`} />
                  </button>
                  {fundingMethod === 'ACH' && (
                    <div className="p-6 border-t border-white/5 bg-black/20 space-y-4 animate-in slide-in-from-top-2">
                       <div className="flex items-center gap-4 p-4 rounded bg-[#00E0C6]/5 border border-[#00E0C6]/20">
                          <div className="w-10 h-10 rounded-full bg-[#00E0C6]/10 flex items-center justify-center text-[#00E0C6]">
                             <CheckCircle2 size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-white uppercase tracking-tight">Plaid Verified: Goldman Sachs Bank</p>
                             <p className="text-[10px] text-[#8FAEDB] uppercase tracking-widest">Account ending in ****4421</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4 text-[10px]">
                          <DetailItem label="Account Holder" value={userFullName} />
                          <DetailItem label="Account Type" value="Commercial Checking" />
                       </div>
                       <div className="text-[9px] text-[#8FAEDB] italic uppercase opacity-60">
                         "I authorize AXIS KEY to initiate a one-time ACH debit from the account above for the total allocation amount."
                       </div>
                    </div>
                  )}
                </div>

                {/* 3. Credit Card */}
                <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-white/5">
                  <button 
                    onClick={() => setFundingMethod(fundingMethod === 'CC' ? null : 'CC')}
                    className={`flex items-center justify-between p-5 transition-all ${fundingMethod === 'CC' ? 'bg-[#2F80ED]/10' : 'hover:bg-white/5'}`}
                  >
                     <div className="flex items-center gap-4">
                        <CreditCard className={fundingMethod === 'CC' ? 'text-[#2F80ED]' : 'text-[#8FAEDB]'} />
                        <div className="text-left">
                          <span className="block text-sm font-bold text-white uppercase tracking-wider">Credit Card</span>
                          <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest">Instant funding authorization</span>
                        </div>
                     </div>
                     <ChevronDown size={18} className={`text-[#8FAEDB] transition-transform ${fundingMethod === 'CC' ? 'rotate-180' : ''}`} />
                  </button>
                  {fundingMethod === 'CC' && (
                    <div className="p-6 border-t border-white/5 bg-black/20 space-y-4 animate-in slide-in-from-top-2">
                       <div className="space-y-3">
                          <div className="space-y-1">
                             <label className="text-[8px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">Cardholder Name</label>
                             <input readOnly value={userFullName} className="w-full bg-[#081C3A] border border-white/10 rounded px-3 py-2 text-xs text-white" />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[8px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">Card Number</label>
                             <div className="relative">
                                <input readOnly value="**** **** **** 4242" className="w-full bg-[#081C3A] border border-white/10 rounded px-3 py-2 text-xs text-white" />
                                <CreditCard size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2F80ED] opacity-50" />
                             </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                             <div className="space-y-1">
                                <label className="text-[8px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">EXP</label>
                                <input readOnly value="12/26" className="w-full bg-[#081C3A] border border-white/10 rounded px-3 py-2 text-xs text-white" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[8px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">CVV</label>
                                <input readOnly value="***" className="w-full bg-[#081C3A] border border-white/10 rounded px-3 py-2 text-xs text-white" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[8px] font-bold text-[#8FAEDB] uppercase tracking-[0.2em]">ZIP</label>
                                <input readOnly value="10001" className="w-full bg-[#081C3A] border border-white/10 rounded px-3 py-2 text-xs text-white" />
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </div>

                {/* 4. IRA Payment */}
                <div className="flex flex-col border border-white/10 rounded-xl overflow-hidden bg-white/5">
                  <button 
                    onClick={() => setFundingMethod(fundingMethod === 'IRA' ? null : 'IRA')}
                    className={`flex items-center justify-between p-5 transition-all ${fundingMethod === 'IRA' ? 'bg-[#2F80ED]/10' : 'hover:bg-white/5'}`}
                  >
                     <div className="flex items-center gap-4">
                        <FileText className={fundingMethod === 'IRA' ? 'text-[#2F80ED]' : 'text-[#8FAEDB]'} />
                        <div className="text-left">
                          <span className="block text-sm font-bold text-white uppercase tracking-wider">IRA Payment</span>
                          <span className="text-[9px] text-[#8FAEDB] uppercase tracking-widest">Self-Directed IRA coordination</span>
                        </div>
                     </div>
                     <ChevronDown size={18} className={`text-[#8FAEDB] transition-transform ${fundingMethod === 'IRA' ? 'rotate-180' : ''}`} />
                  </button>
                  {fundingMethod === 'IRA' && (
                    <div className="p-6 border-t border-white/5 bg-black/20 space-y-6 animate-in slide-in-from-top-2">
                       <div className="grid grid-cols-2 gap-4">
                          <DetailItem label="Custodian" value="Millennium Trust Company" />
                          <DetailItem label="IRA Account #" value="IRA-55667788" />
                          <DetailItem label="Preferred Method" value="Institutional Wire" />
                          <DetailItem label="Custodian Contact" value="800-258-7878" />
                       </div>
                       
                       <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 space-y-3">
                          <div className="flex items-center gap-2">
                             <Info size={14} className="text-yellow-500" />
                             <span className="text-[10px] font-bold text-white uppercase tracking-widest">Custodian Coordination</span>
                          </div>
                          <div className="flex gap-3 items-start">
                             <input 
                               type="checkbox" 
                               id="ira-confirm" 
                               checked={iraAcknowledged}
                               onChange={(e) => setIraAcknowledged(e.target.checked)}
                               className="mt-1 accent-[#2F80ED]" 
                             />
                             <label htmlFor="ira-confirm" className="text-[10px] text-[#8FAEDB] leading-relaxed cursor-pointer select-none">
                                I acknowledge that I am responsible for coordinating the entire funding process through my IRA custodian. 
                                I will ensure the funds are released and correctly referenced to this transaction.
                             </label>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 shrink-0">
                <Button variant="outline" onClick={handleBack} disabled={isSubmitting} className="py-4">Back</Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!canConfirmFunding} 
                  className="py-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : 'Confirm Funding'}
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-[#00E0C6]/10 flex items-center justify-center text-[#00E0C6] cyan-glow border border-[#00E0C6]/20">
                  <Shield size={48} />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">Investment Pending</h2>
                <p className="text-[#8FAEDB] text-sm max-w-sm mx-auto leading-relaxed">
                  Your allocation request for <span className="text-white font-bold">{deal.title}</span> is complete. Funds are pending institutional confirmation and committee review.
                </p>
              </div>
              <div className="pt-6">
                <Button onClick={onComplete || onClose} variant="primary" className="w-full py-4 text-sm">Return to Command Center</Button>
              </div>
              <p className="text-[9px] text-[#8FAEDB]/50 uppercase tracking-[0.2em]">Transaction ID: TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const DetailItem: React.FC<{ label: string, value: string, copyable?: boolean }> = ({ label, value, copyable }) => (
  <div className="space-y-1">
    <span className="block text-[8px] text-[#8FAEDB] font-bold uppercase tracking-widest">{label}</span>
    <div className="flex items-center justify-between gap-2">
       <span className="text-[10px] text-white font-bold uppercase truncate">{value}</span>
       {copyable && (
         <button className="text-[#2F80ED] hover:text-white transition-colors" title="Copy to clipboard">
            <Copy size={10} />
         </button>
       )}
    </div>
  </div>
);
