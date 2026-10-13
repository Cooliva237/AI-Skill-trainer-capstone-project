import type { AuthResult, Session } from "@/types/user";

const USERS_KEY = "ast-users";
const SESSION_KEY = "ast-session";

type StoredUser = {
  name: string;
  email: string;
  password: string;
};

// MOCK AUTH ONLY.
// Passwords are saved in localStorage so login can reject a wrong one.
// Do not use this for real accounts. Replace this file with Supabase Auth later.
// The screens should not need to change when that happens.

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isStoredUser);
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function isStoredUser(value: unknown): value is StoredUser {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.name === "string" &&
    typeof record.email === "string" &&
    typeof record.password === "string"
  );
}

function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.name === "string" && typeof record.email === "string";
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function signup(input: {
  name: string;
  email: string;
  password: string;
}): AuthResult {
  const name = input.name.trim().replace(/\s+/g, " ");
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (name.length < 2) {
    return { ok: false, message: "Enter your name." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Enter a valid email." };
  }
  if (password.length < 6) {
    return { ok: false, message: "Use at least 6 characters for the password." };
  }

  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    return { ok: false, message: "An account with that email already exists. Log in instead." };
  }

  users.push({ name, email, password });
  writeUsers(users);

  const session = { name, email };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function login(input: { email: string; password: string }): AuthResult {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Enter a valid email." };
  }
  if (password.length === 0) {
    return { ok: false, message: "Enter your password." };
  }

  const user = readUsers().find((item) => item.email === email);
  if (!user) {
    return { ok: false, message: "No account uses that email yet." };
  }
  if (user.password !== password) {
    return { ok: false, message: "That password does not match." };
  }

  const session = { name: user.name, email: user.email };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function logout(): void {
  window.localStorage.removeItem(SESSION_KEY);
}
