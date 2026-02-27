
import React, { useState, useMemo } from 'react';
import { Card, Badge, Button } from './UIElements';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  User, 
  ChevronDown, 
  Info,
  Clock,
  Briefcase,
  Users,
  Landmark,
  X,
  FileUp,
  Search
} from 'lucide-react';
import { DocumentStatus, InvestmentAccountType, InvestmentAccount } from '../types';

interface AccreditationProps {
  user: any;
  accounts: InvestmentAccount[];
}

// Requirement Mapping
const ENTITY_DOC_REQUIREMENTS: Record<string, string> = {
  [InvestmentAccountType.CORPORATION]: 'Articles of Incorporation',
  [InvestmentAccountType.IRA]: 'Custodian Letter',
  [InvestmentAccountType.K401]: 'Custodian Letter',
  [InvestmentAccountType.TRUST]: 'Trust Documentation',
  [InvestmentAccountType.REVOCABLE_TRUST]: 'Trust Documentation',
};

const GLOBAL_DOCS = ['Government ID', 'Accreditation Letter'];

export const Accreditation: React.FC<AccreditationProps> = ({ user, accounts }) => {
  // Track "Uploaded" documents in local state for MVP simulation
  const [uploadedDocNames, setUploadedDocNames] = useState<Set<string>>(new Set());
  const [showAccreditationInfo, setShowAccreditationInfo] = useState(false);
  const [uploadModalDoc, setUploadModalDoc] = useState<string | null>(null);
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Derive which entity-specific documents are required based on active accounts
  const requiredEntityDocs = useMemo(() => {
    const docs = new Set<string>();
    accounts.forEach(acc => {
      const doc = ENTITY_DOC_REQUIREMENTS[acc.type];
      if (doc) docs.add(doc);
    });
    return Array.from(docs);
  }, [accounts]);

  const getDocStatus = (docName: string): DocumentStatus => {
    if (uploadedDocNames.has(docName)) return DocumentStatus.VERIFIED; // In MVP simulation, Uploaded = Verified for immediate feedback
    return DocumentStatus.NOT_UPLOADED;
  };

  const handleOpenUpload = (docName: string) => {
    setUploadModalDoc(docName);
    setSelectedFileName(null);
  };

  const handleSimulateFileSelect = () => {
    setSelectedFileName(`DIVERCFLY_DOC_${Math.floor(Math.random() * 9000) + 1000}.pdf`);
  };

  const handleFinalUpload = async () => {
    if (!uploadModalDoc) return;
    setIsSimulatingUpload(true);
    // Institutional simulation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploadedDocNames(prev => new Set(prev).add(uploadModalDoc));
    setIsSimulatingUpload(false);
    setUploadModalDoc(null);
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.VERIFIED:
        return <Badge variant="success">Completed</Badge>;
      case DocumentStatus.UNDER_REVIEW:
        return <Badge variant="info">Under Review</Badge>;
      default:
        return <span className="text-[10px] text-[#8FAEDB] uppercase font-bold opacity-40">Not Submitted</span>;
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    if (status === DocumentStatus.VERIFIED) return <CheckCircle2 className="text-[#00E0C6]" size={16} />;
    return <Clock className="text-[#8FAEDB] opacity-30" size={16} />;
  };

  // Helper to check if a specific account is fully verified
  const isAccountVerified = (acc: InvestmentAccount) => {
    const globalDocsReady = GLOBAL_DOCS.every(doc => uploadedDocNames.has(doc));
    const entityDoc = ENTITY_DOC_REQUIREMENTS[acc.type];
    const entityDocReady = !entityDoc || uploadedDocNames.has(entityDoc);
    return globalDocsReady && entityDocReady;
  };

  const totalRequiredCount = GLOBAL_DOCS.length + requiredEntityDocs.length;
  const totalCompletedCount = Array.from(uploadedDocNames).filter((d: string) => 
    GLOBAL_DOCS.includes(d) || requiredEntityDocs.includes(d)
  ).length;

  const isFullyCompliant = totalRequiredCount > 0 && totalCompletedCount === totalRequiredCount;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 uppercase tracking-tight">Accreditation Hub</h1>
          <p className="text-[#8FAEDB] text-sm uppercase tracking-widest font-medium opacity-60">Portfolio-wide compliance infrastructure</p>
        </div>
        <Card className="py-3 px-6 bg-[#2F80ED]/5 border-[#2F80ED]/20 flex items-center gap-4">
           <div className="text-right">
              <span className="block text-[9px] uppercase tracking-[0.2em] font-bold text-[#8FAEDB]">Compliance Score</span>
              <span className="text-sm font-bold text-white uppercase">{isFullyCompliant ? 'Fully Verified' : `${totalCompletedCount} / ${totalRequiredCount} Documents`}</span>
           </div>
           <div className={`w-3 h-3 rounded-full ${isFullyCompliant ? 'bg-[#00E0C6] cyan-glow' : 'bg-yellow-500 animate-pulse'}`}></div>
        </Card>
      </header>

      {/* 1. Global Requirements */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
           <ShieldCheck size={18} className="text-[#2F80ED]" />
           <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Global Verification (Required for all accounts)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOBAL_DOCS.map(doc => (
            <Card key={doc} className={`border-white/5 bg-[#0F2A4A]/30 transition-all ${uploadedDocNames.has(doc) ? 'border-[#00E0C6]/20' : ''}`}>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{doc}</h3>
                  <p className="text-[10px] text-[#8FAEDB] leading-relaxed max-w-[200px]">
                    {doc === 'Government ID' ? 'Passport or Driver License' : 'Rule 501 Self-Attestation'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(getDocStatus(doc))}
                  <button 
                    disabled={uploadedDocNames.has(doc)}
                    onClick={() => handleOpenUpload(doc)} 
                    className={`p-2 rounded border transition-all ${uploadedDocNames.has(doc) ? 'border-[#00E0C6]/20 text-[#00E0C6]' : 'border-white/10 text-[#8FAEDB] hover:text-white hover:border-white/30'}`}
                  >
                    {uploadedDocNames.has(doc) ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Entity Specific Requirements */}
      {requiredEntityDocs.length > 0 && (
        <section className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-2">
             <Landmark size={18} className="text-[#00E0C6]" />
             <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em]">Entity Documentation (Required by current accounts)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredEntityDocs.map(doc => (
              <Card key={doc} className={`border-white/5 bg-[#0F2A4A]/30 transition-all ${uploadedDocNames.has(doc) ? 'border-[#00E0C6]/20' : ''}`}>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{doc}</h3>
                    <p className="text-[10px] text-[#8FAEDB] leading-relaxed max-w-[200px]">
                      Required for your {accounts.find(a => ENTITY_DOC_REQUIREMENTS[a.type] === doc)?.type} account.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(getDocStatus(doc))}
                    <button 
                      disabled={uploadedDocNames.has(doc)}
                      onClick={() => handleOpenUpload(doc)} 
                      className={`p-2 rounded border transition-all ${uploadedDocNames.has(doc) ? 'border-[#00E0C6]/20 text-[#00E0C6]' : 'border-white/10 text-[#8FAEDB] hover:text-white hover:border-white/30'}`}
                    >
                      {uploadedDocNames.has(doc) ? <CheckCircle2 size={18} /> : <Upload size={18} />}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 3. Account-Level Verification Summary */}
      <section className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4">Account Capability Ledger</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accounts.map(acc => {
            const verified = isAccountVerified(acc);
            return (
              <Card key={acc.id} className={`p-5 flex flex-col gap-4 border-white/5 ${verified ? 'bg-[#00E0C6]/5 border-[#00E0C6]/20' : 'bg-white/5'}`}>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8FAEDB]">
                    {acc.type === InvestmentAccountType.INDIVIDUAL && <User size={20} />}
                    {acc.type === InvestmentAccountType.CORPORATION && <Briefcase size={20} />}
                    {(acc.type === InvestmentAccountType.IRA || acc.type === InvestmentAccountType.K401) && <Landmark size={20} />}
                    {acc.type === InvestmentAccountType.JOINT && <Users size={20} />}
                  </div>
                  {verified ? (
                    <Badge variant="success">Cleared</Badge>
                  ) : (
                    <Badge variant="info">Pending Documents</Badge>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{acc.display_name}</h4>
                  <p className="text-[10px] text-[#8FAEDB] uppercase font-bold opacity-50">{acc.type}</p>
                </div>
                <div className="pt-4 border-t border-white/5 space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#8FAEDB] uppercase font-bold">Global Identity</span>
                      {getStatusIcon(getDocStatus('Government ID'))}
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[#8FAEDB] uppercase font-bold">Accreditation</span>
                      {getStatusIcon(getDocStatus('Accreditation Letter'))}
                   </div>
                   {ENTITY_DOC_REQUIREMENTS[acc.type] && (
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] text-[#8FAEDB] uppercase font-bold">{ENTITY_DOC_REQUIREMENTS[acc.type]}</span>
                        {getStatusIcon(getDocStatus(ENTITY_DOC_REQUIREMENTS[acc.type]))}
                     </div>
                   )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Simulated Institutional Upload Modal */}
      {uploadModalDoc && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#081C3A]/95 backdrop-blur-md" onClick={() => !isSimulatingUpload && setUploadModalDoc(null)}></div>
          <Card className="relative w-full max-w-lg p-0 overflow-hidden border-[#2F80ED]/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0F2A4A]/50">
               <div>
                  <h2 className="text-lg font-bold text-white tracking-tight uppercase">Upload Document</h2>
                  <p className="text-[10px] text-[#2F80ED] uppercase tracking-widest font-bold">{uploadModalDoc}</p>
               </div>
               <button onClick={() => setUploadModalDoc(null)} disabled={isSimulatingUpload} className="text-[#8FAEDB] hover:text-white transition-colors p-2">
                  <X size={20} />
               </button>
            </div>

            <div className="p-8 space-y-8">
              {!selectedFileName ? (
                <div 
                  onClick={handleSimulateFileSelect}
                  className="group cursor-pointer border-2 border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:border-[#2F80ED]/50 hover:bg-[#2F80ED]/5 transition-all"
                >
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#8FAEDB] group-hover:text-[#2F80ED] transition-colors">
                      <FileUp size={32} />
                   </div>
                   <div className="text-center">
                      <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">Drag and drop file</p>
                      <p className="text-[10px] text-[#8FAEDB] uppercase tracking-widest">or click to select institutional PDF</p>
                   </div>
                </div>
              ) : (
                <div className="bg-[#081C3A] border border-[#2F80ED]/30 rounded-xl p-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#2F80ED]/10 rounded flex items-center justify-center text-[#2F80ED]">
                         <FileText size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-white uppercase tracking-tight">{selectedFileName}</p>
                         <p className="text-[10px] text-[#8FAEDB] uppercase tracking-widest">Ready for institutional upload</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedFileName(null)} className="text-red-400 hover:text-red-300">
                      <X size={16} />
                   </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-[#2F80ED] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#8FAEDB] leading-relaxed uppercase tracking-wider">
                    All documents are encrypted with AES-256 and stored in compliant sovereign infrastructure. 
                    Authorized compliance officers only.
                  </p>
                </div>
                <Button 
                  onClick={handleFinalUpload} 
                  disabled={!selectedFileName || isSimulatingUpload} 
                  className="w-full py-4 text-sm tracking-[0.2em] font-bold"
                >
                  {isSimulatingUpload ? (
                    <div className="flex items-center gap-3">
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       Finalizing Secure Upload...
                    </div>
                  ) : 'Confirm and Upload'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const Shield: React.FC<{ size?: number, className?: string }> = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);
