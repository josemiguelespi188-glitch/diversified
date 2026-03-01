/**
 * ============================================================
 * ANALYTICS MODULE — Diversify Private Capital Platform
 * ============================================================
 *
 * Central hub for Firebase Analytics integration.
 * Implements the AARRR funnel measurement framework.
 *
 * ────────────────────────────────────────────────────────────
 * QUICK START FOR DEVELOPERS
 * ────────────────────────────────────────────────────────────
 *
 * 1. Import what you need:
 *      import { trackEvent, trackPageView, setUserId, setUserProperties } from '@/lib/analytics';
 *
 * 2. Track a custom event:
 *      trackEvent('button_click', { button_name: 'allocate', page: 'portfolio' });
 *
 * 3. Track a page view:
 *      trackPageView('/dashboard', 'Portfolio Overview');
 *
 * 4. Set user identity after login:
 *      setUserId(user.id);
 *      setUserProperties({ is_accredited: 'true', has_investment: 'false' });
 *
 * 5. Add Firebase env vars to your .env file (all VITE_FIREBASE_* are optional —
 *    analytics silently no-ops if VITE_FIREBASE_MEASUREMENT_ID is missing):
 *      VITE_FIREBASE_API_KEY=...
 *      VITE_FIREBASE_AUTH_DOMAIN=...
 *      VITE_FIREBASE_PROJECT_ID=...
 *      VITE_FIREBASE_STORAGE_BUCKET=...
 *      VITE_FIREBASE_MESSAGING_SENDER_ID=...
 *      VITE_FIREBASE_APP_ID=...
 *      VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX   ← required to enable analytics
 *
 * ────────────────────────────────────────────────────────────
 * EVENT CATALOGUE
 * ────────────────────────────────────────────────────────────
 *
 * GENERAL
 *   app_init             — app mounts for the first time
 *   page_view            — user visits a key screen
 *                          params: page_path, page_title, source, utm_*
 *   button_click         — important CTA pressed
 *                          params: button_name, page, extra_context
 *   session_start_custom — session opens (app mount / auth restore)
 *   session_end_custom   — session closes (logout)
 *
 * AUTHENTICATION
 *   login_started        — user clicks "Sign In"
 *   login_success        — sign-in completes successfully
 *                          params: has_previous_account (true|false)
 *   signup_started       — user clicks "Open Account"
 *   account_created      — new account fully created
 *                          params: account_type
 *
 * ACCREDITATION
 *   accreditation_started   — user enters the accreditation flow
 *   accreditation_completed — all required documents uploaded/verified
 *
 * INVESTMENTS (ALLOCATION FUNNEL)
 *   allocation_started   — deal selected, modal opened
 *                          params: deal_id
 *   allocation_submitted — allocation request confirmed (step 5)
 *                          params: deal_id, amount, account_type
 *   allocation_funded    — status transitions to FUNDED
 *                          params: deal_id, amount, fee_admin, share_profit
 *
 * PORTFOLIO
 *   portfolio_viewed     — dashboard / portfolio screen rendered
 *                          params: has_investment, deals_count
 *
 * REFERRALS
 *   referral_invite_sent        — user shares a referral link
 *   referral_signup_completed   — a referred user signs up
 *
 * ────────────────────────────────────────────────────────────
 * USER PROPERTIES
 * ────────────────────────────────────────────────────────────
 * All values are strings (Firebase requirement — convert numbers with String()).
 *
 *   is_accredited                  "true" | "false"
 *   has_investment                 "true" | "false"
 *   total_invested_usd             e.g. "150000"
 *   avg_ticket_usd                 e.g. "50000"
 *   deals_count                    e.g. "3"
 *   accounts_count                 e.g. "2"
 *   ira_accounts_count             e.g. "1"
 *   individual_accounts_count      e.g. "1"
 *   corp_accounts_count            e.g. "0"
 *   joint_accounts_count           e.g. "0"
 *   trust_accounts_count           e.g. "0"
 *   revocable_trust_accounts_count e.g. "0"
 *
 * These properties power audience segments for:
 *   - Total user count
 *   - Users with zero investments (has_investment = "false")
 *   - Average deals per user (diversification)
 *   - % of accredited users (is_accredited = "true")
 *   - Account type distribution by count properties
 *
 * ────────────────────────────────────────────────────────────
 * AARRR FUNNEL MAPPING
 * ────────────────────────────────────────────────────────────
 *
 * ACQUISITION
 *   Events:  page_view (params: source, utm_source, utm_medium, utm_campaign)
 *   How-to:  UTM params are read automatically from the URL on every page_view.
 *            In Firebase → Reports → Acquisition you can see traffic by source.
 *   Sources: Meta Ads → utm_source=meta, utm_medium=paid
 *            Content  → utm_source=blog, utm_medium=organic
 *            Referral → utm_source=referral
 *   Metric:  Unique users per channel; new users over time.
 *
 * ACTIVATION
 *   Events:  accreditation_completed, allocation_submitted
 *   Formula: Activation rate =
 *              users_with(accreditation_completed AND allocation_submitted)
 *              ÷ users_with(account_created)
 *   How-to:  Build a Firebase funnel:
 *              account_created → accreditation_completed → allocation_submitted
 *   Metric:  % of sign-ups who invest at least once.
 *
 * RETENTION
 *   Events:  session_start_custom, portfolio_viewed
 *   How-to:  - DAU / WAU / MAU via session_start_custom counts.
 *            - 30-day retention: users who fire session_start_custom within
 *              30 days of their first allocation_submitted event.
 *            - Portfolio engagement: frequency of portfolio_viewed per user.
 *   Metric:  % of investors who return within 30 days after first allocation.
 *
 * REFERRAL
 *   Events:  referral_invite_sent, referral_signup_completed
 *   Formula: K-factor = referral_signup_completed / referral_invite_sent
 *   How-to:  Segment referral_signup_completed by is_accredited to measure
 *            quality of referred users.
 *   Metric:  % of existing investors who refer; % of referred users who convert.
 *
 * REVENUE
 *   Events:  allocation_funded (params: amount, fee_admin, share_profit)
 *   Formula: Total AUM       = SUM(amount) across all allocation_funded
 *            Fee revenue     = SUM(fee_admin) across all allocation_funded
 *            Avg ticket      = user property avg_ticket_usd
 *            Revenue/user    = SUM(fee_admin) / unique users with allocation_funded
 *   How-to:  Use BigQuery export or Firebase custom reports with numeric params.
 *   Metric:  Total capital deployed, fee income, avg deal size per investor.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getAnalytics,
  logEvent,
  setUserId as fbSetUserId,
  setUserProperties as fbSetUserProperties,
} from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

// ─── Firebase Configuration ──────────────────────────────────────────────────
// All values come from environment variables — never hard-code credentials.
// Set VITE_FIREBASE_MEASUREMENT_ID to enable analytics; omit it to disable.

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            as string | undefined,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        as string | undefined,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         as string | undefined,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             as string | undefined,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     as string | undefined,
};

// Singleton — initialized once, lazily on first event call.
let analyticsInstance: Analytics | null = null;
let initAttempted = false;

function getAnalyticsInstance(): Analytics | null {
  // Guard: skip in non-browser environments (SSR / test runners).
  if (typeof window === 'undefined') return null;

  if (initAttempted) return analyticsInstance;
  initAttempted = true;

  // Analytics is disabled when measurementId is not configured.
  if (!firebaseConfig.measurementId) {
    if (import.meta.env.DEV) {
      console.info('[Analytics] Disabled — set VITE_FIREBASE_MEASUREMENT_ID to enable.');
    }
    return null;
  }

  try {
    const app = getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApps()[0];
    analyticsInstance = getAnalytics(app);
    if (import.meta.env.DEV) {
      console.info('[Analytics] Firebase Analytics initialized (debug mode).');
    }
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Firebase:', err);
  }

  return analyticsInstance;
}

// ─── UTM Helper ───────────────────────────────────────────────────────────────

function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
    const val = params.get(key);
    if (val) utm[key] = val;
  });
  return utm;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Track a named event with optional parameters.
 * Safe to call even when Firebase is not configured — it will no-op silently
 * in production and log to the console in development.
 *
 * @example
 *   trackEvent('button_click', { button_name: 'allocate', page: 'portfolio' });
 */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) {
    if (import.meta.env.DEV) {
      console.debug(`[Analytics] trackEvent("${name}")`, params ?? '');
    }
    return;
  }
  logEvent(analytics, name, params);
}

/**
 * Track a page view. Automatically appends UTM params found in the URL.
 *
 * @param path   The logical path, e.g. '/portal/dashboard'
 * @param title  Human-readable screen name, e.g. 'Portfolio Overview'
 * @param extra  Any additional params to attach
 *
 * @example
 *   trackPageView('/portal/dashboard', 'Dashboard');
 */
export function trackPageView(
  path: string,
  title: string,
  extra?: Record<string, string>,
): void {
  const utm = getUtmParams();
  trackEvent('page_view', {
    page_path:    path,
    page_title:   title,
    source:       utm.utm_source   || 'direct',
    utm_source:   utm.utm_source   || '',
    utm_medium:   utm.utm_medium   || '',
    utm_campaign: utm.utm_campaign || '',
    ...extra,
  });
}

/**
 * Associate all subsequent events with a user ID.
 * Call immediately after successful authentication.
 *
 * @example
 *   setUserId(user.id);
 */
export function setUserId(userId: string): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  fbSetUserId(analytics, userId);
}

/**
 * Set audience-level user properties.
 * All values must be strings (Firebase requirement — use String() for numbers).
 *
 * Supported properties (see catalogue at top of file):
 *   is_accredited, has_investment, total_invested_usd, avg_ticket_usd,
 *   deals_count, accounts_count, ira_accounts_count, individual_accounts_count,
 *   corp_accounts_count, joint_accounts_count, trust_accounts_count,
 *   revocable_trust_accounts_count
 *
 * @example
 *   setUserProperties({
 *     is_accredited: 'true',
 *     has_investment: 'false',
 *     accounts_count: '2',
 *   });
 */
export function setUserProperties(props: Record<string, string>): void {
  const analytics = getAnalyticsInstance();
  if (!analytics) return;
  fbSetUserProperties(analytics, props);
}
