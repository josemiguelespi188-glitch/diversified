
export enum AccreditedStatus {
  UNKNOWN = 'UNKNOWN',
  SELF_ATTESTED = 'SELF_ATTESTED',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum DocumentStatus {
  NOT_UPLOADED = 'Not Uploaded',
  UNDER_REVIEW = 'Under Review',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export enum InvestmentAccountType {
  INDIVIDUAL = 'Individual',
  CORPORATION = 'Corporation',
  TRUST = 'Trust',
  REVOCABLE_TRUST = 'Revocable Trust',
  IRA = 'IRA',
  K401 = '401k',
  JOINT = 'Joint Account'
}

export enum DealStructure {
  REG_D_506C = 'Reg D 506(c)',
  REG_D_506B = 'Reg D 506(b)',
  REG_A      = 'Reg A',
  REG_CF     = 'Reg CF',
}

/** Structures that require all investors to be accredited */
export const ACCREDITED_STRUCTURES: ReadonlySet<string> = new Set([
  DealStructure.REG_D_506C,
]);

export enum RequestStatus {
  PENDING = 'pending_committee_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING_FUNDING = 'Pending Funding',
  FUNDED = 'Completed',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'Waiting for Allocation'
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  dob?: string;
  account_type: InvestmentAccountType;
  onboarded: boolean;
  identity_status?: DocumentStatus;
  accreditation_status?: DocumentStatus;
}

export interface OnboardingData {
  address: string;
  country: string;
  id_number: string;
  dob: string;
  entity_name?: string;
  ein?: string;
  formation_state?: string;
  custodian_name?: string;
  ira_account_number?: string;
  is_accredited: boolean;
  net_worth_range: string;
  previous_experience: boolean;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  accredited_status: AccreditedStatus;
  identity_status: DocumentStatus;
  accreditation_status: DocumentStatus;
  created_at: string;
}

export interface Deal {
  id: string;
  title: string;
  slug: string;
  location: string;
  asset_class: string;
  strategy: string;
  structure: string;
  target_raise: number;
  capital_raised: number;
  progress: number;
  minimum_investment: number;
  lockup_months: number;
  projected_irr: number;
  cash_yield: number;
  preferred_return?: number;
  term_years: number;
  accredited_required: boolean;
  status: 'active' | 'closed';
  image_url: string;
  sponsor: string;
  tags: string[];
}

export interface InvestmentAccount {
  id: string;
  user_id: string;
  type: InvestmentAccountType;
  display_name: string;
  created_at: string;
  entity_name?: string;
  ein?: string;
  custodian_name?: string;
  account_number?: string;
  trust_name?: string;
}

export interface InvestmentRequest {
  id: string;
  user_id: string;
  deal_id: string;
  deal_name: string;
  account_id: string;
  amount: number;
  status: RequestStatus | string;
  created_at: string;
  projected_irr?: number;
  strategy?: string;
}

export interface Distribution {
  id: string;
  deal_id: string;
  deal_name?: string;
  user_id: string;
  amount: number;
  date: string;
  yield_percent: number;
  type: 'monthly' | 'quarterly' | 'annual' | 'special';
  document_url?: string;
}

export interface PlatformDocument {
  id: string;
  deal_id?: string;
  deal_name?: string;
  user_id: string;
  title: string;
  category: 'subscription' | 'tax' | 'distribution_notice' | 'ppm' | 'legal';
  file_name: string;
  date: string;
  size_kb: number;
}

export interface DealSubmission {
  id: string;
  sponsor_company: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  asset_class: string;
  target_raise: string;
  projected_irr: string;
  structure: string;
  description: string;
  preferred_call_time: string;
  submitted_at: string;
  status: 'new' | 'reviewed' | 'passed' | 'declined';
}
