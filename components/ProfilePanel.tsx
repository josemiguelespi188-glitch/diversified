import React, { useState } from 'react';
import { Button, Input, T } from './UIElements';
import { User as UserType } from '../types';
import { X, User, Mail, Phone, Globe, Calendar, Shield, Lock, CheckCircle2 } from 'lucide-react';

interface ProfilePanelProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: Partial<UserType>) => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    full_name: user.full_name,
    phone: (user as any).phone || '',
    country: (user as any).country || 'United States',
    dob: (user as any).dob || '',
  });

  if (!isOpen) return null;

  const initials = user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = () => {
    onUpdate(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setForm({
      full_name: user.full_name,
      phone: (user as any).phone || '',
      country: (user as any).country || 'United States',
      dob: (user as any).dob || '',
    });
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm h-screen flex flex-col"
        style={{ background: T.surface, borderLeft: `1px solid ${T.border}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-0.5" style={{ color: T.gold }}>Investor Profile</p>
            <h2 className="text-sm font-black uppercase tracking-tight" style={{ color: T.text }}>Identity</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm flex items-center justify-center transition-colors"
            style={{ color: T.textDim, background: T.raised, border: `1px solid ${T.border}` }}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.textDim; }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center text-lg font-black flex-shrink-0"
              style={{ background: `${T.gold}18`, border: `1px solid ${T.gold}40`, color: T.gold }}
            >
              {initials}
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: T.text }}>{user.full_name}</p>
              <p className="text-[9px] mt-0.5 uppercase tracking-widest" style={{ color: T.textDim }}>{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: T.jade }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.jade }}>
                  {(user as any).accreditation_status || 'Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>Personal Details</p>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-[9px] font-black uppercase tracking-widest transition-colors"
                  style={{ color: T.gold }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = T.text; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = T.gold; }}
                >
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={handleCancel} className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>Cancel</button>
                  <button onClick={handleSave} className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.jade }}>Save</button>
                </div>
              )}
            </div>

            {/* Saved banner */}
            {saved && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-sm"
                style={{ background: T.jadeFaint, border: `1px solid ${T.jade}30` }}
              >
                <CheckCircle2 size={12} style={{ color: T.jade }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.jade }}>Changes saved</span>
              </div>
            )}

            {editing ? (
              <div className="space-y-3">
                <Input
                  label="Legal Name"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                />
                <Input
                  label="Phone Number"
                  value={form.phone}
                  placeholder="+1 (555) 000-0000"
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
                <Input
                  label="Tax Jurisdiction"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                />
                <Input
                  label="Date of Birth"
                  value={form.dob}
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                />
              </div>
            ) : (
              <div className="space-y-0 rounded-sm overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                {[
                  { icon: User,     label: 'Legal Name',       value: form.full_name || '—' },
                  { icon: Mail,     label: 'Email',             value: user.email },
                  { icon: Phone,    label: 'Phone',             value: form.phone || '—' },
                  { icon: Globe,    label: 'Tax Jurisdiction',  value: form.country || '—' },
                  { icon: Calendar, label: 'Date of Birth',     value: form.dob || '—' },
                ].map((item, idx, arr) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      background: T.raised,
                      borderBottom: idx < arr.length - 1 ? `1px solid ${T.border}` : 'none',
                    }}
                  >
                    <item.icon size={12} style={{ color: T.textDim, flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] uppercase tracking-widest font-bold mb-0.5" style={{ color: T.textDim }}>{item.label}</p>
                      <p className="text-xs font-bold truncate" style={{ color: T.text }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>Platform Security</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: 'Two-Factor', value: 'Active',  color: T.jade },
                { icon: Lock,   label: 'Encryption',  value: 'AES-256', color: T.sky  },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-sm space-y-2"
                  style={{ background: T.raised, border: `1px solid ${T.border}` }}
                >
                  <item.icon size={14} style={{ color: item.color }} />
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>{item.label}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5" style={{ borderTop: `1px solid ${T.border}` }}>
          <p className="text-center text-[9px] uppercase tracking-widest" style={{ color: T.textDim }}>
            Authorized access only · AES-256 encryption
          </p>
        </div>
      </div>
    </div>
  );
};
