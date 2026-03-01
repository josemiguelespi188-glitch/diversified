import React, { useState, useEffect } from 'react';
import { Deal, RequestStatus } from '../types';
import { MOCK_ACCOUNTS } from '../constants';
import { Button, Badge, T } from './UIElements';
import { Landmark, FileText, CreditCard, Shield, AlertTriangle, Building2, Copy, Info, ChevronDown, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface InvestmentModalProps {
  deal: Deal;
  onClose: () => void;
  onSubmit: (data: { dealId: string; dealName: string; accountId: string; amount: number; status: string }) => void;
  onComplete?: () => void;
  userFullName?: string;
}

type FundingMethod = 'WIRE' | 'ACH' | 'CC' | 'IRA';

const STEPS = ['Account', 'Amount', 'Disclosure', 'Funding', 'Confirm'];

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  deal,
  onClose,
  onSubmit,
  onComplete,
  userFullName = 'Investor',
}) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(deal.minimum_investment);
  const [account, setAccount] = useState(MOCK_ACCOUNTS[0].id);
  const [fundingMethod, setFundingMethod] = useState<FundingMethod | null>(null);
  const [iraAck, setIraAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Track when the investor opens the allocation flow.
  useEffect(() => {
    trackEvent('allocation_started', { deal_id: deal.id });
  }, [deal.id]);

  const isVerified = (id: string) => id === 'acc_ind';

  const handleNext = () => {
    if (step === 1 && !isVerified(account)) { setStep(99); return; }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    trackEvent('button_click', { button_name: 'confirm_funding', page: 'investment_modal', extra_context: deal.id });
    await new Promise((r) => setTimeout(r, 1800));
    const selectedAccount = MOCK_ACCOUNTS.find((a) => a.id === account);
    onSubmit({ dealId: deal.id, dealName: deal.title, accountId: account, amount, status: RequestStatus.PENDING_FUNDING });
    trackEvent('allocation_submitted', {
      deal_id:      deal.id,
      amount,
      account_type: selectedAccount?.type ?? 'unknown',
    });
    setStep(5);
    setSubmitting(false);
  };

  const canFund = fundingMethod && (fundingMethod !== 'IRA' || iraAck) && !submitting;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(7,8,12,0.9)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-md overflow-hidden flex flex-col max-h-[90vh]"
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
              <Landmark size={16} style={{ color: T.gold }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: T.text }}>Capital Allocation</p>
              <p className="text-[9px] mt-0.5" style={{ color: T.textDim }}>{deal.title} · {deal.strategy}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors hover:bg-white/5" style={{ color: T.textDim }}>×</button>
        </div>

        {/* Progress steps */}
        {step !== 99 && (
          <div className="flex flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="flex-1 h-0.5 transition-all duration-500"
                style={{ background: step > i ? T.gold : step === i + 1 ? T.goldDim : T.border }}
              />
            ))}
          </div>
        )}

        <div className="p-7 overflow-y-auto flex-1">

          {/* ── Step 99: Accreditation Error ──────────────────────────── */}
          {step === 99 && (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto" style={{ background: T.goldFaint, border: `1px solid ${T.gold}40` }}>
                <AlertTriangle size={28} style={{ color: T.gold }} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest" style={{ color: T.text }}>Accreditation Required</h3>
              <p className="text-xs leading-relaxed" style={{ color: T.textSub }}>
                The selected account (<strong style={{ color: T.text }}>{MOCK_ACCOUNTS.find((a) => a.id === account)?.display_name}</strong>) is not fully verified. Please complete verification before making allocations.
              </p>
              <div className="space-y-2 pt-2">
                <Button onClick={onClose} className="w-full" size="lg">Complete Accreditation</Button>
                <button onClick={() => setStep(1)} className="w-full text-[10px] font-black uppercase tracking-widest transition-colors hover:text-amber-400" style={{ color: T.textDim }}>
                  Change Account
                </button>
              </div>
            </div>
          )}

          {/* ── Step 1: Account ───────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <StepLabel n={1} text="Select Investing Account" />
              <div className="space-y-2">
                {MOCK_ACCOUNTS.map((acc) => {
                  const active = account === acc.id;
                  const verified = isVerified(acc.id);
                  return (
                    <button
                      key={acc.id}
                      onClick={() => setAccount(acc.id)}
                      className="w-full p-4 rounded-sm text-left transition-all"
                      style={{
                        background: active ? T.goldFaint : T.raised,
                        border: `1px solid ${active ? T.gold : T.border}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wide" style={{ color: T.text }}>{acc.display_name}</p>
                          <p className="text-[9px] mt-0.5 uppercase tracking-widest" style={{ color: T.textDim }}>ID: {acc.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!verified && <Badge variant="gold">Unverified</Badge>}
                          <Badge variant="neutral">{acc.type}</Badge>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">Continue →</Button>
            </div>
          )}

          {/* ── Step 2: Amount ────────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <StepLabel n={2} text="Enter Allocation Amount" />
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black" style={{ color: T.gold }}>$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full py-5 pl-10 pr-5 text-3xl font-black outline-none rounded-sm transition-all"
                  style={{
                    background: T.raised,
                    border: `1px solid ${amount < deal.minimum_investment ? T.ruby : T.border}`,
                    color: T.text,
                  }}
                />
              </div>
              {amount < deal.minimum_investment && (
                <p className="text-xs" style={{ color: T.ruby }}>
                  Minimum investment is ${deal.minimum_investment.toLocaleString()}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-sm" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                <Metric label="Est. Annual Yield" value={`$${(amount * deal.cash_yield / 100).toLocaleString()}`} color={T.jade} />
                <Metric label="Target IRR" value={`${deal.projected_irr}%`} color={T.gold} />
              </div>
              <p className="text-center text-[9px] uppercase tracking-widest" style={{ color: T.textDim }}>
                Minimum: <span style={{ color: T.text }}>${deal.minimum_investment.toLocaleString()}</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleNext} disabled={amount < deal.minimum_investment} size="lg">Review →</Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Disclosure ────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <StepLabel n={3} text="Subscription Agreement" />
              <div className="rounded-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-3 p-4" style={{ background: T.raised, borderBottom: `1px solid ${T.border}` }}>
                  <FileText size={16} style={{ color: T.gold }} />
                  <span className="text-xs font-black uppercase tracking-wide" style={{ color: T.text }}>SubscriptionAgreement_V2.pdf</span>
                </div>
                <div className="p-6 h-28 flex items-center justify-center" style={{ background: T.bg }}>
                  <p className="text-[10px] text-center leading-relaxed" style={{ color: T.textDim }}>
                    By signing this agreement, you acknowledge the inherent risks of private capital investing, including total loss of principal, illiquidity, and regulatory exposure.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <input type="checkbox" id="risk" required className="mt-0.5 accent-amber-500" />
                <label htmlFor="risk" className="text-[10px] leading-relaxed cursor-pointer" style={{ color: T.textSub }}>
                  I have read and agree to the Risk Disclosures, PPM, and Subscription Agreement.
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handleNext} size="lg">Sign & Proceed →</Button>
              </div>
            </div>
          )}

          {/* ── Step 4: Funding ───────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-4">
              <StepLabel n={4} text="Select Funding Method" />
              {(
                [
                  { id: 'WIRE', icon: Building2, label: 'Wire Transfer',  sub: 'Institutional wire instructions' },
                  { id: 'ACH',  icon: Landmark,  label: 'ACH Debit',      sub: 'Verified bank account link' },
                  { id: 'CC',   icon: CreditCard, label: 'Credit Card',   sub: 'Instant authorization' },
                  { id: 'IRA',  icon: FileText,   label: 'IRA Payment',   sub: 'Self-directed IRA coordination' },
                ] as { id: FundingMethod; icon: React.FC<{size?:number}>; label: string; sub: string }[]
              ).map((opt) => {
                const open = fundingMethod === opt.id;
                return (
                  <div key={opt.id} className="rounded-sm overflow-hidden" style={{ border: `1px solid ${open ? T.gold : T.border}` }}>
                    <button
                      onClick={() => setFundingMethod(open ? null : opt.id)}
                      className="w-full flex items-center justify-between p-4 transition-all"
                      style={{ background: open ? T.goldFaint : T.raised }}
                    >
                      <div className="flex items-center gap-3">
                        <opt.icon size={15} style={{ color: open ? T.gold : T.textDim }} />
                        <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-wide" style={{ color: open ? T.gold : T.text }}>{opt.label}</p>
                          <p className="text-[9px]" style={{ color: T.textDim }}>{opt.sub}</p>
                        </div>
                      </div>
                      <ChevronDown size={14} style={{ color: T.textDim, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                    {open && (
                      <div className="p-5" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
                        {opt.id === 'WIRE' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { l: 'Bank', v: 'Chase Bank, N.A.' },
                                { l: 'Beneficiary', v: 'DIVERSIFY CAPITAL LLC' },
                                { l: 'Account #', v: '9876543210', c: true },
                                { l: 'Routing #', v: '021000021', c: true },
                                { l: 'SWIFT', v: 'CHASEUS33' },
                                { l: 'Address', v: '270 Park Ave, NY 10017' },
                              ].map((item) => (
                                <DetailRow key={item.l} label={item.l} value={item.v} copyable={item.c} />
                              ))}
                            </div>
                            <div className="p-3 rounded-sm" style={{ background: T.goldFaint, border: `1px solid ${T.gold}30` }}>
                              <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: T.gold }}>Memo Reference (Required)</p>
                              <p className="text-xs font-black uppercase" style={{ color: T.text }}>{userFullName} — {deal.title}</p>
                            </div>
                          </div>
                        )}
                        {opt.id === 'ACH' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-sm" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
                              <CheckCircle2 size={16} style={{ color: T.jade }} />
                              <div>
                                <p className="text-xs font-black uppercase" style={{ color: T.text }}>Plaid Verified: Goldman Sachs</p>
                                <p className="text-[9px]" style={{ color: T.textDim }}>Account ending ****4421</p>
                              </div>
                            </div>
                            <p className="text-[9px] italic" style={{ color: T.textDim }}>
                              "I authorize DIVERSIFY to initiate a one-time ACH debit for the total allocation amount."
                            </p>
                          </div>
                        )}
                        {opt.id === 'CC' && (
                          <div className="space-y-3">
                            {[
                              { l: 'Name', v: userFullName },
                              { l: 'Card', v: '**** **** **** 4242' },
                            ].map((f) => (
                              <div key={f.l} className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>{f.l}</p>
                                <div className="px-3 py-2 rounded-sm text-xs font-bold" style={{ background: T.raised, color: T.text }}>{f.v}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {opt.id === 'IRA' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { l: 'Custodian', v: 'Millennium Trust Co.' },
                                { l: 'IRA Account #', v: 'IRA-55667788' },
                              ].map((f) => (
                                <DetailRow key={f.l} label={f.l} value={f.v} />
                              ))}
                            </div>
                            <div className="p-3 rounded-sm" style={{ background: T.goldFaint, border: `1px solid ${T.gold}40` }}>
                              <div className="flex items-center gap-2 mb-2">
                                <Info size={12} style={{ color: T.gold }} />
                                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.gold }}>Custodian Coordination Required</p>
                              </div>
                              <div className="flex gap-2 items-start">
                                <input type="checkbox" id="ira-ack" checked={iraAck} onChange={(e) => setIraAck(e.target.checked)} className="mt-0.5 accent-amber-500" />
                                <label htmlFor="ira-ack" className="text-[9px] leading-relaxed cursor-pointer" style={{ color: T.textSub }}>
                                  I acknowledge that I must coordinate the funding directly with my IRA custodian and ensure the funds are correctly referenced to this transaction.
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(3)} disabled={submitting}>Back</Button>
                <Button onClick={handleSubmit} disabled={!canFund} size="lg">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 rounded-full border-black/30 border-t-black animate-spin" />
                      Processing…
                    </span>
                  ) : 'Confirm Funding'}
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 5: Confirmation ──────────────────────────────────── */}
          {step === 5 && (
            <div className="py-10 text-center space-y-6">
              <div className="w-20 h-20 rounded-sm flex items-center justify-center mx-auto" style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}>
                <Shield size={36} style={{ color: T.jade }} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-2" style={{ color: T.text }}>Allocation Submitted</h3>
                <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ color: T.textSub }}>
                  Your allocation for <strong style={{ color: T.text }}>{deal.title}</strong> is complete. Funds are pending institutional confirmation and committee review.
                </p>
              </div>
              <Button onClick={onComplete || onClose} className="w-full" size="lg">Return to Dashboard</Button>
              <p className="text-[9px] uppercase tracking-widest" style={{ color: T.textDim }}>
                TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StepLabel: React.FC<{ n: number; text: string }> = ({ n, text }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-black" style={{ background: T.gold, color: '#000' }}>
      {n}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>{text}</p>
  </div>
);

const Metric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>{label}</p>
    <p className="text-lg font-black" style={{ color }}>{value}</p>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string; copyable?: boolean }> = ({ label, value, copyable }) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>{label}</p>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black uppercase truncate" style={{ color: T.text }}>{value}</span>
      {copyable && (
        <button onClick={() => navigator.clipboard?.writeText(value)} style={{ color: T.textDim }} className="hover:text-amber-400 transition-colors flex-shrink-0">
          <Copy size={10} />
        </button>
      )}
    </div>
  </div>
);
