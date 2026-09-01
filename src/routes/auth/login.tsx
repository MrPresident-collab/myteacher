import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError.message === "Invalid login credentials"
          ? "Credenciais inválidas. Verifique o seu email e palavra-passe."
          : authError.message || "Ocorreu um erro ao iniciar sessão.");
        return;
      }

      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.message || "Erro de ligação ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl sm:p-10">
        <div className="text-center">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-sm">
            <Lock className="size-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Iniciar Sessão
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Bem-vindo de volta ao <strong className="text-[var(--foreground)]">MyTeacher</strong>
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Email
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
                <Mail className="size-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.ao"
                className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Palavra-passe
              </label>
              <a href="#" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                Esqueceu-se?
              </a>
            </div>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
                <Lock className="size-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                A entrar...
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--muted)]">
          Ainda não tem conta?{" "}
          <Link to="/auth/register" className="font-bold text-[var(--primary)] hover:underline">
            Criar conta gratuita
          </Link>
        </div>
      </div>
    </div>
  );
}
