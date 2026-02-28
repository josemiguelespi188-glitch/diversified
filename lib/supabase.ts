import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey;

// ─── Auth ───────────────────────────────────────────────────────────────────

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signUp = (email: string, password: string, fullName: string) =>
  supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (cb: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
  supabase.auth.onAuthStateChange(cb);

// ─── Profiles ────────────────────────────────────────────────────────────────

export const getProfile = (userId: string) =>
  supabase.from('profiles').select('*').eq('id', userId).single();

export const updateProfile = (userId: string, data: Record<string, unknown>) =>
  supabase.from('profiles').update({ ...data, updated_at: new Date().toISOString() }).eq('id', userId);

export const upsertProfile = (data: Record<string, unknown>) =>
  supabase.from('profiles').upsert(data);

// ─── Deals ───────────────────────────────────────────────────────────────────

export const getDeals = () =>
  supabase.from('deals').select('*').eq('status', 'active').order('created_at', { ascending: false });

export const getDealById = (id: string) =>
  supabase.from('deals').select('*').eq('id', id).single();

// ─── Investment Accounts ─────────────────────────────────────────────────────

export const getInvestmentAccounts = (userId: string) =>
  supabase.from('investment_accounts').select('*').eq('user_id', userId).order('created_at', { ascending: true });

export const createInvestmentAccount = (data: Record<string, unknown>) =>
  supabase.from('investment_accounts').insert(data).select().single();

// ─── Investment Requests ──────────────────────────────────────────────────────

export const getInvestmentRequests = (userId: string) =>
  supabase
    .from('investment_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

export const createInvestmentRequest = (data: Record<string, unknown>) =>
  supabase.from('investment_requests').insert(data).select().single();

// ─── Distributions ────────────────────────────────────────────────────────────

export const getDistributions = (userId: string) =>
  supabase
    .from('distributions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

// ─── Documents ────────────────────────────────────────────────────────────────

export const getDocuments = (userId: string) =>
  supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

// ─── Supabase SQL Schema (run in Supabase SQL Editor) ────────────────────────
/*
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  country text,
  dob date,
  account_type text default 'Individual',
  onboarded boolean default false,
  identity_status text default 'Not Uploaded',
  accreditation_status text default 'Not Uploaded',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Investment Accounts
create table public.investment_accounts (
  id text primary key default 'ACC_' || upper(substr(gen_random_uuid()::text, 1, 8)),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  display_name text not null,
  entity_name text,
  ein text,
  custodian_name text,
  account_number text,
  trust_name text,
  created_at timestamptz default now()
);

-- Deals (admin-managed)
create table public.deals (
  id text primary key,
  title text not null,
  slug text unique,
  location text,
  asset_class text,
  strategy text,
  structure text,
  target_raise numeric,
  capital_raised numeric default 0,
  progress numeric default 0,
  minimum_investment numeric,
  lockup_months integer,
  projected_irr numeric,
  cash_yield numeric,
  preferred_return numeric,
  term_years integer,
  committee_approved boolean default false,
  status text default 'active',
  image_url text,
  sponsor text,
  tags text[],
  created_at timestamptz default now()
);

-- Investment Requests
create table public.investment_requests (
  id text primary key default 'REQ_' || upper(substr(gen_random_uuid()::text, 1, 9)),
  user_id uuid references auth.users(id) on delete cascade,
  deal_id text references public.deals(id),
  deal_name text,
  account_id text references public.investment_accounts(id),
  amount numeric,
  status text default 'submitted',
  projected_irr numeric,
  strategy text,
  created_at timestamptz default now()
);

-- Distributions
create table public.distributions (
  id text primary key,
  deal_id text references public.deals(id),
  deal_name text,
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric,
  date timestamptz,
  yield_percent numeric,
  type text,
  document_url text,
  created_at timestamptz default now()
);

-- Documents
create table public.documents (
  id text primary key,
  deal_id text references public.deals(id),
  deal_name text,
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  category text,
  file_name text,
  date timestamptz,
  size_kb integer,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.investment_accounts enable row level security;
alter table public.investment_requests enable row level security;
alter table public.distributions enable row level security;
alter table public.documents enable row level security;

create policy "Users view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users view own accounts" on public.investment_accounts for select using (auth.uid() = user_id);
create policy "Users insert own accounts" on public.investment_accounts for insert with check (auth.uid() = user_id);
create policy "Anyone views deals" on public.deals for select using (true);
create policy "Users view own requests" on public.investment_requests for select using (auth.uid() = user_id);
create policy "Users insert own requests" on public.investment_requests for insert with check (auth.uid() = user_id);
create policy "Users view own distributions" on public.distributions for select using (auth.uid() = user_id);
create policy "Users view own documents" on public.documents for select using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
*/
