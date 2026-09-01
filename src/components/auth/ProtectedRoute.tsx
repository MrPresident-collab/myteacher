import React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";
import { Loader2, ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[var(--muted)]">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
          <span className="font-medium">A validar sessão...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-extrabold text-[var(--foreground)]">
            Autenticação Necessária
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Para aceder a esta área protegida do MyTeacher, por favor inicie sessão com a sua conta.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/auth/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
            >
              Iniciar Sessão
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 font-bold text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
        <div className="w-full rounded-3xl border border-[var(--border)] bg-white p-8 text-center shadow-lg">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-600">
            <ShieldAlert className="size-8" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-extrabold text-[var(--foreground)]">
            Acesso Restrito
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            A sua conta atual não tem permissão para aceder a esta secção.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
