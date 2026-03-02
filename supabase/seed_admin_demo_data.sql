-- ============================================================
-- Diversify Platform — Admin Demo Seed Data
-- Deterministic PRNG: setseed(0.42)
-- Run against your Supabase project after setting up the schema
-- ============================================================

-- ── Schema ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_users (
  id              TEXT PRIMARY KEY,
  full_name       TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  phone           TEXT,
  country         TEXT DEFAULT 'United States',
  account_type    TEXT DEFAULT 'Individual',
  accredited      BOOLEAN DEFAULT FALSE,
  invested        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  kyc_status      TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  referral_code   TEXT UNIQUE,
  referred_by     TEXT,
  session_count   INTEGER DEFAULT 0,
  last_login      TIMESTAMPTZ,
  notes           TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS admin_accounts (
  id            TEXT PRIMARY KEY,
  user_id       TEXT REFERENCES admin_users(id),
  type          TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_investments (
  id          TEXT PRIMARY KEY,
  user_id     TEXT REFERENCES admin_users(id),
  deal_id     TEXT NOT NULL,
  deal_name   TEXT NOT NULL,
  account_id  TEXT REFERENCES admin_accounts(id),
  amount      NUMERIC NOT NULL,
  status      TEXT DEFAULT 'Completed',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_deals (
  id                  TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  location            TEXT,
  asset_class         TEXT,
  strategy            TEXT,
  structure           TEXT,
  target_raise        NUMERIC,
  capital_raised      NUMERIC DEFAULT 0,
  minimum_investment  NUMERIC,
  projected_irr       NUMERIC,
  cash_yield          NUMERIC,
  term_years          INTEGER,
  lockup_months       INTEGER,
  status              TEXT DEFAULT 'active',
  committee_approved  BOOLEAN DEFAULT FALSE,
  sponsor             TEXT,
  thumbnail_url       TEXT,
  youtube_url         TEXT,
  mgmt_fee            NUMERIC,
  carry_fee           NUMERIC,
  preferred_return    NUMERIC,
  tags                TEXT[],
  investor_count      INTEGER DEFAULT 0,
  total_committed     NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS admin_messages (
  id             TEXT PRIMARY KEY,
  user_id        TEXT REFERENCES admin_users(id),
  user_name      TEXT,
  user_email     TEXT,
  subject        TEXT,
  body           TEXT,
  status         TEXT DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  internal_notes TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS admin_documents (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  type         TEXT,
  scope        TEXT CHECK (scope IN ('user','deal','platform')),
  deal_id      TEXT,
  deal_name    TEXT,
  user_id      TEXT,
  user_name    TEXT,
  year         INTEGER,
  file_name    TEXT,
  size_kb      INTEGER DEFAULT 0,
  uploaded_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id                     INTEGER PRIMARY KEY DEFAULT 1,
  urgent_banner_enabled  BOOLEAN DEFAULT FALSE,
  urgent_banner_text     TEXT DEFAULT ''
);

-- ── Seed helper function ─────────────────────────────────────

CREATE OR REPLACE FUNCTION random_between(lo INTEGER, hi INTEGER) RETURNS INTEGER AS $$
  SELECT lo + FLOOR(random() * (hi - lo + 1))::INTEGER;
$$ LANGUAGE SQL;

-- ── Reset PRNG seed ──────────────────────────────────────────

SELECT setseed(0.42);

-- ── Deals ────────────────────────────────────────────────────

INSERT INTO admin_deals VALUES
('d1','Phoenix Multifamily Fund','Phoenix, AZ','Multifamily','Core+','506(c) Reg D',60000000,48500000,50000,14.0,8.2,5,60,'active',TRUE,'Phoenix Capital','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800','',1.5,20,8,ARRAY['Residential','Core+','Income'],87,48500000),
('d2','Rusty Bear Industrial','Dallas, TX','Industrial','Logistics','506(c) Reg D',25000000,18200000,25000,12.0,7.6,4,48,'active',TRUE,'Rusty Bear Partners','https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800','',1.25,20,7,ARRAY['Industrial','Logistics'],54,18200000),
('d3','Cornerstone Debt Fund','Atlanta, GA','Private Debt','Senior Debt','506(b)',100000000,75000000,100000,10.0,10.0,3,36,'active',TRUE,'Cornerstone','https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800','',1.0,15,9,ARRAY['Debt','Fixed Income'],42,75000000),
('d4','Urban Core Development','Austin, TX','Mixed-Use','Development','506(c)',40000000,32000000,50000,16.0,0,4,48,'active',TRUE,'Urban Core LLC','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800','',1.75,25,8,ARRAY['Development','Growth'],38,32000000),
('d5','Sunrise Value Add','Miami, FL','Multifamily','Value-Add','506(c)',35000000,26000000,40000,18.0,6.0,5,60,'active',TRUE,'Sunrise Partners','https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800','',1.5,20,8,ARRAY['Multifamily','Value-Add'],61,26000000),
('d6','Metro Workforce Housing','Denver, CO','Multifamily','Core','Institutional',20000000,14500000,20000,15.5,7.0,6,72,'active',TRUE,'Metro Housing','https://images.unsplash.com/photo-1460317442991-0ec239f36745?w=800','',1.25,20,7,ARRAY['Residential','Stabilized'],29,14500000),
('d7','Coastal Office Portfolio','San Diego, CA','Office','Repositioning','506(b)',45000000,45000000,75000,13.5,8.0,5,60,'closed',TRUE,'Coastal RE Group','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800','',1.5,20,8,ARRAY['Office','Income'],33,45000000),
('d8','Sunbelt Self-Storage','Charlotte, NC','Self-Storage','Development','506(c)',15000000,15000000,25000,19.0,0,3,36,'closed',TRUE,'StoreSmart Capital','https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800','',1.0,20,9,ARRAY['Storage','Growth'],18,15000000),
('d9','Midwest Logistics Hub','Columbus, OH','Industrial','Long-Lease','506(c) Reg D',55000000,38000000,50000,11.5,9.0,7,84,'active',TRUE,'Heartland Logistics','https://images.unsplash.com/photo-1586528116493-a029325540fa?w=800','',1.25,15,8,ARRAY['Industrial','Income'],47,38000000),
('d10','Riverfront Mixed-Use','Nashville, TN','Mixed-Use','Development','506(c)',80000000,52000000,100000,17.5,5.0,6,72,'active',FALSE,'Riverfront Development','https://images.unsplash.com/photo-1478860409698-8707f313ee8b?w=800','',2.0,25,9,ARRAY['Mixed-Use','Development'],22,52000000)
ON CONFLICT (id) DO NOTHING;

-- ── Users (150 rows via PL/pgSQL) ────────────────────────────

DO $$
DECLARE
  first_names TEXT[] := ARRAY['James','Maria','Carlos','Sophia','William','Olivia','Daniel','Emma','Michael','Isabella',
    'Robert','Ava','David','Mia','John','Charlotte','Richard','Amelia','Joseph','Harper',
    'Thomas','Evelyn','Charles','Abigail','Christopher','Emily','Matthew','Elizabeth','Andrew','Sofia',
    'Anthony','Avery','Mark','Ella','Donald','Scarlett','Steven','Grace','Paul','Chloe',
    'George','Victoria','Kenneth','Riley','Edward','Aria','Brian','Lily','Ronald','Zoey'];
  last_names TEXT[] := ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Taylor',
    'Anderson','Thomas','Jackson','White','Harris','Martin','Thompson','Robinson','Clark','Lewis',
    'Lee','Walker','Hall','Allen','Young','Hernandez','King','Wright','Lopez','Hill',
    'Scott','Green','Adams','Baker','Gonzalez','Nelson','Carter','Mitchell','Perez','Roberts',
    'Turner','Phillips','Campbell','Parker','Evans','Edwards','Collins','Stewart','Morris','Sanchez'];
  countries TEXT[] := ARRAY['United States','Canada','United Kingdom','Germany','France','Australia',
    'Singapore','United Arab Emirates','Switzerland','Brazil','Mexico','Japan'];
  account_types TEXT[] := ARRAY['Individual','IRA','Corporation','Trust','Joint Account','401k','Revocable Trust'];
  kyc_vals TEXT[] := ARRAY['verified','verified','verified','pending','rejected'];

  i INTEGER;
  fn TEXT; ln TEXT; full_n TEXT; em TEXT;
  accr BOOLEAN; inv BOOLEAN;
  days_ago INTEGER; kyc TEXT;
  ref_code TEXT;
BEGIN
  SELECT setseed(0.42);
  FOR i IN 1..150 LOOP
    fn       := first_names[1 + FLOOR(random() * array_length(first_names,1))::INTEGER];
    ln       := last_names[1 + FLOOR(random() * array_length(last_names,1))::INTEGER];
    full_n   := fn || ' ' || ln;
    em       := lower(fn) || '.' || lower(ln) || CASE WHEN i > 1 THEN i::TEXT ELSE '' END || '@example.com';
    accr     := random() > 0.25;
    inv      := accr AND random() > 0.35;
    days_ago := random_between(1, 730);
    kyc      := kyc_vals[1 + FLOOR(random() * array_length(kyc_vals,1))::INTEGER];
    ref_code := 'DIV' || (1000 + i)::TEXT;

    INSERT INTO admin_users (id, full_name, email, phone, country, account_type, accredited, invested,
      created_at, kyc_status, referral_code, session_count, last_login, notes)
    VALUES (
      'usr_' || lpad(i::TEXT, 3, '0'),
      full_n, em,
      '+1-' || random_between(200,999)::TEXT || '-' || random_between(100,999)::TEXT || '-' || random_between(1000,9999)::TEXT,
      countries[1 + FLOOR(random() * array_length(countries,1))::INTEGER],
      account_types[1 + FLOOR(random() * array_length(account_types,1))::INTEGER],
      accr, inv,
      NOW() - (days_ago || ' days')::INTERVAL,
      kyc, ref_code,
      random_between(1, 80),
      NOW() - (random_between(0, LEAST(30, days_ago)) || ' days')::INTERVAL,
      ''
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
END;
$$;

-- ── Accounts (~2 per user) ────────────────────────────────────

DO $$
DECLARE
  u RECORD;
  j INTEGER;
  acc_types TEXT[] := ARRAY['Individual','IRA','Corporation','Trust','Joint Account','401k'];
  atype TEXT;
BEGIN
  FOR u IN SELECT id, full_name FROM admin_users LOOP
    FOR j IN 1..2 LOOP
      atype := acc_types[1 + FLOOR(random() * array_length(acc_types,1))::INTEGER];
      INSERT INTO admin_accounts (id, user_id, type, display_name, created_at)
      VALUES (
        'acc_' || u.id || '_' || j,
        u.id,
        atype,
        atype || ' — ' || split_part(u.full_name,' ',2),
        NOW() - (random_between(1,700) || ' days')::INTERVAL
      )
      ON CONFLICT (id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- ── Investments (~200 for invested users) ─────────────────────

DO $$
DECLARE
  u RECORD;
  inv_count INTEGER;
  k INTEGER;
  deal_ids TEXT[] := ARRAY['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10'];
  deal_names TEXT[] := ARRAY['Phoenix Multifamily Fund','Rusty Bear Industrial','Cornerstone Debt Fund',
    'Urban Core Development','Sunrise Value Add','Metro Workforce Housing',
    'Coastal Office Portfolio','Sunbelt Self-Storage','Midwest Logistics Hub','Riverfront Mixed-Use'];
  statuses TEXT[] := ARRAY['Completed','Completed','Completed','Waiting for Allocation','Pending Funding'];
  d_idx INTEGER;
BEGIN
  FOR u IN SELECT id FROM admin_users WHERE invested = TRUE LOOP
    inv_count := random_between(1,4);
    FOR k IN 1..inv_count LOOP
      d_idx := 1 + FLOOR(random() * 10)::INTEGER;
      INSERT INTO admin_investments (id, user_id, deal_id, deal_name, account_id, amount, status, created_at)
      VALUES (
        'inv_' || u.id || '_' || k,
        u.id,
        deal_ids[d_idx],
        deal_names[d_idx],
        'acc_' || u.id || '_1',
        random_between(2,100) * 20000,
        statuses[1 + FLOOR(random() * array_length(statuses,1))::INTEGER],
        NOW() - (random_between(30,700) || ' days')::INTERVAL
      )
      ON CONFLICT (id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- ── Messages (30) ─────────────────────────────────────────────

INSERT INTO admin_messages (id, user_id, user_name, user_email, subject, body, status, created_at) VALUES
('msg_001','usr_001',(SELECT full_name FROM admin_users WHERE id='usr_001'),(SELECT email FROM admin_users WHERE id='usr_001'),'When will distributions be released?','Hello, I wanted to ask about the distribution schedule. Thank you.','new',NOW()-'5 days'::INTERVAL),
('msg_002','usr_002',(SELECT full_name FROM admin_users WHERE id='usr_002'),(SELECT email FROM admin_users WHERE id='usr_002'),'Question about K-1 timing','Hello, I wanted to ask about the K-1 timing. Thank you.','in_progress',NOW()-'10 days'::INTERVAL),
('msg_003','usr_003',(SELECT full_name FROM admin_users WHERE id='usr_003'),(SELECT email FROM admin_users WHERE id='usr_003'),'Accreditation document submission','Hello, I wanted to submit my accreditation documents. Thank you.','new',NOW()-'2 days'::INTERVAL),
('msg_004','usr_004',(SELECT full_name FROM admin_users WHERE id='usr_004'),(SELECT email FROM admin_users WHERE id='usr_004'),'How do I add a new investment account?','Hello, I need help adding a new account. Thank you.','resolved',NOW()-'20 days'::INTERVAL),
('msg_005','usr_005',(SELECT full_name FROM admin_users WHERE id='usr_005'),(SELECT email FROM admin_users WHERE id='usr_005'),'Interested in deal d3 — can we schedule a call?','Hello, I am interested in deal d3. Thank you.','new',NOW()-'1 day'::INTERVAL),
('msg_006','usr_006',(SELECT full_name FROM admin_users WHERE id='usr_006'),(SELECT email FROM admin_users WHERE id='usr_006'),'Tax documentation for 2025','Hello, I need my tax documentation. Thank you.','in_progress',NOW()-'15 days'::INTERVAL),
('msg_007','usr_007',(SELECT full_name FROM admin_users WHERE id='usr_007'),(SELECT email FROM admin_users WHERE id='usr_007'),'Wire instructions for funding','Hello, I need wire instructions. Thank you.','new',NOW()-'3 days'::INTERVAL),
('msg_008','usr_008',(SELECT full_name FROM admin_users WHERE id='usr_008'),(SELECT email FROM admin_users WHERE id='usr_008'),'Is there a secondary market?','Hello, I am asking about a secondary market. Thank you.','resolved',NOW()-'30 days'::INTERVAL),
('msg_009','usr_009',(SELECT full_name FROM admin_users WHERE id='usr_009'),(SELECT email FROM admin_users WHERE id='usr_009'),'Portfolio diversification question','Hello, I have a diversification question. Thank you.','new',NOW()-'7 days'::INTERVAL),
('msg_010','usr_010',(SELECT full_name FROM admin_users WHERE id='usr_010'),(SELECT email FROM admin_users WHERE id='usr_010'),'Fund performance update request','Hello, I am requesting a performance update. Thank you.','in_progress',NOW()-'12 days'::INTERVAL),
('msg_011','usr_011',(SELECT full_name FROM admin_users WHERE id='usr_011'),(SELECT email FROM admin_users WHERE id='usr_011'),'Entity verification delay','Hello, my entity verification is delayed. Thank you.','new',NOW()-'4 days'::INTERVAL),
('msg_012','usr_012',(SELECT full_name FROM admin_users WHERE id='usr_012'),(SELECT email FROM admin_users WHERE id='usr_012'),'IRA account setup help','Hello, I need help setting up an IRA account. Thank you.','resolved',NOW()-'25 days'::INTERVAL),
('msg_013','usr_013',(SELECT full_name FROM admin_users WHERE id='usr_013'),(SELECT email FROM admin_users WHERE id='usr_013'),'Subscription agreement correction','Hello, I need a correction to my subscription agreement. Thank you.','in_progress',NOW()-'8 days'::INTERVAL),
('msg_014','usr_014',(SELECT full_name FROM admin_users WHERE id='usr_014'),(SELECT email FROM admin_users WHERE id='usr_014'),'International wire fees','Hello, I have a question about international wire fees. Thank you.','new',NOW()-'6 days'::INTERVAL),
('msg_015','usr_015',(SELECT full_name FROM admin_users WHERE id='usr_015'),(SELECT email FROM admin_users WHERE id='usr_015'),'Minimum investment question','Hello, I have a question about the minimum investment. Thank you.','resolved',NOW()-'18 days'::INTERVAL),
('msg_016','usr_016',(SELECT full_name FROM admin_users WHERE id='usr_016'),(SELECT email FROM admin_users WHERE id='usr_016'),'Exit liquidity options','Hello, I am asking about exit liquidity options. Thank you.','new',NOW()-'2 days'::INTERVAL),
('msg_017','usr_017',(SELECT full_name FROM admin_users WHERE id='usr_017'),(SELECT email FROM admin_users WHERE id='usr_017'),'Co-investment opportunity?','Hello, I am interested in co-investment opportunities. Thank you.','in_progress',NOW()-'14 days'::INTERVAL),
('msg_018','usr_018',(SELECT full_name FROM admin_users WHERE id='usr_018'),(SELECT email FROM admin_users WHERE id='usr_018'),'Referral program details','Hello, I would like details about the referral program. Thank you.','resolved',NOW()-'22 days'::INTERVAL),
('msg_019','usr_019',(SELECT full_name FROM admin_users WHERE id='usr_019'),(SELECT email FROM admin_users WHERE id='usr_019'),'Committee approval timeline','Hello, I am asking about the committee approval timeline. Thank you.','new',NOW()-'1 day'::INTERVAL),
('msg_020','usr_020',(SELECT full_name FROM admin_users WHERE id='usr_020'),(SELECT email FROM admin_users WHERE id='usr_020'),'Capital call notice question','Hello, I have a question about the capital call notice. Thank you.','in_progress',NOW()-'9 days'::INTERVAL),
('msg_021','usr_021',(SELECT full_name FROM admin_users WHERE id='usr_021'),(SELECT email FROM admin_users WHERE id='usr_021'),'Updated accreditation letter','Hello, I need to submit an updated accreditation letter. Thank you.','new',NOW()-'3 days'::INTERVAL),
('msg_022','usr_022',(SELECT full_name FROM admin_users WHERE id='usr_022'),(SELECT email FROM admin_users WHERE id='usr_022'),'Spouse added to account','Hello, I would like to add my spouse to my account. Thank you.','resolved',NOW()-'35 days'::INTERVAL),
('msg_023','usr_023',(SELECT full_name FROM admin_users WHERE id='usr_023'),(SELECT email FROM admin_users WHERE id='usr_023'),'Change of address','Hello, I need to update my address. Thank you.','resolved',NOW()-'28 days'::INTERVAL),
('msg_024','usr_024',(SELECT full_name FROM admin_users WHERE id='usr_024'),(SELECT email FROM admin_users WHERE id='usr_024'),'Quarterly report availability','Hello, I am asking about the quarterly report. Thank you.','new',NOW()-'5 days'::INTERVAL),
('msg_025','usr_025',(SELECT full_name FROM admin_users WHERE id='usr_025'),(SELECT email FROM admin_users WHERE id='usr_025'),'Deal pipeline preview','Hello, I am interested in the deal pipeline. Thank you.','in_progress',NOW()-'11 days'::INTERVAL),
('msg_026','usr_026',(SELECT full_name FROM admin_users WHERE id='usr_026'),(SELECT email FROM admin_users WHERE id='usr_026'),'New investor onboarding issue','Hello, I have an issue with my onboarding. Thank you.','new',NOW()-'2 days'::INTERVAL),
('msg_027','usr_027',(SELECT full_name FROM admin_users WHERE id='usr_027'),(SELECT email FROM admin_users WHERE id='usr_027'),'Document upload error','Hello, I encountered an error uploading my document. Thank you.','in_progress',NOW()-'7 days'::INTERVAL),
('msg_028','usr_028',(SELECT full_name FROM admin_users WHERE id='usr_028'),(SELECT email FROM admin_users WHERE id='usr_028'),'Re-investment options','Hello, I would like to know about re-investment options. Thank you.','resolved',NOW()-'40 days'::INTERVAL),
('msg_029','usr_029',(SELECT full_name FROM admin_users WHERE id='usr_029'),(SELECT email FROM admin_users WHERE id='usr_029'),'Market outlook question','Hello, I have a question about the market outlook. Thank you.','new',NOW()-'4 days'::INTERVAL),
('msg_030','usr_030',(SELECT full_name FROM admin_users WHERE id='usr_030'),(SELECT email FROM admin_users WHERE id='usr_030'),'Platform feature request','Hello, I would like to request a platform feature. Thank you.','in_progress',NOW()-'16 days'::INTERVAL)
ON CONFLICT (id) DO NOTHING;

-- ── Documents (15) ────────────────────────────────────────────

INSERT INTO admin_documents (id, title, type, scope, deal_id, deal_name, year, file_name, size_kb, uploaded_at) VALUES
('adoc_01','Master Subscription Agreement Template','subscription','platform',NULL,NULL,2025,'Master_Subscription_Template_2025.pdf',1240,NOW()-'180 days'::INTERVAL),
('adoc_02','Platform Operating Agreement 2025','legal','platform',NULL,NULL,2025,'Platform_Operating_Agreement_2025.pdf',3100,NOW()-'160 days'::INTERVAL),
('adoc_03','Risk Disclosure Statement','legal','platform',NULL,NULL,2025,'Risk_Disclosure_2025.pdf',890,NOW()-'150 days'::INTERVAL),
('adoc_04','Phoenix MF Fund PPM','ppm','deal','d1','Phoenix Multifamily Fund',2024,'PPM_PhoenixMF_2024.pdf',4210,NOW()-'400 days'::INTERVAL),
('adoc_05','Rusty Bear Industrial PPM','ppm','deal','d2','Rusty Bear Industrial',2024,'PPM_RustyBear_2024.pdf',3870,NOW()-'380 days'::INTERVAL),
('adoc_06','Cornerstone Debt Fund PPM','ppm','deal','d3','Cornerstone Debt Fund',2024,'PPM_Cornerstone_2024.pdf',5100,NOW()-'360 days'::INTERVAL),
('adoc_07','Q4 2024 Phoenix MF Distribution Notice','distribution_notice','deal','d1','Phoenix Multifamily Fund',2024,'Dist_Q4_2024_PhoenixMF.pdf',245,NOW()-'60 days'::INTERVAL),
('adoc_08','Q4 2024 Rusty Bear Distribution Notice','distribution_notice','deal','d2','Rusty Bear Industrial',2024,'Dist_Q4_2024_RustyBear.pdf',218,NOW()-'60 days'::INTERVAL),
('adoc_09','Q1 2025 Phoenix MF Distribution Notice','distribution_notice','deal','d1','Phoenix Multifamily Fund',2025,'Dist_Q1_2025_PhoenixMF.pdf',251,NOW()-'5 days'::INTERVAL),
('adoc_10','Schedule K-1 Package 2024','tax','platform',NULL,NULL,2024,'K1_Package_2024.pdf',18400,NOW()-'14 days'::INTERVAL),
('adoc_11','Cornerstone Jan 2025 Distribution','distribution_notice','deal','d3','Cornerstone Debt Fund',2025,'Dist_Jan_2025_Cornerstone.pdf',198,NOW()-'28 days'::INTERVAL),
('adoc_12','Urban Core Development Subscription Template','subscription','deal','d4','Urban Core Development',2025,'Sub_UrbanCore_2025.pdf',980,NOW()-'90 days'::INTERVAL),
('adoc_13','Q4 2024 Investor Performance Report','report','platform',NULL,NULL,2024,'Performance_Report_Q4_2024.pdf',2700,NOW()-'45 days'::INTERVAL),
('adoc_14','Metro Workforce Housing PPM','ppm','deal','d6','Metro Workforce Housing',2025,'PPM_MetroWorkforce_2025.pdf',4050,NOW()-'120 days'::INTERVAL),
('adoc_15','Accreditation Verification Guidelines','legal','platform',NULL,NULL,2025,'Accreditation_Guidelines_2025.pdf',560,NOW()-'200 days'::INTERVAL)
ON CONFLICT (id) DO NOTHING;

-- ── Default Settings ──────────────────────────────────────────

INSERT INTO admin_settings (id, urgent_banner_enabled, urgent_banner_text)
VALUES (1, FALSE, '⚠️ Important: The platform will undergo scheduled maintenance on March 15, 2026, from 2–4 AM EST.')
ON CONFLICT (id) DO NOTHING;

-- ── Clean up helper function ──────────────────────────────────

DROP FUNCTION IF EXISTS random_between(INTEGER, INTEGER);
