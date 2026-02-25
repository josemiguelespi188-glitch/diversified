import { supabase } from './supabase';
import { Deal, InvestmentAccount, InvestmentRequest } from '../types';

// ─────────────────────────────────────────────────────────
// DEALS
// ─────────────────────────────────────────────────────────

export async function getDeals(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('title');
  if (error) throw error;
  return (data ?? []) as Deal[];
}

// ─────────────────────────────────────────────────────────
// INVESTMENT ACCOUNTS
// ─────────────────────────────────────────────────────────

export async function getAccountsByUser(userId: string): Promise<InvestmentAccount[]> {
  const { data, error } = await supabase
    .from('investment_accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as InvestmentAccount[];
}

export async function insertAccount(
  account: Omit<InvestmentAccount, 'id' | 'created_at'>
): Promise<InvestmentAccount> {
  const { data, error } = await supabase
    .from('investment_accounts')
    .insert(account)
    .select()
    .single();
  if (error) throw error;
  return data as InvestmentAccount;
}

// ─────────────────────────────────────────────────────────
// INVESTMENT REQUESTS
// ─────────────────────────────────────────────────────────

export async function getRequestsByUser(userId: string): Promise<InvestmentRequest[]> {
  const { data, error } = await supabase
    .from('investment_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as InvestmentRequest[];
}

export async function insertRequest(
  request: Omit<InvestmentRequest, 'id' | 'created_at'>
): Promise<InvestmentRequest> {
  const id = 'REQ_' + Math.random().toString(36).substring(2, 11).toUpperCase();
  const { data, error } = await supabase
    .from('investment_requests')
    .insert({ ...request, id })
    .select()
    .single();
  if (error) throw error;
  return data as InvestmentRequest;
}

export async function updateRequestStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('investment_requests')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}
