"use client";

import { gymLessons } from "@/data/gymLessons";
import { GYM_SKILL_ID } from "@/data/skills";
import {
  getSession,
  login as loginAccount,
  logout as logoutAccount,
  signup as signupAccount,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";
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

type Snapshot = {
  ready: boolean;
  session: Session | null;
  progress: UserProgress;
};

type AppContextValue = Snapshot & {
  signup: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;

  login: (input: {
    email: string;
    password: string;
  }) => Promise<AuthResult>;

  logout: () => Promise<void>;
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

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Snapshot {
  if (!uiReady) return serverSnapshot;
  return clientSnapshot ?? serverSnapshot;
}

function getServerSnapshot(): Snapshot {
  return serverSnapshot;
}

function createSnapshot(session: Session | null): Snapshot {
  return {
    ready: true,
    session,
    progress: session
      ? loadSkillProgress(session.email, GYM_SKILL_ID, gymLessons)
      : emptyProgress,
  };
}

async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const result = await signupAccount(input);

  if (!result.ok) return result;

  publish(createSnapshot(result.session));
  return result;
}

async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const result = await loginAccount(input);

  if (!result.ok) return result;

  publish(createSnapshot(result.session));
  return result;
}

async function logout(): Promise<void> {
  await logoutAccount();
  publish(createSnapshot(null));
}

function completeLesson(lessonId: string) {
  const current = getSnapshot();

  if (!current.session) return;

  const progress = markLessonComplete(
    current.progress,
    lessonId,
    gymLessons
  );

  saveSkillProgress(
    current.session.email,
    GYM_SKILL_ID,
    progress
  );

  publish({ ...current, progress });
}

function resetGymProgress() {
  const current = getSnapshot();

  if (!current.session) return;

  saveSkillProgress(
    current.session.email,
    GYM_SKILL_ID,
    emptyProgress
  );

  publish({ ...current, progress: emptyProgress });
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    uiReady = true;

    let active = true;

    async function initializeSession() {
      try {
        const session = await getSession();

        if (active) {
          publish(createSnapshot(session));
        }
      } catch {
        if (active) {
          publish(createSnapshot(null));
        }
      }
    }

    void initializeSession();

    const { data } = supabase.auth.onAuthStateChange(
      (_event, authSession) => {
        if (!active) return;

        if (!authSession?.user) {
          publish(createSnapshot(null));
          return;
        }

        const user = authSession.user;

        const session: Session = {
          name:
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "User",
          email: user.email || "",
        };

        publish(createSnapshot(session));
      }
    );

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value: AppContextValue = {
    ...snapshot,
    signup,
    login,
    logout,
    completeLesson,
    resetGymProgress,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return value;
}
