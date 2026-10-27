
import { supabase } from "@/lib/supabase";
import type { AuthResult, Session } from "@/types/user";

function toSession(user: {
  email?: string;
  user_metadata?: { name?: string };
}): Session {
  return {
    name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
  };
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return toSession(data.user);
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();

  if (name.length < 2) {
    return { ok: false, message: "Enter your name." };
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Enter a valid email." };
  }

  if (input.password.length < 6) {
    return {
      ok: false,
      message: "Use at least 6 characters for the password.",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: { name },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!data.user) {
    return { ok: false, message: "Unable to create account." };
  }

  if (!data.session) {
    return {
      ok: false,
      message:
        "Account created! Check your email to confirm your account before logging in.",
    };
  }

  return {
    ok: true,
    session: toSession(data.user),
  };
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!data.user) {
    return { ok: false, message: "Unable to log in." };
  }

  return {
    ok: true,
    session: toSession(data.user),
  };
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function forgotPassword(email: string): Promise<{
  ok: boolean;
  message: string;
}> {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    {
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message:
      "If an account exists for that email, a password reset link will be sent.",
  };
}

export async function updatePassword(password: string): Promise<{
  ok: boolean;
  message: string;
}> {
  if (password.length < 6) {
    return {
      ok: false,
      message: "Password must contain at least 6 characters.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return {
    ok: true,
    message: "Your password has been updated successfully.",
  };
}
