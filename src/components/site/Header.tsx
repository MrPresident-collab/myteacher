import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { Logo } from "./Logo";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES } from "@/lib/languages";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, profile, role, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        // Scrolling down
        setVisible(false);
      } else {
        // Scrolling up
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const closeMenus = () => {
    setMobileOpen(false);
    setLanguagesOpen(false);
  };

  const navLinks = [
    { to: "/business", label: "Para empresas" },
    { to: "/como-funciona", label: "Como funciona" },
    { to: "/sobre", label: "Sobre nós" },
  ] as const;

  const dashboardUrl = role === "admin" ? "/admin" : role === "teacher" ? "/dashboard/professor" : "/dashboard/aluno";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {/* LANGUAGES DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguagesOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            >
              Línguas
              <ChevronDown className={`size-3.5 transition-transform ${languagesOpen ? "rotate-180" : ""}`} />
            </button>

            {languagesOpen && (
              <>
                <button
                  type="button"
                  aria-label="Fechar menu de línguas"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setLanguagesOpen(false)}
                />
                <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-xl">
                  {LANGUAGES.map((language) => (
                    <Link
                      key={language.code}
                      to="/professores"
                      search={{ language: language.code }}
                      onClick={() => setLanguagesOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
                    >
                      <Flag code={language.code} size="sm" />
                      <div>
                        <span className="block">{language.name}</span>
                        <span className="block text-xs text-[var(--muted)]">{language.nativeName}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeProps={{ className: "bg-[var(--secondary)] text-[var(--primary)]" }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* AUTH ACTIONS */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={dashboardUrl}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)]/5 px-4 py-2 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--foreground)]/10"
              >
                <LayoutDashboard className="size-4 text-[var(--primary)]" />
                Painel ({profile?.full_name?.split(" ")[0] || "Conta"})
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Sair"
                title="Terminar sessão"
                className="grid size-9 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                Entrar
              </Link>
              <Link
                to="/tornar-se-professor"
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
              >
                Tornar-se professor
              </Link>
              <Link
                to="/onboarding"
                className="rounded-full bg-[var(--primary)] px-4.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              >
                Começar
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          type="button"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="grid size-9 place-items-center rounded-xl border border-[var(--border)] lg:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 pb-6 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 pt-3">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Aprender uma língua
            </p>
            {LANGUAGES.map((language) => (
              <Link
                key={language.code}
                to="/professores"
                search={{ language: language.code }}
                onClick={closeMenus}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
              >
                <Flag code={language.code} size="sm" />
                {language.name}
              </Link>
            ))}

            <div className="my-2 h-px bg-[var(--border)]" />
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenus}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-[var(--border)]" />
            {user ? (
              <div className="space-y-2 pt-2">
                <Link
                  to={dashboardUrl}
                  onClick={closeMenus}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white"
                >
                  <LayoutDashboard className="size-4" />
                  Ir para o Painel ({role})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    closeMenus();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="size-4" />
                  Terminar Sessão
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/auth/login"
                  onClick={closeMenus}
                  className="block w-full rounded-full border border-[var(--border)] px-4 py-2.5 text-center text-sm font-semibold"
                >
                  Iniciar Sessão
                </Link>
                <Link
                  to="/tornar-se-professor"
                  onClick={closeMenus}
                  className="block w-full rounded-full border border-[var(--border)] px-4 py-2.5 text-center text-sm font-semibold"
                >
                  Tornar-se professor
                </Link>
                <Link
                  to="/onboarding"
                  onClick={closeMenus}
                  className="block w-full rounded-full bg-[var(--primary)] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Começar
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}