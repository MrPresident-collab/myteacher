/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getCurrentProfile } from "@/lib/api";
import type { Profile, StaffRole, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  staffRole: StaffRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (input: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
  }) => Promise<{ error: Error | null; user: User | null }>;
  updateProfileData: (input: { full_name?: string; username?: string; phone?: string }) => Promise<{ error: Error | null }>;
  changePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadProfile() {
    try {
      const p = await getCurrentProfile();
      setProfile(p);
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  }

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile().finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile();
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      await loadProfile();
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unable to sign in.");
      return { error };
    }
  }

  async function signUp(input: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    phone?: string;
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            role: input.role === "teacher" ? "teacher" : "student",
            phone: input.phone || null,
          },
        },
      });

      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      await loadProfile();
      return { error: null, user: data.user };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unable to create account.");
      return { error, user: null };
    }
  }

  async function updateProfileData(input: { full_name?: string; username?: string; phone?: string; }) {
    try {
      if (!user) throw new Error("No authenticated user.");

      const metadata: Record<string, string | null> = {};
      if (input.full_name !== undefined) metadata.full_name = input.full_name.trim() || null;
      if (input.username !== undefined) metadata.username = input.username.trim() || null;
      if (input.phone !== undefined) metadata.phone = input.phone.trim() || null;

      if (Object.keys(metadata).length > 0) {
        const { error: authError } = await supabase.auth.updateUser({ data: metadata });
        if (authError) throw authError;
      }

      const profileUpdates: Partial<Profile> = {};
      if (input.full_name !== undefined) profileUpdates.full_name = input.full_name.trim();
      if (input.phone !== undefined) profileUpdates.phone = input.phone.trim() || null;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ ...profileUpdates, updated_at: new Date().toISOString() })
          .eq("id", user.id);

        if (profileError) throw profileError;
      }

      await loadProfile();
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unable to update profile.");
      return { error };
    }
  }

  async function changePassword(newPassword: string) {
    try {
      if (!newPassword || newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unable to change password.");
      return { error };
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  async function refreshProfile() {
    await loadProfile();
  }

  const staffRole: StaffRole | null = profile?.staff_role ?? null;
  const role: UserRole | null = profile?.staff_role === "president"
    ? "admin"
    : (profile?.role ?? null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        staffRole,
        isLoading,
        signIn,
        signUp,
        updateProfileData,
        changePassword,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
