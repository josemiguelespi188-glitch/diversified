
import { Deal, InvestmentAccountType, RequestStatus, InvestmentRequest, InvestmentAccount } from './types';

export const COLORS = {
  bg: '#081C3A',
  panel: '#0F2A4A',
  divercflyBlue: '#0B2E6D',
  royalBlue: '#1457B6',
  electricBlue: '#2F80ED',
  cyanGlow: '#56CCF2',
  tealAccent: '#00E0C6',
  textBody: '#C9D8F0',
  textMuted: '#8FAEDB'
};

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Phoenix Multifamily Fund',
    slug: 'phoenix-multifamily',
    location: 'Phoenix, AZ',
    asset_class: 'Multifamily',
    strategy: 'Multifamily',
    structure: '506(c) Reg D',
    target_raise: 60000000,
    capital_raised: 48500000,
    progress: 81,
    minimum_investment: 50000,
    lockup_months: 60,
    projected_irr: 14.0,
    cash_yield: 8.2,
    term_years: 5,
    committee_approved: true,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    sponsor: 'Phoenix Capital',
    tags: ['Residential', 'Core+', 'Income']
  },
  {
    id: 'd2',
    title: 'Rusty Bear Industrial',
    slug: 'rusty-bear-industrial',
    location: 'Dallas, TX',
    asset_class: 'Industrial',
    strategy: 'Industrial',
    structure: '506(c) Reg D',
    target_raise: 25000000,
    capital_raised: 18200000,
    progress: 73,
    minimum_investment: 25000,
    lockup_months: 48,
    projected_irr: 12.0,
    cash_yield: 7.6,
    term_years: 4,
    committee_approved: true,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    sponsor: 'Rusty Bear Partners',
    tags: ['Industrial', 'Logistics', 'Growth']
  },
  {
    id: 'd3',
    title: 'Cornerstone Debt Fund',
    slug: 'cornerstone-debt',
    location: 'Atlanta, GA',
    asset_class: 'Private Debt',
    strategy: 'Private Debt',
    structure: '506(b)',
    target_raise: 100000000,
    capital_raised: 75000000,
    progress: 75,
    minimum_investment: 100000,
    lockup_months: 36,
    projected_irr: 10.0,
    cash_yield: 10.0,
    term_years: 3,
    committee_approved: true,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
    sponsor: 'Cornerstone',
    tags: ['Debt', 'Fixed Income']
  },
  {
    id: 'd4',
    title: 'Urban Core Development',
    slug: 'urban-core-dev',
    location: 'Austin, TX',
    asset_class: 'Mixed-Use',
    strategy: 'Development',
    structure: '506(c)',
    target_raise: 40000000,
    capital_raised: 32000000,
    progress: 80,
    minimum_investment: 50000,
    lockup_months: 48,
    projected_irr: 16.0,
    cash_yield: 0,
    term_years: 4,
    committee_approved: true,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    sponsor: 'Urban Core LLC',
    tags: ['Development', 'Growth']
  },
  {
    id: 'd5',
    title: 'Sunrise Value Add',
    slug: 'sunrise-value-add',
    location: 'Miami, FL',
    asset_class: 'Multifamily',
    strategy: 'Multifamily',
    structure: '506(c)',
    target_raise: 35000000,
    capital_raised: 26000000,
    progress: 74,
    minimum_investment: 40000,
    lockup_months: 60,
    projected_irr: 18.0,
    cash_yield: 6.0,
    term_years: 5,
    committee_approved: true,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    sponsor: 'Sunrise Partners',
    tags: ['Multifamily', 'Value-Add']
  },
  {
    id: 'd6',
    title: 'Metro Workforce Housing',
    slug: 'metro-workforce',
    location: 'Denver, CO',
    asset_class: 'Multifamily',
    strategy: 'Multifamily',
    structure: 'Institutional',
    target_raise: 20000000,
    capital_raised: 14500000,
    progress: 72,
    minimum_investment: 20000,
    lockup_months: 72,
    projected_irr: 15.5,
    cash_yield: 7.0,
    term_years: 6,
    committee_approved: true,
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1460317442991-0ec239f36745?auto=format&fit=crop&q=80&w=800',
    sponsor: 'Metro Housing',
    tags: ['Residential', 'Stabilized']
  }
];

// Added missing required properties (user_id, created_at) to MOCK_ACCOUNTS to match InvestmentAccount interface
export const MOCK_ACCOUNTS: InvestmentAccount[] = [
  { id: 'acc_ind', user_id: 'usr_demo', type: InvestmentAccountType.INDIVIDUAL, display_name: 'Individual Account', created_at: '2024-10-01T10:00:00Z' },
  { id: 'acc_corp', user_id: 'usr_demo', type: InvestmentAccountType.CORPORATION, display_name: 'Corporation Account', created_at: '2024-10-01T10:00:00Z' },
  { id: 'acc_joint', user_id: 'usr_demo', type: InvestmentAccountType.JOINT, display_name: 'Joint Account', created_at: '2024-10-01T10:00:00Z' }
];

export const MOCK_REQUESTS: InvestmentRequest[] = [
  // Individual Account Funded
  { 
    id: 'req_1', 
    user_id: 'usr_demo',
    deal_id: 'd1',
    deal_name: 'Phoenix Multifamily Fund', 
    account_id: 'acc_ind',
    amount: 50000, 
    status: RequestStatus.FUNDED,
    projected_irr: 14.0,
    strategy: 'Multifamily',
    created_at: '2024-10-24T10:00:00Z'
  },
  { 
    id: 'req_2', 
    user_id: 'usr_demo',
    deal_id: 'd2',
    deal_name: 'Rusty Bear Industrial', 
    account_id: 'acc_ind',
    amount: 25000, 
    status: RequestStatus.FUNDED,
    projected_irr: 12.0,
    strategy: 'Industrial',
    created_at: '2024-10-28T10:00:00Z'
  },
  // Corporation Account Funded
  { 
    id: 'req_3', 
    user_id: 'usr_demo',
    deal_id: 'd3',
    deal_name: 'Cornerstone Debt Fund', 
    account_id: 'acc_corp',
    amount: 100000, 
    status: RequestStatus.FUNDED,
    projected_irr: 10.0,
    strategy: 'Private Debt',
    created_at: '2024-11-01T10:00:00Z'
  },
  // Joint Account Funded
  { 
    id: 'req_4', 
    user_id: 'usr_demo',
    deal_id: 'd4',
    deal_name: 'Urban Core Development', 
    account_id: 'acc_joint',
    amount: 75000, 
    status: RequestStatus.FUNDED,
    projected_irr: 16.0,
    strategy: 'Development',
    created_at: '2024-11-05T10:00:00Z'
  },
  // Pending allocations (assigned to all accounts/various)
  { 
    id: 'req_5', 
    user_id: 'usr_demo',
    deal_id: 'd5',
    deal_name: 'Sunrise Value Add', 
    account_id: 'acc_ind',
    amount: 40000, 
    status: RequestStatus.UNDER_REVIEW,
    strategy: 'Multifamily',
    created_at: '2024-11-08T10:00:00Z'
  },
  { 
    id: 'req_6', 
    user_id: 'usr_demo',
    deal_id: 'd6',
    deal_name: 'Metro Workforce Housing', 
    account_id: 'acc_corp',
    amount: 20000, 
    status: RequestStatus.PENDING_FUNDING,
    strategy: 'Multifamily',
    created_at: '2024-11-10T10:00:00Z'
  }
];
