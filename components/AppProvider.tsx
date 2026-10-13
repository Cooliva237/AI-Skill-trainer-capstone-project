"use client";

import { gymLessons } from "@/data/gymLessons";
import { GYM_SKILL_ID } from "@/data/skills";
import {
  getSession,
  login as loginAccount,
  logout as logoutAccount,
  signup as signupAccount,
} from "@/lib/auth";
import {
  createEmptyProgress,
  loadSkillProgress,
  markLessonComplete,
  saveSkillProgress,
} from "@/lib/progress";
import type { UserProgress } from "@/types/progress";
import type { AuthResult, Session } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

// Session and lesson progress live here.
// Both are saved in localStorage so a refresh keeps them.
// Later, replace lib/auth.ts and lib/progress.ts with Supabase.
// These screens can stay as they are.
//
// localStorage is not available during the server render, so we load it
// through useSyncExternalStore. That avoids a hydration mismatch.

type Snapshot = {
  ready: boolean;
  session: Session | null;
  progress: UserProgress;
};

type AppContextValue = Snapshot & {
  signup: (input: { name: string; email: string; password: string }) => AuthResult;
  login: (input: { email: string; password: string }) => AuthResult;
  logout: () => void;
  completeLesson: (lessonId: string) => void;
  resetGymProgress: () => void;
};

const emptyProgress = createEmptyProgress(gymLessons);

const serverSnapshot: Snapshot = {
  ready: false,
  session: null,
  progress: emptyProgress,
};

let clientSnapshot: Snapshot | null = null;
let uiReady = false;
const listeners = new Set<() => void>();

function publish(next: Snapshot) {
  clientSnapshot = next;
  listeners.forEach((listener) => listener());
}

function loadClientSnapshot(): Snapshot {
  const session = getSession();
  return {
    ready: true,
    session,
    progress: session
      ? loadSkillProgress(session.email, GYM_SKILL_ID, gymLessons)
      : emptyProgress,
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Snapshot {
  // Stay on the server snapshot until after hydration, then show saved data.
  if (!uiReady) return serverSnapshot;
  return clientSnapshot ?? serverSnapshot;
}

function getServerSnapshot(): Snapshot {
  return serverSnapshot;
}

function signup(input: { name: string; email: string; password: string }): AuthResult {
  const result = signupAccount(input);
  if (!result.ok) return result;

  const progress = createEmptyProgress(gymLessons);
  saveSkillProgress(result.session.email, GYM_SKILL_ID, progress);
  publish({ ready: true, session: result.session, progress });
  return result;
}

function login(input: { email: string; password: string }): AuthResult {
  const result = loginAccount(input);
  if (!result.ok) return result;

  publish({
    ready: true,
    session: result.session,
    progress: loadSkillProgress(result.session.email, GYM_SKILL_ID, gymLessons),
  });
  return result;
}

function logout() {
  logoutAccount();
  publish({ ready: true, session: null, progress: emptyProgress });
}

function completeLesson(lessonId: string) {
  const current = getSnapshot();
  if (!current.session) return;

  const progress = markLessonComplete(current.progress, lessonId, gymLessons);
  saveSkillProgress(current.session.email, GYM_SKILL_ID, progress);
  publish({ ...current, progress });
}

function resetGymProgress() {
  const current = getSnapshot();
  if (!current.session) return;

  saveSkillProgress(current.session.email, GYM_SKILL_ID, emptyProgress);
  publish({ ...current, progress: emptyProgress });
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    uiReady = true;
    publish(clientSnapshot ?? loadClientSnapshot());
  }, []);

  const value: AppContextValue = {
    ...snapshot,
    signup,
    login,
    logout,
    completeLesson,
    resetGymProgress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return value;
}
