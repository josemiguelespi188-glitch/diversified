
import React, { useState } from 'react';
import { Card, Button, Badge } from './UIElements';
import { User, InvestmentAccountType } from '../types';
import { ChevronRight, Landmark, Info, CheckCircle, Shield } from 'lucide-react';

interface OnboardingProps {
  user: User;
  onComplete: () => void;
}

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
    is_accredited: false,
    net_worth_range: '1M-5M',
    previous_experience: false,
    confirm_accuracy: false
  });

  const nextStep = () => setStep(s => s + 1);

  const isEntity = user.account_type === InvestmentAccountType.CORPORATION;
  const isIRA = user.account_type === InvestmentAccountType.IRA || user.account_type === InvestmentAccountType.K401;

  const handleFinalSubmit = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#081C3A] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#2F80ED] rounded rotate-45"></div>
            <span className="text-xl font-bold text-white tracking-tighter">DIVERSIFY</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#2F80ED] cyan-glow' : 'bg-white/10'}`}></div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
            <SectionHeader 
              title="Basic Identity" 
              subtitle="Step 1 of 3: Required for institutional verification."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Residential Address</label>
                <input 
                  type="text" 
                  className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white focus:border-[#2F80ED] outline-none"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Identification Number (SSN/Tax ID)</label>
                <input 
                  type="text" 
                  className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white focus:border-[#2F80ED] outline-none"
                  value={formData.id_number}
                  onChange={e => setFormData({...formData, id_number: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Date of Birth</label>
                <input 
                  type="date" 
                  className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white focus:border-[#2F80ED] outline-none"
                  value={formData.dob}
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={nextStep} className="w-full mt-10 py-4">Continue to Next Step</Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
            <SectionHeader 
              title={isEntity ? "Entity Details" : isIRA ? "Account Details" : "Compliance Profile"} 
              subtitle="Step 2 of 3: Structuring your investment profile."
            />
            <div className="mt-8 space-y-6">
              {isEntity ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Legal Entity Name</label>
                    <input type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white" value={formData.entity_name} onChange={e => setFormData({...formData, entity_name: e.target.value})}/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">EIN Number</label>
                    <input type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white" value={formData.ein} onChange={e => setFormData({...formData, ein: e.target.value})}/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Formation State</label>
                    <input type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white" value={formData.formation_state} onChange={e => setFormData({...formData, formation_state: e.target.value})}/>
                  </div>
                </div>
              ) : isIRA ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Custodian Name</label>
                    <input type="text" className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white" value={formData.custodian_name} onChange={e => setFormData({...formData, custodian_name: e.target.value})}/>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-[#8FAEDB] space-y-4">
                  <div className="flex justify-center"><CheckCircle size={48} className="text-[#00E0C6]" /></div>
                  <p className="text-sm font-semibold uppercase tracking-widest">Automatic Compliance Path Identified</p>
                  <p className="text-xs">Your Individual account type allows you to proceed directly to accreditation verification.</p>
                </div>
              )}
            </div>
            <Button onClick={nextStep} className="w-full mt-10 py-4">Final Step: Accreditation</Button>
          </Card>
        )}

        {step === 3 && (
          <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-start">
              <SectionHeader 
                title="Accreditation Notice" 
                subtitle="Step 3 of 3: Self-Attestation under Rule 501 of Regulation D."
              />
              <div className="group relative">
                <Info size={18} className="text-[#2F80ED] cursor-help" />
                <div className="absolute right-0 top-6 w-64 p-4 glass-panel text-[10px] text-[#8FAEDB] hidden group-hover:block z-50 rounded-lg">
                  An Accredited Investor includes individuals with $1M+ net worth (excluding primary residence) or $200k+ annual income.
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between p-4 rounded bg-[#2F80ED]/5 border border-[#2F80ED]/20">
                <span className="text-sm text-white font-medium">Are you an Accredited Investor?</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFormData({...formData, is_accredited: true})}
                    className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${formData.is_accredited ? 'bg-[#2F80ED] text-white' : 'bg-white/5 text-[#8FAEDB]'}`}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, is_accredited: false})}
                    className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${!formData.is_accredited ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-[#8FAEDB]'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Net Worth Range</label>
                    <select className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-xs" value={formData.net_worth_range} onChange={e => setFormData({...formData, net_worth_range: e.target.value})}>
                      <option value="1M-5M">$1,000,000 - $5,000,000</option>
                      <option value="5M-10M">$5,000,000 - $10,000,000</option>
                      <option value="10M+">$10,000,000+</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#8FAEDB]">Private Placement Experience</label>
                    <select className="w-full bg-[#081C3A] border border-white/10 rounded px-4 py-3 text-white text-xs" value={formData.previous_experience ? 'yes' : 'no'} onChange={e => setFormData({...formData, previous_experience: e.target.value === 'yes'})}>
                      <option value="no">None / Limited</option>
                      <option value="yes">Experienced</option>
                    </select>
                  </div>
              </div>

              <div className="space-y-4 pt-4">
                 {[
                   "I understand that private placements involve a high degree of risk and potential loss of capital.",
                   "I can bear the economic risk of this investment for an indefinite period of time.",
                   "I confirm all information provided is accurate and truthful."
                 ].map((term, i) => (
                   <div key={i} className="flex gap-3 items-start">
                     <input type="checkbox" className="mt-1 accent-[#2F80ED]" required />
                     <p className="text-[10px] text-[#8FAEDB] leading-relaxed">{term}</p>
                   </div>
                 ))}
              </div>

              <Button onClick={handleFinalSubmit} className="w-full py-4 flex items-center justify-center gap-2 group">
                <Shield size={16} />
                Complete Verification & Enter Portal
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div>
    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{title}</h2>
    <p className="text-[#8FAEDB] text-sm mt-1">{subtitle}</p>
  </div>
);
