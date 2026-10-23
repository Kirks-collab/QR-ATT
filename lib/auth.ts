import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

export type SignUpProfile = {
  full_name: string;
  role: 'student' | 'teacher';
};

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

let globalSession: Session | null = null;
let globalUser: User | null = null;
let globalLoading = true;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function setAuth(session: Session | null) {
  globalSession = session;
  globalUser = session?.user ?? null;
  globalLoading = false;
  notify();
}

// Listen for Supabase authentication changes and restore saved sessions.
let initialized = false;

function initializeAuth() {
  if (initialized) return;
  initialized = true;

  supabase.auth.onAuthStateChange((_event, session) => {
    setAuth(session);
  });

  void supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('[Auth] Session restoration failed:', error.message);
    }

    setAuth(data.session);
  });
}

initializeAuth();

export function useAuth(): AuthState {
  const [auth, setAuthState] = useState<AuthState>(() => ({
    session: globalSession,
    user: globalUser,
    loading: globalLoading,
  }));

  useEffect(() => {
    const listener = () => {
      setAuthState({
        session: globalSession,
        user: globalUser,
        loading: globalLoading,
      });
    };

    listeners.add(listener);
    listener();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return auth;
}

export async function signUp(
  email: string,
  password: string,
  profile?: SignUpProfile
) {
  try {
    console.log('[Auth] Starting signup...');

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: profile
        ? {
            data: {
              full_name: profile.full_name,
              role: profile.role,
            },
          }
        : undefined,
    });

    if (error) {
      console.error('[Auth] Signup failed:', error.message);
      return { data, error };
    }

    console.log('[Auth] Supabase signup response received.');

    // Supabase may require email confirmation before creating a session.
    if (data.session) {
      setAuth(data.session);
    }

    // Do not update profiles here. A database trigger may already create
    // the profile, and the signup response may not include a session.
    return { data, error: null };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unexpected signup error';

    console.error('[Auth] Signup request failed:', message);

    return {
      data: { user: null, session: null },
      error: {
        message,
      },
    };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('[Auth] Sign-in failed:', error.message);
      return { data, error };
    }

    setAuth(data.session);
    return { data, error: null };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Unexpected sign-in error';

    console.error('[Auth] Sign-in request failed:', message);

    return {
      data: { user: null, session: null },
      error: { message },
    };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[Auth] Sign-out failed:', error.message);
    return { error };
  }

  setAuth(null);
  return { error: null };
}
