// Simple localStorage-based account system
// Accounts are stored separately from app data so multiple users can share a device.

const ACCOUNTS_KEY = 'kinneret_accounts';
const SESSION_KEY = 'kinneret_session';

export interface Account {
  username: string;
  /** SHA-256 hex digest of the password */
  passwordHash: string;
  createdAt: string;
}

interface AccountStore {
  accounts: Account[];
}

/** Hash a password using the Web Crypto API (SHA-256). */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function loadAccounts(): AccountStore {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return { accounts: [] };
    return JSON.parse(raw) as AccountStore;
  } catch {
    return { accounts: [] };
  }
}

function saveAccounts(store: AccountStore): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(store));
}

/** Get currently logged-in username, or null. */
export function getSession(): string | null {
  return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
}

/** Set the logged-in session (persisted across tabs via localStorage). */
export function setSession(username: string): void {
  localStorage.setItem(SESSION_KEY, username);
}

/** Clear the session (logout). */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/** Check if any accounts exist. */
export function hasAccounts(): boolean {
  return loadAccounts().accounts.length > 0;
}

/**
 * Sign up a new account. Returns an error message or null on success.
 */
export async function signUp(
  username: string,
  password: string
): Promise<string | null> {
  const trimmed = username.trim();
  if (trimmed.length < 2) return 'Username must be at least 2 characters';
  if (trimmed.length > 30) return 'Username must be 30 characters or less';
  if (password.length < 4) return 'Password must be at least 4 characters';

  const store = loadAccounts();
  const exists = store.accounts.some(
    (a) => a.username.toLowerCase() === trimmed.toLowerCase()
  );
  if (exists) return 'Username already taken';

  const passwordHash = await hashPassword(password);
  store.accounts.push({
    username: trimmed,
    passwordHash,
    createdAt: new Date().toISOString(),
  });
  saveAccounts(store);
  setSession(trimmed);
  return null;
}

/**
 * Log in with username and password. Returns an error message or null on success.
 */
export async function logIn(
  username: string,
  password: string
): Promise<string | null> {
  const trimmed = username.trim();
  const store = loadAccounts();
  const account = store.accounts.find(
    (a) => a.username.toLowerCase() === trimmed.toLowerCase()
  );
  if (!account) return 'Account not found';

  const passwordHash = await hashPassword(password);
  if (account.passwordHash !== passwordHash) return 'Incorrect password';

  setSession(account.username);
  return null;
}
