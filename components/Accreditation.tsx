import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, Badge, Button, Modal, T } from './UIElements';
import { ShieldCheck, Upload, CheckCircle2, FileText, Clock, Landmark, Users, Briefcase, User, FileUp, X } from 'lucide-react';
import { DocumentStatus, InvestmentAccountType, InvestmentAccount } from '../types';
import { trackEvent } from '../lib/analytics';

interface AccreditationProps {
  user: any;
  accounts: InvestmentAccount[];
}

const ENTITY_DOCS: Record<string, string> = {
  [InvestmentAccountType.CORPORATION]: 'Articles of Incorporation',
  [InvestmentAccountType.IRA]: 'Custodian Letter',
  [InvestmentAccountType.K401]: 'Custodian Letter',
  [InvestmentAccountType.TRUST]: 'Trust Documentation',
  [InvestmentAccountType.REVOCABLE_TRUST]: 'Trust Documentation',
};

const GLOBAL_DOCS = ['Government ID', 'Accreditation Letter'];

const typeIcon = (type: string) => {
  if (type === InvestmentAccountType.INDIVIDUAL) return User;
  if (type === InvestmentAccountType.CORPORATION) return Briefcase;
  if (type === InvestmentAccountType.JOINT) return Users;
  return Landmark;
};

export const Accreditation: React.FC<AccreditationProps> = ({ user, accounts }) => {
  const [uploaded, setUploaded] = useState<Set<string>>(new Set());
  const [uploadDoc, setUploadDoc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const completedTracked = useRef(false);

  // Track when the user enters the accreditation hub.
  useEffect(() => {
    trackEvent('accreditation_started');
  }, []);

  const requiredEntityDocs = useMemo(() => {
    const s = new Set<string>();
    accounts.forEach((a) => { const d = ENTITY_DOCS[a.type]; if (d) s.add(d); });
    return Array.from(s);
  }, [accounts]);

  const total = GLOBAL_DOCS.length + requiredEntityDocs.length;
  const done = [...uploaded].filter((d) => GLOBAL_DOCS.includes(d) || requiredEntityDocs.includes(d)).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Fire accreditation_completed exactly once when all docs are uploaded.
  useEffect(() => {
    if (pct === 100 && !completedTracked.current) {
      completedTracked.current = true;
      trackEvent('accreditation_completed');
    }
  }, [pct]);

  const docStatus = (name: string) => uploaded.has(name) ? DocumentStatus.VERIFIED : DocumentStatus.NOT_UPLOADED;

  const handleUpload = async () => {
    if (!uploadDoc || !fileName) return;
    trackEvent('button_click', { button_name: 'upload_document', page: 'accreditation', extra_context: uploadDoc });
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setUploaded((prev) => new Set(prev).add(uploadDoc));
    setUploading(false);
    setUploadDoc(null);
    setFileName(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: T.gold }}>Compliance</p>
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: T.text }}>Accreditation Hub</h1>
        </div>
        <div
          className="flex items-center gap-4 px-5 py-3 rounded-sm"
          style={{ background: T.surface, border: `1px solid ${T.border}` }}
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: T.textDim }}>Compliance Score</p>
            <p className="text-sm font-black uppercase" style={{ color: pct === 100 ? T.jade : T.gold }}>
              {pct === 100 ? 'Fully Verified' : `${done} / ${total} Documents`}
            </p>
          </div>
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: pct === 100 ? T.jade : T.gold, boxShadow: `0 0 8px ${pct === 100 ? T.jade : T.gold}` }}
          />
        </div>
      </div>

      {/* Global Docs */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} style={{ color: T.gold }} />
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Global Verification (Required for all accounts)</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GLOBAL_DOCS.map((doc) => (
            <DocRow
              key={doc}
              name={doc}
              desc={doc === 'Government ID' ? 'Passport or Driver License' : 'Rule 501 Self-Attestation'}
              status={docStatus(doc)}
              onUpload={() => setUploadDoc(doc)}
            />
          ))}
        </div>
      </section>

      {/* Entity Docs */}
      {requiredEntityDocs.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Landmark size={14} style={{ color: T.gold }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Entity Documentation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {requiredEntityDocs.map((doc) => {
              const acct = accounts.find((a) => ENTITY_DOCS[a.type] === doc);
              return (
                <DocRow
                  key={doc}
                  name={doc}
                  desc={`Required for ${acct?.type} account`}
                  status={docStatus(doc)}
                  onUpload={() => setUploadDoc(doc)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Account Summary */}
      <section className="space-y-3 pt-6" style={{ borderTop: `1px solid ${T.border}` }}>
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: T.textSub }}>Account Capability Ledger</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {accounts.map((acc) => {
            const globalOk = GLOBAL_DOCS.every((d) => uploaded.has(d));
            const entityDoc = ENTITY_DOCS[acc.type];
            const entityOk = !entityDoc || uploaded.has(entityDoc);
            const verified = globalOk && entityOk;
            const Icon = typeIcon(acc.type);

            return (
              <div
                key={acc.id}
                className="p-5 rounded-sm space-y-4"
                style={{
                  background: verified ? T.jadeFaint : T.surface,
                  border: `1px solid ${verified ? T.jade + '40' : T.border}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: T.raised, border: `1px solid ${T.border}` }}>
                    <Icon size={16} style={{ color: T.textDim }} />
                  </div>
                  <Badge variant={verified ? 'jade' : 'gold'}>{verified ? 'Cleared' : 'Pending'}</Badge>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide" style={{ color: T.text }}>{acc.display_name}</p>
                  <p className="text-[9px] mt-0.5 uppercase tracking-widest" style={{ color: T.textDim }}>{acc.type}</p>
                </div>
                <div className="space-y-2 pt-2" style={{ borderTop: `1px solid ${T.border}` }}>
                  {[
                    { label: 'Identity', d: 'Government ID' },
                    { label: 'Accreditation', d: 'Accreditation Letter' },
                    ...(entityDoc ? [{ label: entityDoc, d: entityDoc }] : []),
                  ].map((row) => {
                    const ok = uploaded.has(row.d);
                    return (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>{row.label}</span>
                        {ok ? <CheckCircle2 size={12} style={{ color: T.jade }} /> : <Clock size={12} style={{ color: T.textDim }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upload Modal */}
      <Modal isOpen={!!uploadDoc} onClose={() => { if (!uploading) { setUploadDoc(null); setFileName(null); } }} title={`Upload: ${uploadDoc}`} width="max-w-md">
        <div className="p-6 space-y-6">
          {!fileName ? (
            <div
              onClick={() => setFileName(`DIVERSIFY_DOC_${Math.floor(Math.random() * 9000 + 1000)}.pdf`)}
              className="cursor-pointer flex flex-col items-center justify-center py-14 rounded-sm transition-all"
              style={{ border: `2px dashed ${T.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${T.gold}60`; e.currentTarget.style.background = T.goldFaint; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'transparent'; }}
            >
              <FileUp size={28} style={{ color: T.textDim, marginBottom: 12 }} />
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: T.textSub }}>Click to select PDF</p>
              <p className="text-[10px] mt-1" style={{ color: T.textDim }}>Institutional PDF only</p>
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-4 rounded-sm"
              style={{ background: T.jadeFaint, border: `1px solid ${T.jade}40` }}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} style={{ color: T.jade }} />
                <div>
                  <p className="text-xs font-black" style={{ color: T.text }}>{fileName}</p>
                  <p className="text-[9px]" style={{ color: T.textDim }}>Ready for upload</p>
                </div>
              </div>
              <button onClick={() => setFileName(null)} style={{ color: T.textDim }} className="hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            </div>
          )}

          <p className="text-[10px] leading-relaxed" style={{ color: T.textDim }}>
            All documents are encrypted with AES-256 and stored in compliant infrastructure. Access is restricted to authorized compliance officers.
          </p>

          <Button
            onClick={handleUpload}
            disabled={!fileName || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Uploading…
              </span>
            ) : 'Confirm & Upload'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const DocRow: React.FC<{
  name: string;
  desc: string;
  status: DocumentStatus;
  onUpload: () => void;
}> = ({ name, desc, status, onUpload }) => {
  const verified = status === DocumentStatus.VERIFIED;
  return (
    <div
      className="flex items-center justify-between p-4 rounded-sm transition-all"
      style={{
        background: verified ? T.jadeFaint : T.surface,
        border: `1px solid ${verified ? T.jade + '40' : T.border}`,
      }}
    >
      <div className="space-y-0.5">
        <p className="text-xs font-black uppercase tracking-wide" style={{ color: T.text }}>{name}</p>
        <p className="text-[9px]" style={{ color: T.textDim }}>{desc}</p>
      </div>
      <div className="flex items-center gap-3">
        {verified ? <Badge variant="jade">Verified</Badge> : <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textDim }}>Not Submitted</span>}
        <button
          disabled={verified}
          onClick={onUpload}
          className="w-8 h-8 rounded-sm flex items-center justify-center transition-all"
          style={{
            background: verified ? T.jadeFaint : T.raised,
            border: `1px solid ${verified ? T.jade + '40' : T.border}`,
            color: verified ? T.jade : T.textDim,
            cursor: verified ? 'default' : 'pointer',
          }}
        >
          {verified ? <CheckCircle2 size={14} /> : <Upload size={14} />}
        </button>
      </div>
    </div>
  );
};
