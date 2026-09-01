import { Cookie, CheckCircle2 } from "lucide-react";

export function CookiesPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
          <Cookie className="size-6" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Política de Cookies
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Como utilizamos cookies para melhorar a sua experiência no MyTeacher
        </p>
      </div>

      <div className="mt-12 space-y-8 rounded-[2rem] border border-[var(--border)] bg-white p-8 sm:p-12 text-[var(--foreground)] leading-relaxed shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">1. O que são Cookies?</h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            Cookies são pequenos ficheiros de texto guardados no seu navegador pelo nosso website. Eles permitem reconhecer o seu dispositivo, manter a sua sessão de autenticação ativa e memorizar as suas preferências linguísticas durante a navegação.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold">2. Tipos de Cookies que Utilizamos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                <CheckCircle2 className="size-4 text-[var(--primary)]" />
                Estritamente Necessários
              </div>
              <p className="mt-2 text-xs text-[var(--muted)] leading-5">
                Essenciais para o funcionamento da plataforma, autenticação de utilizadores (sessões Supabase Auth) e segurança do sistema.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                <CheckCircle2 className="size-4 text-[var(--primary)]" />
                Preferências e Funcionalidade
              </div>
              <p className="mt-2 text-xs text-[var(--muted)] leading-5">
                Guardam as suas preferências de idioma, filtros de professores e definições de navegação para não ter de as reconfigurar.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">3. Como Controlar os Cookies</h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            Pode a qualquer momento configurar o seu navegador para aceitar, recusar ou eliminar cookies. No entanto, a desativação de cookies estritamente necessários pode impedir o início de sessão ou a utilização dos painéis de aluno e professor.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">4. Contacto</h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            Caso tenha qualquer questão relativa ao uso de cookies, entre em contacto através do email <a href="mailto:geral@myteacher.ao" className="text-[var(--primary)] underline font-medium">geral@myteacher.ao</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
