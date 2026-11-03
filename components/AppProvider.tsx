'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { gymLessons } from '@/data/gymLessons';
import { GYM_SKILL_ID } from '@/data/skills';
import * as localAuth from '@/lib/auth';
import { createEmptyProgress, loadSkillProgress, markLessonComplete, saveSkillProgress } from '@/lib/progress';
import { cloudError, dataMode, firebaseClient } from '@/lib/firebase/client';
import { updateCloudProgress, watchProgress } from '@/lib/firebase/data';
import type { AuthResult, Session } from '@/types/user';
import type { UserProgress } from '@/types/progress';

type State = { ready: boolean; session: Session | null; progress: UserProgress; progressReady: boolean; error: string | null };
type Context = State & {
  storageMode: 'local' | 'firebase'; saving: boolean;
  signup: (input: { name: string; email: string; password: string }) => Promise<AuthResult>;
  login: (input: { email: string; password: string }) => Promise<AuthResult>;
  logout: () => Promise<boolean>;
  completeLesson: (id: string) => Promise<void>;
  resetGymProgress: () => Promise<void>;
};
const empty = () => createEmptyProgress(gymLessons);
const AppContext = createContext<Context | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ ready: false, session: null, progress: empty(), progressReady: false, error: null });
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const account = useRef<string | null>(null);
  useEffect(() => {
    let live = true;
    let unwatch: (() => void) | undefined;
    let unsubscribe: (() => void) | undefined;
    Promise.resolve().then(() => {
      if (!live) return;
      if (dataMode === 'local') {
        const session = localAuth.getSession(); account.current = session?.email ?? null;
        setState({ ready: true, session, progress: session ? loadSkillProgress(session.email, GYM_SKILL_ID, gymLessons) : empty(), progressReady: true, error: null });
        return;
      }
      try {
        const { auth } = firebaseClient();
        unsubscribe = onAuthStateChanged(auth, user => {
          unwatch?.(); account.current = user?.uid ?? null;
          savingRef.current = false; setSaving(false);
          const session = user ? { uid: user.uid, email: user.email ?? '', name: user.displayName ?? user.email?.split('@')[0] ?? 'Learner' } : null;
          setState({ ready: true, session, progress: empty(), progressReady: !user, error: null });
          if (user) {
            const uid = user.uid;
            unwatch = watchProgress(uid, progress => {
              if (live && account.current === uid) setState(s => ({ ...s, progress, progressReady: true, error: null }));
            }, error => {
              if (live && account.current === uid) setState(s => ({ ...s, error: cloudError(error), progressReady: false }));
            });
          }
        }, error => { if (live) setState(s => ({ ...s, ready: true, error: cloudError(error) })); });
      } catch (error) { setState(s => ({ ...s, ready: true, error: cloudError(error) })); }
    });
    return () => { live = false; account.current = null; unwatch?.(); unsubscribe?.(); };
  }, []);
  async function authenticate(input: { name?: string; email: string; password: string }, signup: boolean): Promise<AuthResult> {
    try {
      const email = input.email.trim().toLowerCase();
      const name = input.name?.trim() ?? '';
      if (signup && (name.length < 2 || name.length > 100)) return { ok: false, message: 'Enter a name between 2 and 100 characters.' };
      if (dataMode === 'local') {
        const result = signup ? localAuth.signup({ name, email, password: input.password }) : localAuth.login({ email, password: input.password });
        if (result.ok) {
          account.current = email;
          const progress = signup ? empty() : loadSkillProgress(email, GYM_SKILL_ID, gymLessons);
          if (signup) saveSkillProgress(email, GYM_SKILL_ID, progress);
          setState({ ready: true, session: result.session, progress, progressReady: true, error: null });
        }
        return result;
      }
      const { auth, db } = firebaseClient();
      const result = signup ? await createUserWithEmailAndPassword(auth, email, input.password) : await signInWithEmailAndPassword(auth, email, input.password);
      if (signup) {
        try { await updateProfile(result.user, { displayName: name }); }
        catch { setState(s => ({ ...s, error: 'Account created, but its display name could not be saved. You can still log in.' })); }
      }
      const session = { uid: result.user.uid, email, name: result.user.displayName ?? (name || email.split('@')[0]) };
      if (account.current === result.user.uid) setState(s => ({ ...s, session }));
      // Profile failure must not make an already-created Auth account look like a failed signup.
      setDoc(doc(db, 'users', result.user.uid), { name: session.name, email, updatedAt: serverTimestamp() }, { merge: true }).catch(error => {
        if (account.current === result.user.uid) setState(s => ({ ...s, error: `Signed in, but profile could not sync: ${cloudError(error)}` }));
      });
      return { ok: true, session };
    } catch (error) { return { ok: false, message: cloudError(error) }; }
  }
  async function logout(): Promise<boolean> {
    try {
      if (dataMode === 'firebase') await signOut(firebaseClient().auth);
      else localAuth.logout();
      account.current = null;
      setState({ ready: true, session: null, progress: empty(), progressReady: true, error: null });
      return true;
    } catch (error) { setState(s => ({ ...s, error: cloudError(error) })); return false; }
  }
  async function changeProgress(id: string | null) {
    if (!state.session || !state.progressReady || savingRef.current) return;
    const owner = account.current;
    savingRef.current = true; setSaving(true);
    try {
      if (dataMode === 'firebase') await updateCloudProgress(state.session.uid!, id);
      else {
        const progress = id === null ? empty() : markLessonComplete(state.progress, id, gymLessons);
        saveSkillProgress(state.session.email, GYM_SKILL_ID, progress);
        setState(s => ({ ...s, progress, error: null }));
      }
    } catch (error) { if (owner === account.current) setState(s => ({ ...s, error: `Progress was not saved: ${cloudError(error)}` })); }
    finally { if (owner === account.current) { savingRef.current = false; setSaving(false); } }
  }
  return <AppContext.Provider value={{ ...state, storageMode: dataMode, saving, signup: input => authenticate(input, true), login: input => authenticate(input, false), logout, completeLesson: id => changeProgress(id), resetGymProgress: () => changeProgress(null) }}>
    <div className="border-b border-line bg-raised px-5 py-2 text-center text-xs text-muted" role="status">{dataMode === 'firebase' ? (saving ? 'Saving to Firebase…' : state.session && !state.progressReady ? 'Firebase connected · waiting for lesson data. Check your connection if this persists.' : 'Firebase mode · accounts and progress use cloud storage') : 'Local demo mode · Firebase is not connected. Use test passwords only.'}</div>
    {state.error && <div role="alert" className="border-b border-coral bg-raised px-5 py-3 text-sm">{state.error} <button className="underline" onClick={() => window.location.reload()}>Reload to retry</button></div>}
    {children}
  </AppContext.Provider>;
}
export function useApp() { const value = useContext(AppContext); if (!value) throw new Error('useApp must be used inside AppProvider'); return value; }
