-- ============================================================
-- AXIS KEY™ — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────
-- 1. DEALS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deals (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  location          TEXT NOT NULL,
  asset_class       TEXT NOT NULL,
  strategy          TEXT NOT NULL,
  structure         TEXT NOT NULL,
  target_raise      BIGINT NOT NULL,
  capital_raised    BIGINT NOT NULL,
  progress          INTEGER NOT NULL,
  minimum_investment BIGINT NOT NULL,
  lockup_months     INTEGER NOT NULL,
  projected_irr     DECIMAL(6,2) NOT NULL,
  cash_yield        DECIMAL(6,2) NOT NULL,
  preferred_return  DECIMAL(6,2),
  term_years        INTEGER NOT NULL,
  committee_approved BOOLEAN NOT NULL DEFAULT FALSE,
  status            TEXT NOT NULL CHECK (status IN ('active', 'closed')),
  image_url         TEXT NOT NULL,
  sponsor           TEXT NOT NULL,
  tags              TEXT[] NOT NULL DEFAULT '{}'
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deals_public_read" ON deals;
CREATE POLICY "deals_public_read" ON deals FOR SELECT USING (TRUE);

-- ─────────────────────────────────────────────────────────
-- 2. INVESTMENT ACCOUNTS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investment_accounts (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL,
  type           TEXT NOT NULL,
  display_name   TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  entity_name    TEXT,
  ein            TEXT,
  custodian_name TEXT,
  account_number TEXT,
  trust_name     TEXT
);

ALTER TABLE investment_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "accounts_open" ON investment_accounts;
CREATE POLICY "accounts_open" ON investment_accounts USING (TRUE);

-- ─────────────────────────────────────────────────────────
-- 3. INVESTMENT REQUESTS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investment_requests (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  deal_id       TEXT NOT NULL REFERENCES deals(id),
  deal_name     TEXT NOT NULL,
  account_id    TEXT NOT NULL REFERENCES investment_accounts(id),
  amount        BIGINT NOT NULL,
  status        TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  projected_irr DECIMAL(6,2),
  strategy      TEXT
);

ALTER TABLE investment_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "requests_open" ON investment_requests;
CREATE POLICY "requests_open" ON investment_requests USING (TRUE);

-- ─────────────────────────────────────────────────────────
-- 4. DISTRIBUTIONS
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS distributions (
  id            TEXT PRIMARY KEY,
  deal_id       TEXT NOT NULL REFERENCES deals(id),
  user_id       TEXT NOT NULL,
  amount        BIGINT NOT NULL,
  date          DATE NOT NULL,
  yield_percent DECIMAL(6,2) NOT NULL,
  document_url  TEXT
);

ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "distributions_open" ON distributions;
CREATE POLICY "distributions_open" ON distributions USING (TRUE);


-- ============================================================
-- SEED DATA — Deals
-- ============================================================
INSERT INTO deals (id, title, slug, location, asset_class, strategy, structure, target_raise, capital_raised, progress, minimum_investment, lockup_months, projected_irr, cash_yield, term_years, committee_approved, status, image_url, sponsor, tags)
VALUES
  ('d1', 'Phoenix Multifamily Fund', 'phoenix-multifamily', 'Phoenix, AZ', 'Multifamily', 'Multifamily', '506(c) Reg D', 60000000, 48500000, 81, 50000, 60, 14.0, 8.2, 5, TRUE, 'active', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800', 'Phoenix Capital', ARRAY['Residential', 'Core+', 'Income']),
  ('d2', 'Rusty Bear Industrial', 'rusty-bear-industrial', 'Dallas, TX', 'Industrial', 'Industrial', '506(c) Reg D', 25000000, 18200000, 73, 25000, 48, 12.0, 7.6, 4, TRUE, 'active', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', 'Rusty Bear Partners', ARRAY['Industrial', 'Logistics', 'Growth']),
  ('d3', 'Cornerstone Debt Fund', 'cornerstone-debt', 'Atlanta, GA', 'Private Debt', 'Private Debt', '506(b)', 100000000, 75000000, 75, 100000, 36, 10.0, 10.0, 3, TRUE, 'active', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800', 'Cornerstone', ARRAY['Debt', 'Fixed Income']),
  ('d4', 'Urban Core Development', 'urban-core-dev', 'Austin, TX', 'Mixed-Use', 'Development', '506(c)', 40000000, 32000000, 80, 50000, 48, 16.0, 0, 4, TRUE, 'active', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', 'Urban Core LLC', ARRAY['Development', 'Growth']),
  ('d5', 'Sunrise Value Add', 'sunrise-value-add', 'Miami, FL', 'Multifamily', 'Multifamily', '506(c)', 35000000, 26000000, 74, 40000, 60, 18.0, 6.0, 5, TRUE, 'active', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', 'Sunrise Partners', ARRAY['Multifamily', 'Value-Add']),
  ('d6', 'Metro Workforce Housing', 'metro-workforce', 'Denver, CO', 'Multifamily', 'Multifamily', 'Institutional', 20000000, 14500000, 72, 20000, 72, 15.5, 7.0, 6, TRUE, 'active', 'https://images.unsplash.com/photo-1460317442991-0ec239f36745?auto=format&fit=crop&q=80&w=800', 'Metro Housing', ARRAY['Residential', 'Stabilized'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA — Demo User Accounts
-- ============================================================
INSERT INTO investment_accounts (id, user_id, type, display_name, created_at)
VALUES
  ('acc_ind',  'usr_demo', 'Individual',    'Individual Account',   '2024-10-01T10:00:00Z'),
  ('acc_corp', 'usr_demo', 'Corporation',   'Corporation Account',  '2024-10-01T10:00:00Z'),
  ('acc_joint','usr_demo', 'Joint Account', 'Joint Account',        '2024-10-01T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA — Demo Investment Requests
-- ============================================================
INSERT INTO investment_requests (id, user_id, deal_id, deal_name, account_id, amount, status, created_at, projected_irr, strategy)
VALUES
  ('req_1', 'usr_demo', 'd1', 'Phoenix Multifamily Fund', 'acc_ind',   50000,  'Completed',              '2024-10-24T10:00:00Z', 14.0, 'Multifamily'),
  ('req_2', 'usr_demo', 'd2', 'Rusty Bear Industrial',    'acc_ind',   25000,  'Completed',              '2024-10-28T10:00:00Z', 12.0, 'Industrial'),
  ('req_3', 'usr_demo', 'd3', 'Cornerstone Debt Fund',    'acc_corp',  100000, 'Completed',              '2024-11-01T10:00:00Z', 10.0, 'Private Debt'),
  ('req_4', 'usr_demo', 'd4', 'Urban Core Development',   'acc_joint', 75000,  'Completed',              '2024-11-05T10:00:00Z', 16.0, 'Development'),
  ('req_5', 'usr_demo', 'd5', 'Sunrise Value Add',        'acc_ind',   40000,  'Waiting for Allocation', '2024-11-08T10:00:00Z', NULL, 'Multifamily'),
  ('req_6', 'usr_demo', 'd6', 'Metro Workforce Housing',  'acc_corp',  20000,  'Pending Funding',        '2024-11-10T10:00:00Z', NULL, 'Multifamily')
ON CONFLICT (id) DO NOTHING;
