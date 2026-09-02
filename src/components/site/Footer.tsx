import { Link } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, ArrowUp } from "lucide-react";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES } from "@/lib/languages";

const socialLinks = {
  facebook: "#",
  instagram: "#",
};

const whatsappLink = "https://wa.me/244958316486";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="mt-24 bg-[var(--foreground)] text-white relative">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display text-2xl font-extrabold"
            >
              <span className="relative grid size-9 place-items-center rounded-xl bg-white/10">
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 text-[var(--gold)]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8.5 12 4l10 4.5-10 4.5L2 8.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M6.5 10.7v4.1c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.1"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20.5 9.3V14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <span>
                My<span className="text-[var(--gold)]">Teacher</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
              A plataforma para encontrar professores qualificados, aprender línguas
              ao seu ritmo e desenvolver competências todos os dias.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <ArrowUp className="size-3.5" />
                Voltar ao topo
              </button>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-display font-bold">Ligações Rápidas</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <Link to="/teste-de-nivel" className="transition hover:text-white">
                Teste de nível
              </Link>
              <Link to="/desafio-diario" className="transition hover:text-white">
                Desafio diário
              </Link>
              <Link to="/quiz" className="transition hover:text-white">
                Quiz
              </Link>
            </div>
          </div>

          {/* MYTEACHER */}
          <div>
            <h3 className="font-display font-bold">MyTeacher</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <Link to="/onboarding" className="transition hover:text-white">
                Para alunos
              </Link>
              <Link to="/tornar-se-professor" className="transition hover:text-white">
                Para professores
              </Link>
              <Link to="/business" className="transition hover:text-white">
                Para empresas
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="font-display font-bold">Contacto</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <a
                href="tel:+244958316486"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Phone className="size-4 shrink-0" />
                958 316 486
              </a>

              <a
                href="mailto:geral@myteacher.ao"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Mail className="size-4 shrink-0" />
                geral@myteacher.ao
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <MessageCircle className="size-4 shrink-0" />
                Suporte WhatsApp
              </a>
            </div>
          </div>

          {/* PRIVACY */}
          <div>
            <h3 className="font-display font-bold">Privacidade</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/65">
              <Link to="/privacidade" className="transition hover:text-white">
                Política de Privacidade
              </Link>
              <Link to="/cookies" className="transition hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* SECOND ROW: SOCIAL & LANGUAGES WITH SVG FLAGS */}
        <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* FOLLOW US */}
          <div>
            <h3 className="font-display font-bold">Siga-nos</h3>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-10 place-items-center rounded-xl bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.38-.14-2.62-.14-2.59 0-4.36 1.58-4.36 4.49V10H7v3h2.82v8h3.68Z" />
                </svg>
              </a>

              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-xl bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          {/* LANGUAGES WITH FLAGS */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-display font-bold">Línguas Disponíveis</h3>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/75">
              {LANGUAGES.map((lang) => (
                <Link
                  key={lang.code}
                  to="/professores"
                  search={{ language: lang.code }}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 transition hover:bg-white/10 hover:text-white"
                >
                  <Flag code={lang.code} size="sm" />
                  <span>{lang.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/45 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} MyTeacher · Todos os direitos reservados.</span>
        <span className="mt-2 sm:mt-0">Aprender línguas sem fronteiras</span>
      </div>
    </footer>
  );
}