import React, { useState } from 'react';
import { Button, Input, Select, T } from './UIElements';
import { User, InvestmentAccountType } from '../types';
import { CheckCircle, Shield, Info } from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: () => void;
}

const StepHeader: React.FC<{ step: number; total: number; title: string; subtitle: string }> = ({ step, total, title, subtitle }) => (
  <div className="space-y-1 mb-8">
    <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: T.gold }}>
      Step {step} of {total}
    </p>
    <h2 className="text-lg font-black uppercase tracking-wider" style={{ color: T.text }}>{title}</h2>
    <p className="text-xs" style={{ color: T.textSub }}>{subtitle}</p>
  </div>
);

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '',
    country: 'United States',
    id_number: '',
    dob: '',
    entity_name: '',
    ein: '',
    formation_state: '',
    custodian_name: '',
    is_accredited: true,
    net_worth_range: '1M-5M',
    previous_experience: false,
  });

  const isEntity = user.account_type === InvestmentAccountType.CORPORATION;
  const isIRA = user.account_type === InvestmentAccountType.IRA || user.account_type === InvestmentAccountType.K401;
  const update = (field: string, value: unknown) => setFormData({ ...formData, [field]: value });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: T.bg }}>
      <div className="w-full max-w-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 rotate-45 rounded-sm" style={{ background: T.gold }} />
              <div className="absolute inset-1 rotate-45 rounded-sm" style={{ background: T.bg }} />
            </div>
            <span className="text-sm font-black tracking-[0.18em] uppercase" style={{ color: T.text }}>Diversify</span>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-16 h-0.5 rounded-full transition-all duration-500"
                  style={{ background: step >= i ? T.gold : T.border }}
                />
                <div
                  className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-black transition-all duration-300"
                  style={{
                    background: step > i ? T.jadeFaint : step === i ? T.goldFaint : T.raised,
                    border: `1px solid ${step > i ? T.jade : step === i ? T.gold : T.border}`,
                    color: step > i ? T.jade : step === i ? T.gold : T.textDim,
                  }}
                >
                  {step > i ? '✓' : i}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-md" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="p-8">

            {/* ── Step 1: Identity ──────────────────────────────────────── */}
            {step === 1 && (
              <>
                <StepHeader step={1} total={3} title="Basic Identity" subtitle="Required for institutional verification and KYC compliance." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Input
                      label="Residential Address"
                      type="text"
                      placeholder="123 Park Ave, New York, NY 10001"
                      value={formData.address}
                      onChange={(e) => update('address', e.target.value)}
                    />
                  </div>
                  <Select
                    label="Country of Residence"
                    value={formData.country}
                    onChange={(e) => update('country', e.target.value)}
                  >
                    {['United States', 'Canada', 'United Kingdom', 'Germany', 'Singapore', 'Other'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Select>
                  <Input
                    label="ID Number (SSN / Tax ID)"
                    type="text"
                    placeholder="XXX-XX-XXXX"
                    value={formData.id_number}
                    onChange={(e) => update('id_number', e.target.value)}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => update('dob', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ── Step 2: Entity / Compliance ──────────────────────────── */}
            {step === 2 && (
              <>
                <StepHeader
                  step={2}
                  total={3}
                  title={isEntity ? 'Entity Details' : isIRA ? 'Account Details' : 'Compliance Profile'}
                  subtitle="Structuring your investment profile for the platform."
                />
                {isEntity && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <Input label="Legal Entity Name" type="text" value={formData.entity_name} onChange={(e) => update('entity_name', e.target.value)} />
                    </div>
                    <Input label="EIN Number" type="text" value={formData.ein} onChange={(e) => update('ein', e.target.value)} />
                    <Input label="Formation State" type="text" value={formData.formation_state} onChange={(e) => update('formation_state', e.target.value)} />
                  </div>
                )}
                {isIRA && (
                  <Input label="Custodian Name" type="text" value={formData.custodian_name} onChange={(e) => update('custodian_name', e.target.value)} />
                )}
                {!isEntity && !isIRA && (
                  <div className="py-12 text-center space-y-4">
                    <div
                      className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto"
                      style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}
                    >
                      <CheckCircle size={28} style={{ color: T.jade }} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest" style={{ color: T.text }}>Automatic Compliance Path</p>
                    <p className="text-xs max-w-sm mx-auto" style={{ color: T.textSub }}>
                      Your Individual account type allows you to proceed directly to accreditation verification.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ── Step 3: Accreditation ────────────────────────────────── */}
            {step === 3 && (
              <>
                <div className="flex items-start justify-between mb-8">
                  <StepHeader step={3} total={3} title="Accreditation Notice" subtitle="Self-attestation under Rule 501 of Regulation D." />
                  <div className="group relative">
                    <Info size={16} style={{ color: T.gold, cursor: 'help' }} />
                    <div
                      className="absolute right-0 top-6 w-64 p-4 rounded-sm text-[10px] leading-relaxed z-50 hidden group-hover:block"
                      style={{ background: T.raised, border: `1px solid ${T.border}`, color: T.textSub }}
                    >
                      An Accredited Investor includes individuals with $1M+ net worth (excluding primary residence) or $200k+ annual income for 2+ consecutive years.
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Is accredited toggle */}
                  <div
                    className="flex items-center justify-between p-4 rounded-sm"
                    style={{ background: T.raised, border: `1px solid ${T.border}` }}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: T.text }}>
                      I qualify as an Accredited Investor
                    </span>
                    <div className="flex gap-2">
                      {['Yes', 'No'].map((opt) => {
                        const isYes = opt === 'Yes';
                        const active = isYes ? formData.is_accredited : !formData.is_accredited;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => update('is_accredited', isYes)}
                            className="px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all"
                            style={{
                              background: active ? (isYes ? T.goldFaint : T.rubyFaint) : T.border,
                              border: `1px solid ${active ? (isYes ? T.gold : T.ruby) : 'transparent'}`,
                              color: active ? (isYes ? T.gold : T.ruby) : T.textDim,
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Net Worth Range"
                      value={formData.net_worth_range}
                      onChange={(e) => update('net_worth_range', e.target.value)}
                    >
                      <option value="1M-5M">$1M – $5M</option>
                      <option value="5M-10M">$5M – $10M</option>
                      <option value="10M+">$10M+</option>
                    </Select>
                    <Select
                      label="Private Placement Experience"
                      value={formData.previous_experience ? 'yes' : 'no'}
                      onChange={(e) => update('previous_experience', e.target.value === 'yes')}
                    >
                      <option value="no">None / Limited</option>
                      <option value="yes">Experienced</option>
                    </Select>
                  </div>

                  {/* Attestations */}
                  <div className="space-y-3 pt-2">
                    {[
                      'I understand private placements involve a high degree of risk and potential loss of capital.',
                      'I can bear the economic risk of this investment for an indefinite period of time.',
                      'I confirm all information provided is accurate and truthful.',
                    ].map((term, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <input type="checkbox" required className="mt-0.5 accent-amber-500" />
                        <p className="text-[10px] leading-relaxed" style={{ color: T.textSub }}>{term}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="mt-10 flex gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={() => setStep((s) => s + 1)} className={step === 1 ? 'w-full' : 'flex-[2]'} size="lg">
                  Continue →
                </Button>
              ) : (
                <Button type="button" onClick={onComplete} className="flex-[2]" size="lg">
                  <Shield size={14} /> Complete & Enter Portal
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
