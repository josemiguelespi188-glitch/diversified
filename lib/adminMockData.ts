
import { InvestmentAccountType } from '../types';

// ── Deterministic PRNG (mulberry32, seed 42) ───────────────────────────────
function mkRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mkRng(42);
const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const rand = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

// ── Admin User type ────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  account_type: InvestmentAccountType;
  accredited: boolean;
  invested: boolean;
  created_at: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  referral_code: string;
  referred_by?: string;
  session_count: number;
  last_login: string;
  notes: string;
}

export interface AdminAccountRec {
  id: string;
  user_id: string;
  type: InvestmentAccountType;
  display_name: string;
  created_at: string;
}

export interface AdminInvestmentRec {
  id: string;
  user_id: string;
  deal_id: string;
  deal_name: string;
  account_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface AdminDeal {
  id: string;
  title: string;
  location: string;
  asset_class: string;
  strategy: string;
  structure: string;
  target_raise: number;
  capital_raised: number;
  minimum_investment: number;
  projected_irr: number;
  cash_yield: number;
  term_years: number;
  lockup_months: number;
  status: 'active' | 'closed';
  accredited_required: boolean;
  sponsor: string;
  thumbnail_url: string;
  youtube_url: string;
  mgmt_fee: number;
  carry_fee: number;
  preferred_return: number;
  tags: string[];
  investor_count: number;
  total_committed: number;
}

export interface AdminMessage {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  body: string;
  status: 'new' | 'in_progress' | 'resolved';
  created_at: string;
  internal_notes: string;
}

export interface AdminDocument {
  id: string;
  title: string;
  type: 'subscription' | 'tax' | 'distribution_notice' | 'ppm' | 'legal' | 'report';
  scope: 'user' | 'deal' | 'platform';
  deal_id?: string;
  deal_name?: string;
  user_id?: string;
  user_name?: string;
  year: number;
  file_name: string;
  size_kb: number;
  uploaded_at: string;
}

export interface AdminSettings {
  urgent_banner_enabled: boolean;
  urgent_banner_text: string;
}

// ── Names / Countries pool ─────────────────────────────────────────────────
const FIRST = ['James','Maria','Carlos','Sophia','William','Olivia','Daniel','Emma','Michael','Isabella',
  'Robert','Ava','David','Mia','John','Charlotte','Richard','Amelia','Joseph','Harper',
  'Thomas','Evelyn','Charles','Abigail','Christopher','Emily','Matthew','Elizabeth','Andrew','Sofia',
  'Anthony','Avery','Mark','Ella','Donald','Scarlett','Steven','Grace','Paul','Chloe',
  'George','Victoria','Kenneth','Riley','Edward','Aria','Brian','Lily','Ronald','Zoey'];
const LAST = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Taylor',
  'Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Robinson','Clark','Lewis',
  'Lee','Walker','Hall','Allen','Young','Hernandez','King','Wright','Lopez','Hill',
  'Scott','Green','Adams','Baker','Gonzalez','Nelson','Carter','Mitchell','Perez','Roberts',
  'Turner','Phillips','Campbell','Parker','Evans','Edwards','Collins','Stewart','Morris','Sanchez'];
const COUNTRIES = ['United States','Canada','United Kingdom','Germany','France','Australia','Singapore',
  'United Arab Emirates','Switzerland','Brazil','Mexico','Japan','South Korea','Netherlands'];
const ACCOUNT_TYPES = [
  InvestmentAccountType.INDIVIDUAL, InvestmentAccountType.IRA, InvestmentAccountType.CORPORATION,
  InvestmentAccountType.TRUST, InvestmentAccountType.JOINT, InvestmentAccountType.K401,
  InvestmentAccountType.REVOCABLE_TRUST,
];
const ACCOUNT_WEIGHTS = [32, 26, 15, 10, 7, 6, 4];

function weightedPick<T>(arr: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

function isoDate(daysAgo: number): string {
  const d = new Date('2026-03-01');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

// ── Generate 150 Admin Users ───────────────────────────────────────────────
export function generateAdminUsers(): AdminUser[] {
  // Reset PRNG for reproducibility — we bake a local rng copy
  const localRng = mkRng(42);
  const lPick = <T>(arr: T[]) => arr[Math.floor(localRng() * arr.length)];
  const lRand = (min: number, max: number) => min + Math.floor(localRng() * (max - min + 1));
  const lWeightedPick = <T>(arr: T[], w: number[]) => {
    const total = w.reduce((a, b) => a + b, 0);
    let r = localRng() * total;
    for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; }
    return arr[arr.length - 1];
  };

  return Array.from({ length: 150 }, (_, i) => {
    const first = lPick(FIRST);
    const last = lPick(LAST);
    const full_name = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i > 0 ? i : ''}@example.com`;
    const accredited = localRng() > 0.25;
    const invested = accredited && localRng() > 0.35;
    const daysAgo = lRand(1, 730);
    const kyc = localRng() < 0.75 ? 'verified' : localRng() < 0.5 ? 'pending' : 'rejected';
    const code = `DIV${(i + 1001).toString()}`;
    return {
      id: `usr_${(i + 1).toString().padStart(3, '0')}`,
      full_name,
      email,
      phone: `+1-${lRand(200, 999)}-${lRand(100, 999)}-${lRand(1000, 9999)}`,
      country: lPick(COUNTRIES),
      account_type: lWeightedPick(ACCOUNT_TYPES, ACCOUNT_WEIGHTS),
      accredited,
      invested,
      created_at: isoDate(daysAgo),
      kyc_status: kyc as 'pending' | 'verified' | 'rejected',
      referral_code: code,
      referred_by: i > 10 && localRng() > 0.6 ? `DIV${lRand(1001, 1010)}` : undefined,
      session_count: lRand(1, 80),
      last_login: isoDate(lRand(0, Math.min(30, daysAgo))),
      notes: '',
    };
  });
}

// ── Generate ~300 Accounts ─────────────────────────────────────────────────
export function generateAdminAccounts(users: AdminUser[]): AdminAccountRec[] {
  const localRng = mkRng(43);
  const lRand = (min: number, max: number) => min + Math.floor(localRng() * (max - min + 1));
  const lWeightedPick = <T>(arr: T[], w: number[]) => {
    const total = w.reduce((a, b) => a + b, 0);
    let r = localRng() * total;
    for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; }
    return arr[arr.length - 1];
  };
  const accs: AdminAccountRec[] = [];
  users.forEach((u) => {
    const count = lRand(1, 3);
    for (let j = 0; j < count; j++) {
      const type = lWeightedPick(ACCOUNT_TYPES, ACCOUNT_WEIGHTS);
      accs.push({
        id: `acc_${u.id}_${j}`,
        user_id: u.id,
        type,
        display_name: `${type} — ${u.full_name.split(' ')[1]}`,
        created_at: u.created_at,
      });
    }
  });
  return accs;
}

// ── Generate ~200 Investments ──────────────────────────────────────────────
const DEAL_NAMES = [
  'Phoenix Multifamily Fund','Rusty Bear Industrial','Cornerstone Debt Fund','Urban Core Development',
  'Sunrise Value Add','Metro Workforce Housing','Coastal Office Portfolio','Sunbelt Self-Storage',
  'Midwest Logistics Hub','Riverfront Mixed-Use',
];
const DEAL_IDS = ['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10'];
const INV_STATUSES = ['Completed','Completed','Completed','Waiting for Allocation','Pending Funding'];

export function generateAdminInvestments(users: AdminUser[], accounts: AdminAccountRec[]): AdminInvestmentRec[] {
  const localRng = mkRng(44);
  const lPick = <T>(arr: T[]) => arr[Math.floor(localRng() * arr.length)];
  const lRand = (min: number, max: number) => min + Math.floor(localRng() * (max - min + 1));

  const investedUsers = users.filter((u) => u.invested);
  const invs: AdminInvestmentRec[] = [];
  investedUsers.forEach((u) => {
    const userAccs = accounts.filter((a) => a.user_id === u.id);
    if (userAccs.length === 0) return;
    const count = lRand(1, 4);
    for (let i = 0; i < count; i++) {
      const dealIdx = lRand(0, 9);
      const amount = lRand(2, 100) * 20000;
      invs.push({
        id: `inv_${u.id}_${i}`,
        user_id: u.id,
        deal_id: DEAL_IDS[dealIdx],
        deal_name: DEAL_NAMES[dealIdx],
        account_id: lPick(userAccs).id,
        amount,
        status: lPick(INV_STATUSES),
        created_at: isoDate(lRand(30, 700)),
      });
    }
  });
  return invs;
}

// ── 10 Admin Deals ─────────────────────────────────────────────────────────
export function generateAdminDeals(): AdminDeal[] {
  return [
    { id:'d1',  title:'Phoenix Multifamily Fund',  location:'Phoenix, AZ',    asset_class:'Multifamily',   strategy:'Core+',        structure:'Reg D 506(c)', target_raise:60000000,  capital_raised:48500000, minimum_investment:50000,  projected_irr:14.0, cash_yield:8.2,  term_years:5, lockup_months:60, status:'active', accredited_required:true,  sponsor:'Phoenix Capital',       thumbnail_url:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', youtube_url:'', mgmt_fee:1.5,  carry_fee:20, preferred_return:8, tags:['Residential','Core+','Income'],   investor_count:87, total_committed:48500000 },
    { id:'d2',  title:'Rusty Bear Industrial',      location:'Dallas, TX',     asset_class:'Industrial',    strategy:'Logistics',    structure:'Reg D 506(c)', target_raise:25000000,  capital_raised:18200000, minimum_investment:25000,  projected_irr:12.0, cash_yield:7.6,  term_years:4, lockup_months:48, status:'active', accredited_required:true,  sponsor:'Rusty Bear Partners',   thumbnail_url:'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', youtube_url:'', mgmt_fee:1.25, carry_fee:20, preferred_return:7, tags:['Industrial','Logistics'],        investor_count:54, total_committed:18200000 },
    { id:'d3',  title:'Cornerstone Debt Fund',      location:'Atlanta, GA',    asset_class:'Private Debt',  strategy:'Senior Debt',  structure:'Reg D 506(b)', target_raise:100000000, capital_raised:75000000, minimum_investment:100000, projected_irr:10.0, cash_yield:10.0, term_years:3, lockup_months:36, status:'active', accredited_required:false, sponsor:'Cornerstone',           thumbnail_url:'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800', youtube_url:'', mgmt_fee:1.0,  carry_fee:15, preferred_return:9, tags:['Debt','Fixed Income'],          investor_count:42, total_committed:75000000 },
    { id:'d4',  title:'Urban Core Development',     location:'Austin, TX',     asset_class:'Mixed-Use',     strategy:'Development',  structure:'Reg D 506(c)', target_raise:40000000,  capital_raised:32000000, minimum_investment:50000,  projected_irr:16.0, cash_yield:0,    term_years:4, lockup_months:48, status:'active', accredited_required:true,  sponsor:'Urban Core LLC',        thumbnail_url:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', youtube_url:'', mgmt_fee:1.75, carry_fee:25, preferred_return:8, tags:['Development','Growth'],         investor_count:38, total_committed:32000000 },
    { id:'d5',  title:'Sunrise Value Add',          location:'Miami, FL',      asset_class:'Multifamily',   strategy:'Value-Add',    structure:'Reg D 506(c)', target_raise:35000000,  capital_raised:26000000, minimum_investment:40000,  projected_irr:18.0, cash_yield:6.0,  term_years:5, lockup_months:60, status:'active', accredited_required:true,  sponsor:'Sunrise Partners',      thumbnail_url:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', youtube_url:'', mgmt_fee:1.5,  carry_fee:20, preferred_return:8, tags:['Multifamily','Value-Add'],      investor_count:61, total_committed:26000000 },
    { id:'d6',  title:'Metro Workforce Housing',    location:'Denver, CO',     asset_class:'Multifamily',   strategy:'Core',         structure:'Reg A',        target_raise:20000000,  capital_raised:14500000, minimum_investment:20000,  projected_irr:15.5, cash_yield:7.0,  term_years:6, lockup_months:72, status:'active', accredited_required:false, sponsor:'Metro Housing',         thumbnail_url:'https://images.unsplash.com/photo-1460317442991-0ec239f36745?w=800', youtube_url:'', mgmt_fee:1.25, carry_fee:20, preferred_return:7, tags:['Residential','Stabilized'],    investor_count:29, total_committed:14500000 },
    { id:'d7',  title:'Coastal Office Portfolio',   location:'San Diego, CA',  asset_class:'Office',        strategy:'Repositioning', structure:'Reg D 506(b)', target_raise:45000000,  capital_raised:45000000, minimum_investment:75000,  projected_irr:13.5, cash_yield:8.0,  term_years:5, lockup_months:60, status:'closed', accredited_required:false, sponsor:'Coastal RE Group',      thumbnail_url:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', youtube_url:'', mgmt_fee:1.5,  carry_fee:20, preferred_return:8, tags:['Office','Income'],              investor_count:33, total_committed:45000000 },
    { id:'d8',  title:'Sunbelt Self-Storage',       location:'Charlotte, NC',  asset_class:'Self-Storage',  strategy:'Development',  structure:'Reg D 506(c)', target_raise:15000000,  capital_raised:15000000, minimum_investment:25000,  projected_irr:19.0, cash_yield:0,    term_years:3, lockup_months:36, status:'closed', accredited_required:true,  sponsor:'StoreSmart Capital',    thumbnail_url:'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800', youtube_url:'', mgmt_fee:1.0,  carry_fee:20, preferred_return:9, tags:['Storage','Growth'],             investor_count:18, total_committed:15000000 },
    { id:'d9',  title:'Midwest Logistics Hub',      location:'Columbus, OH',   asset_class:'Industrial',    strategy:'Long-Lease',   structure:'Reg D 506(c)', target_raise:55000000,  capital_raised:38000000, minimum_investment:50000,  projected_irr:11.5, cash_yield:9.0,  term_years:7, lockup_months:84, status:'active', accredited_required:true,  sponsor:'Heartland Logistics',   thumbnail_url:'https://images.unsplash.com/photo-1586528116493-a029325540fa?w=800', youtube_url:'', mgmt_fee:1.25, carry_fee:15, preferred_return:8, tags:['Industrial','Income'],          investor_count:47, total_committed:38000000 },
    { id:'d10', title:'Riverfront Mixed-Use',       location:'Nashville, TN',  asset_class:'Mixed-Use',     strategy:'Development',  structure:'Reg CF',       target_raise:80000000,  capital_raised:52000000, minimum_investment:100000, projected_irr:17.5, cash_yield:5.0,  term_years:6, lockup_months:72, status:'active', accredited_required:false, sponsor:'Riverfront Development',thumbnail_url:'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=800', youtube_url:'', mgmt_fee:2.0,  carry_fee:25, preferred_return:9, tags:['Mixed-Use','Development'],     investor_count:22, total_committed:52000000 },
  ];
}

// ── 30 Messages ────────────────────────────────────────────────────────────
const SUBJECTS = [
  'When will distributions be released?','Question about K-1 timing','Accreditation document submission','How do I add a new investment account?',
  'Interested in deal d3 — can we schedule a call?','Tax documentation for 2025','Wire instructions for funding','Is there a secondary market?',
  'Portfolio diversification question','Fund performance update request','Entity verification delay','IRA account setup help',
  'Subscription agreement correction','International wire fees','Minimum investment question','Exit liquidity options',
  'Co-investment opportunity?','Referral program details','Committee approval timeline','Capital call notice question',
  'Updated accreditation letter','Spouse added to account','Change of address','Quarterly report availability',
  'Deal pipeline preview','New investor onboarding issue','Document upload error','Re-investment options',
  'Market outlook question','Platform feature request',
];
const MSG_STATUSES: Array<'new' | 'in_progress' | 'resolved'> = ['new','new','in_progress','resolved'];

export function generateAdminMessages(users: AdminUser[]): AdminMessage[] {
  const localRng = mkRng(45);
  const lPick = <T>(arr: T[]) => arr[Math.floor(localRng() * arr.length)];
  const lRand = (min: number, max: number) => min + Math.floor(localRng() * (max - min + 1));

  return Array.from({ length: 30 }, (_, i) => {
    const u = users[lRand(0, users.length - 1)];
    return {
      id: `msg_${(i + 1).toString().padStart(3, '0')}`,
      user_id: u.id,
      user_name: u.full_name,
      user_email: u.email,
      subject: SUBJECTS[i % SUBJECTS.length],
      body: `Hello, I wanted to reach out regarding: ${SUBJECTS[i % SUBJECTS.length]}. Please let me know at your earliest convenience. Thank you.`,
      status: lPick(MSG_STATUSES),
      created_at: isoDate(lRand(0, 90)),
      internal_notes: '',
    };
  });
}

// ── 15 Documents ───────────────────────────────────────────────────────────
export function generateAdminDocuments(users: AdminUser[], deals: AdminDeal[]): AdminDocument[] {
  const docs: AdminDocument[] = [
    { id:'adoc_01', title:'Master Subscription Agreement Template', type:'subscription', scope:'platform', year:2025, file_name:'Master_Subscription_Template_2025.pdf', size_kb:1240, uploaded_at:isoDate(180) },
    { id:'adoc_02', title:'Platform Operating Agreement 2025', type:'legal', scope:'platform', year:2025, file_name:'Platform_Operating_Agreement_2025.pdf', size_kb:3100, uploaded_at:isoDate(160) },
    { id:'adoc_03', title:'Risk Disclosure Statement', type:'legal', scope:'platform', year:2025, file_name:'Risk_Disclosure_2025.pdf', size_kb:890, uploaded_at:isoDate(150) },
    { id:'adoc_04', title:'Phoenix MF Fund PPM', type:'ppm', scope:'deal', deal_id:'d1', deal_name:'Phoenix Multifamily Fund', year:2024, file_name:'PPM_PhoenixMF_2024.pdf', size_kb:4210, uploaded_at:isoDate(400) },
    { id:'adoc_05', title:'Rusty Bear Industrial PPM', type:'ppm', scope:'deal', deal_id:'d2', deal_name:'Rusty Bear Industrial', year:2024, file_name:'PPM_RustyBear_2024.pdf', size_kb:3870, uploaded_at:isoDate(380) },
    { id:'adoc_06', title:'Cornerstone Debt Fund PPM', type:'ppm', scope:'deal', deal_id:'d3', deal_name:'Cornerstone Debt Fund', year:2024, file_name:'PPM_Cornerstone_2024.pdf', size_kb:5100, uploaded_at:isoDate(360) },
    { id:'adoc_07', title:'Q4 2024 Phoenix MF Distribution Notice', type:'distribution_notice', scope:'deal', deal_id:'d1', deal_name:'Phoenix Multifamily Fund', year:2024, file_name:'Dist_Q4_2024_PhoenixMF.pdf', size_kb:245, uploaded_at:isoDate(60) },
    { id:'adoc_08', title:'Q4 2024 Rusty Bear Distribution Notice', type:'distribution_notice', scope:'deal', deal_id:'d2', deal_name:'Rusty Bear Industrial', year:2024, file_name:'Dist_Q4_2024_RustyBear.pdf', size_kb:218, uploaded_at:isoDate(60) },
    { id:'adoc_09', title:'Q1 2025 Phoenix MF Distribution Notice', type:'distribution_notice', scope:'deal', deal_id:'d1', deal_name:'Phoenix Multifamily Fund', year:2025, file_name:'Dist_Q1_2025_PhoenixMF.pdf', size_kb:251, uploaded_at:isoDate(5) },
    { id:'adoc_10', title:'Schedule K-1 Package 2024', type:'tax', scope:'platform', year:2024, file_name:'K1_Package_2024.pdf', size_kb:18400, uploaded_at:isoDate(14) },
    { id:'adoc_11', title:'Cornerstone Jan 2025 Distribution', type:'distribution_notice', scope:'deal', deal_id:'d3', deal_name:'Cornerstone Debt Fund', year:2025, file_name:'Dist_Jan_2025_Cornerstone.pdf', size_kb:198, uploaded_at:isoDate(28) },
    { id:'adoc_12', title:'Urban Core Development Subscription Template', type:'subscription', scope:'deal', deal_id:'d4', deal_name:'Urban Core Development', year:2025, file_name:'Sub_UrbanCore_2025.pdf', size_kb:980, uploaded_at:isoDate(90) },
    { id:'adoc_13', title:'Q4 2024 Investor Performance Report', type:'report', scope:'platform', year:2024, file_name:'Performance_Report_Q4_2024.pdf', size_kb:2700, uploaded_at:isoDate(45) },
    { id:'adoc_14', title:'Metro Workforce Housing PPM', type:'ppm', scope:'deal', deal_id:'d6', deal_name:'Metro Workforce Housing', year:2025, file_name:'PPM_MetroWorkforce_2025.pdf', size_kb:4050, uploaded_at:isoDate(120) },
    { id:'adoc_15', title:'Accreditation Verification Guidelines', type:'legal', scope:'platform', year:2025, file_name:'Accreditation_Guidelines_2025.pdf', size_kb:560, uploaded_at:isoDate(200) },
  ];
  return docs;
}

// ── Platform-wide KPI data ─────────────────────────────────────────────────
export interface GrowthPoint { month: string; users: number; invested: number; }

export function generateGrowthData(): GrowthPoint[] {
  const months = ['Mar 25','Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26'];
  let u = 12; let inv = 4;
  return months.map((month) => {
    u += rand(8, 22); inv += rand(3, 12);
    return { month, users: u, invested: Math.min(inv, u) };
  });
}

export const DEFAULT_SETTINGS: AdminSettings = {
  urgent_banner_enabled: false,
  urgent_banner_text: '⚠️ Important: The platform will undergo scheduled maintenance on March 15, 2026, from 2–4 AM EST.',
};
