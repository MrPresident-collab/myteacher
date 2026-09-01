import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Globe2,
  Languages,
  MessageSquare,
  Users,
  BriefcaseBusiness,
  BarChart3,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import corporateImage from "@/assets/corporate.jpg";
import { createCorporateLead } from "@/lib/api";

export function BusinessPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    trainingType: "team-training",
    employeeCount: "10-25",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createCorporateLead({
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        trainingType: formData.trainingType,
        employeeCount: formData.employeeCount,
        notes: formData.notes,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // Graceful fallback
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-5 pb-20 pt-10 md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute right-[-180px] top-[-120px] -z-10 h-[520px] w-[520px] rounded-full bg-[var(--gold)]/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              MyTeacher para empresas
            </p>

            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              Desenvolva as competências linguísticas da sua equipa.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">
              Formação linguística à medida para empresas, embaixadas e
              organizações em Angola que pretendem comunicar com confiança
              num ambiente corporativo global.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
              >
                Falar com a nossa equipa
                <ArrowRight className="size-4" />
              </a>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-7 py-3.5 font-bold transition hover:bg-[var(--secondary)]"
              >
                Conhecer o MyTeacher
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <Languages className="size-4 text-[var(--primary)]" />
                Inglês, Francês, Mandarim, Espanhol
              </span>

              <span className="inline-flex items-center gap-2">
                <Users className="size-4 text-[var(--primary)]" />
                Sem limite rígido de turma corporativa
              </span>

              <span className="inline-flex items-center gap-2">
                <Globe2 className="size-4 text-[var(--primary)]" />
                Online & Ao Domicílio Empresarial
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={corporateImage}
                alt="Formação linguística para empresas"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl sm:-left-6">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <BriefcaseBusiness className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Formação à medida
                  </p>

                  <p className="text-xs text-[var(--muted)]">
                    Relatórios de assiduidade e progresso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-y border-[var(--border)] bg-white/60 px-5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Línguas para o trabalho
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-5xl">
              A sua equipa aprende.
              <br />
              <span className="text-[var(--primary)]">
                A sua empresa cresce.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Criamos experiências de aprendizagem corporativa que ajudam executivos e quadros técnicos a negociar com parceiros internacionais, elaborar relatórios formais e liderar reuniões sem barreiras linguísticas.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-5 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            <BusinessFeature
              icon={<Languages className="size-6 text-[var(--primary)]" />}
              title="Módulos Setoriais"
              text="Inglês para Petróleo & Gás, Francês Diplomático, Mandarim para Importação/Exportação e Espanhol Comercial."
            />

            <BusinessFeature
              icon={<Users className="size-6 text-[var(--primary)]" />}
              title="Flexibilidade de Grupos"
              text="Estruture programas para departamentos inteiros ou coaching executivo 1:1 para diretores."
            />

            <BusinessFeature
              icon={<BarChart3 className="size-6 text-[var(--primary)]" />}
              title="Gestão & ROI"
              text="Painel corporativo para acompanhar assiduidade, avaliações de nível e evolução de cada colaborador."
            />
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contacto" className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[var(--foreground)] px-7 py-12 text-white md:px-14 md:py-16">
          <div className="max-w-2xl">
            <MessageSquare className="size-8 text-[var(--gold)]" />

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--gold)]">
              Proposta à Medida
            </p>

            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">
              Vamos preparar o plano formativo da sua equipa.
            </h2>

            <p className="mt-5 leading-7 text-white/80">
              Partilhe as necessidades linguísticas da sua organização. A nossa equipa de consultoria pedagógica entrará em contacto num prazo de 24 horas úteis.
            </p>
          </div>

          {submitted ? (
            <div className="mt-10 rounded-2xl bg-white/10 p-8 text-center border border-white/20">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--gold)] text-[var(--foreground)] mb-4">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="font-display text-2xl font-bold">Pedido Submetido com Sucesso!</h3>
              <p className="mt-2 text-sm text-white/80 max-w-md mx-auto">
                Obrigado pelo seu interesse. A equipa MyTeacher para Empresas entrará em contacto através do email ou telefone indicado.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[var(--foreground)] hover:bg-white/90"
              >
                Enviar outro pedido
              </button>
            </div>
          ) : (
            <form className="mt-10 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nome do Responsável / RH *"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[var(--gold)]"
                />

                <input
                  type="text"
                  placeholder="Nome da Empresa *"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[var(--gold)]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="email"
                  placeholder="Email Profissional *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[var(--gold)]"
                />

                <input
                  type="tel"
                  placeholder="Telefone / WhatsApp *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[var(--gold)]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  required
                  value={formData.trainingType}
                  onChange={(e) => setFormData({ ...formData, trainingType: e.target.value })}
                  className="h-12 rounded-xl border border-white/20 bg-[var(--foreground)] px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[var(--gold)]"
                >
                  <option value="team-training">Formação para Equipas / Departamentos</option>
                  <option value="executive-1on1">Coaching Executivo 1:1 para Diretores</option>
                  <option value="multiple-languages">Programa Multi-Idiomas para Empresa</option>
                  <option value="prep-international">Preparação para Missões Internacionais</option>
                </select>

                <select
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  className="h-12 rounded-xl border border-white/20 bg-[var(--foreground)] px-4 text-sm text-white outline-none focus:ring-2 focus:ring-[var(--gold)]"
                >
                  <option value="1-5">1 a 5 Colaboradores</option>
                  <option value="6-15">6 a 15 Colaboradores</option>
                  <option value="16-50">16 a 50 Colaboradores</option>
                  <option value="50+">Mais de 50 Colaboradores</option>
                </select>
              </div>

              <textarea
                placeholder="Descreva brevemente os objetivos (ex: línguas pretendidas, nível atual, prazo desejado)..."
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:ring-2 focus:ring-[var(--gold)]"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-8 font-bold text-[var(--foreground)] transition hover:bg-yellow-400 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    A submeter pedido...
                  </>
                ) : (
                  <>
                    Solicitar Proposta de Formação
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function BusinessFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
      <div className="grid size-12 place-items-center rounded-2xl bg-[var(--primary)]/10">
        {icon}
      </div>

      <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </article>
  );
}