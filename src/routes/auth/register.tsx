import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";
import { ArrowRight, Lock, Mail, User, Phone, Loader2, AlertCircle, GraduationCap, BookOpen } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [role, setRole] = useState<UserRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    if (!agreeTerms) {
      setError("Por favor, aceite os Termos e a Política de Privacidade para continuar.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signUp({
        email,
        password,
        fullName,
        role,
        phone,
      });

      if (authError) {
        setError(authError.message || "Ocorreu um erro ao criar a conta.");
        return;
      }

      if (role === "teacher") {
        navigate({ to: "/tornar-se-professor" });
      } else {
        navigate({ to: "/onboarding" });
      }
    } catch (err: any) {
      setError(err.message || "Erro de ligação ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Criar Conta no MyTeacher
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Escolha o seu perfil e junte-se à comunidade de aprendizagem
          </p>
        </div>

        {/* ROLE SELECTOR */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-[var(--background)] p-1.5 border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
              role === "student"
                ? "bg-white text-[var(--primary)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <BookOpen className="size-4" />
            Sou Aluno
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
              role === "teacher"
                ? "bg-white text-[var(--primary)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <GraduationCap className="size-4" />
            Sou Professor
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Nome Completo
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
                <User className="size-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex.: Manuel dos Santos"
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Email
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
                <Mail className="size-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.ao"
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Telefone / WhatsApp (Opcional)
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
                <Phone className="size-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+244 9..."
                className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Palavra-passe
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
                  <Lock className="size-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Confirmar
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
                  <Lock className="size-4" />
                </div>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Repetir palavra-passe"
                  className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 size-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-xs text-[var(--muted)] leading-5">
              Concordo com os{" "}
              <Link to="/privacidade" className="font-semibold text-[var(--foreground)] underline">
                Termos de Serviço
              </Link>{" "}
              e a{" "}
              <Link to="/privacidade" className="font-semibold text-[var(--foreground)] underline">
                Política de Privacidade
              </Link>{" "}
              do MyTeacher.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                A criar conta...
              </>
            ) : (
              <>
                Criar Conta e Prosseguir
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--muted)]">
          Já tem conta?{" "}
          <Link to="/auth/login" className="font-bold text-[var(--primary)] hover:underline">
            Iniciar sessão
          </Link>
        </div>
      </div>
    </div>
  );
}
