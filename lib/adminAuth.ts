
const SESSION_KEY = 'axis_admin_session';

export interface AdminSession {
  email: string;
  loginAt: number;
}

export function adminLogin(email: string, password: string): boolean {
  const expectedEmail = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@axisplatform.com';
  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? 'AxisPortal#2026';
  if (email === expectedEmail && password === expectedPassword) {
    const session: AdminSession = { email, loginAt: Date.now() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function adminLogout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getAdminSession(): AdminSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null;
}
