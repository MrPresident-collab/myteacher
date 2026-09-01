import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Handshake,
  Search,
  Users,
  Video,
  MapPin,
  GraduationCap,
  Languages,
} from "lucide-react";

import heroImage from "@/assets/hero.jpg";
import groupImage from "@/assets/session.jpg";
import corporateImage from "@/assets/corporate.jpg";
import sessionImage from "@/assets/group.jpg";
import inPersonImage from "@/assets/in-person.jpg";

import { LANGUAGES } from "@/lib/languages";
import { Flag } from "@/components/common/Flag";

export function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-5 pb-20 pt-10 md:pb-28 md:pt-16">
        <div className="pointer-events-none absolute right-[-180px] top-[-120px] -z-10 h-[520px] w-[520px] rounded-full bg-[var(--gold)]/20 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm">
              <Handshake className="size-4 text-[var(--primary)]" />
              Aprender línguas sem fronteiras
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Conecte-se ao professor certo.
              <span className="block text-[var(--primary)]">
                Aprenda uma nova língua.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">
              Conectamos estudantes a professores certificados de línguas. Encontre o professor ideal, aprenda ao seu ritmo e transforme
              cada aula numa oportunidade para comunicar, crescer e abrir novas portas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/professores"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
              >
                Encontrar um professor
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-7 py-3.5 font-bold transition hover:bg-[var(--secondary)]"
              >
                Começar a aprender
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--muted)]">
              <span className="inline-flex items-center gap-2">
                <Video className="size-4 text-[var(--primary)]" />
                Aulas online
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-[var(--primary)]" />
                Sessões 1:1
              </span>

              <span className="inline-flex items-center gap-2">
                <Users className="size-4 text-[var(--primary)]" />
                Estudo em grupo (Máx. 5 alunos)
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-2xl">
              <img
                src={heroImage}
                alt="Aluno numa sessão de aprendizagem"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-xl sm:-left-6">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                  <GraduationCap className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-bold">Professores qualificados</p>
                  <p className="text-xs text-[var(--muted)]">
                    Com experiência comprovada e selo de verificação MyTeacher.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="border-y border-[var(--border)] bg-white/60 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Escolha a sua língua
            </p>

            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              Que língua quer aprender?
            </h2>

            <p className="mt-3 text-[var(--muted)]">
              Escolha uma ou várias línguas e encontre professores de acordo
              com os seus objetivos e disponibilidade.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {LANGUAGES.map((language) => (
              <Link
                key={language.code}
                to="/professores"
                search={{ language: language.code }}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 text-center transition hover:-translate-y-1 hover:border-[var(--primary)]/30 hover:shadow-lg"
              >
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white shadow-xs transition group-hover:scale-105">
                  <Flag code={language.code} size="lg" />
                </div>

                <p className="mt-4 font-display font-bold">
                  {language.name}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  {language.nativeName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-2 shadow-lg">
              <img
                src={sessionImage}
                alt="Estudo em grupo no MyTeacher"
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                loading="lazy"
              />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Como funciona
              </p>

              <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
                Aprender uma língua pode ser simples.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">
                No MyTeacher, encontra professores, escolhe a forma de aprender
                e começa a desenvolver as suas competências linguísticas ao seu
                ritmo.
              </p>

              <div className="mt-8 grid gap-4">
                <Step
                  number="01"
                  icon={<Search className="size-5" />}
                  title="Escolha os seus idiomas"
                  text="Diga-nos o que quer aprender e encontre professores que combinam com os seus objetivos."
                />

                <Step
                  number="02"
                  icon={<Users className="size-5" />}
                  title="Encontre o seu professor ou grupo"
                  text="Compare experiência, avaliações, disponibilidade, preços em Kwanzas e modalidade antes de escolher."
                />

                <Step
                  number="03"
                  icon={<BookOpen className="size-5" />}
                  title="Comece a aprender"
                  text="Faça aulas individuais, participe num grupo de até 5 alunos ou combine diferentes formatos."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENT LEARNING EXPERIENCES - INTRO */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Formas de aprender
          </p>

          <h2 className="mt-4 font-display text-[2.5rem] font-extrabold leading-[0.95] tracking-tight text-[var(--foreground)] sm:text-[3.25rem]">
            Decida a sua experiência
            <br />
            <span className="font-extrabold text-[var(--primary)]">
              de aprendizagem.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[var(--muted)]">
            Aulas individuais, em grupo de até 5 alunos ou flexíveis — combine diferentes formas
            de aprender e crie um percurso que funciona para si.
          </p>

          <div className="mt-6 h-px w-20 bg-[var(--primary)]/30" />
        </div>
      </section>

      {/* 1:1 LEARNING */}
      <section className="border-y border-[var(--border)] bg-white/60 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
                Sessões 1:1 para aprender com atenção total.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">
                Tenha uma experiência privada e personalizada com um professor
                dedicado aos seus objetivos e ao seu ritmo de aprendizagem.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                  <Video className="size-5 text-[var(--primary)]" />
                  <h3 className="mt-3 font-bold">Online</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Aprenda de onde estiver através de videochamada interativa.
                  </p>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                  <MapPin className="size-5 text-[var(--primary)]" />
                  <h3 className="mt-3 font-bold">Presencial</h3>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Combine encontros presenciais ou ao domicílio com o professor.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white p-2 shadow-lg">
              <img
                src={inPersonImage}
                alt="Sessão presencial 1:1 de aprendizagem"
                className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* GROUP LEARNING */}
      <section className="px-5 pb-20 md:pb-28">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--primary)] lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[500px]">
            <img
              src={groupImage}
              alt="Estudantes numa sessão de aprendizagem em grupo"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center px-7 py-12 text-white sm:px-10 lg:px-14">
            <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-white/15">
              <Users className="size-6" />
            </div>

            <p className="text-sm font-bold uppercase tracking-widest text-white/70">
              Estudo em grupo · Máximo 5 alunos
            </p>

            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              Aprenda com outras pessoas no seu nível.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-white/80">
              Quer tornar a aprendizagem mais dinâmica e acessível? Junte-se a turmas de estudo
              compatíveis com o seu horário e pratique conversação ativa todas as semanas.
            </p>

            <div className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-bold">Online</p>
                <p className="mt-1 text-white/70">
                  Participe com colegas de qualquer província.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-bold">Presencial</p>
                <p className="mt-1 text-white/70">
                  Encontre turmas presenciais na sua cidade.
                </p>
              </div>
            </div>

            <Link
              to="/onboarding"
              search={{ intent: "group" }}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[var(--primary)] transition hover:opacity-90"
            >
              Quero estudar em grupo
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BUSINESS */}
      <section className="px-5 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] lg:grid-cols-2">
          <div className="relative min-h-[300px]">
            <img
              src={corporateImage}
              alt="Formação linguística para empresas"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Para empresas
            </p>

            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
              Invista nas competências linguísticas da sua equipa.
            </h2>

            <p className="mt-4 leading-7 text-[var(--muted)]">
              Encontre soluções de aprendizagem de línguas sob medida para equipas,
              empresas e profissionais.
            </p>

            <Link
              to="/business"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 font-bold text-white transition hover:bg-[var(--primary-dark)]"
            >
              Saber mais sobre Empresas
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[var(--secondary)] px-6 py-14 text-center md:px-12">
          <Languages className="mx-auto size-8 text-[var(--primary)]" />

          <h2 className="mt-5 font-display text-3xl font-extrabold md:text-5xl">
            A próxima língua que vai falar começa aqui.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
            Encontre o professor certo e comece a aprender de uma forma que
            funciona para si.
          </p>

          <Link
            to="/onboarding"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 font-bold text-white shadow-lg transition hover:bg-[var(--primary-dark)]"
          >
            Começar agora
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-3xl border border-[var(--border)] bg-white p-7">
      <div className="flex items-center justify-between">
        <div className="grid size-12 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </div>

        <span className="font-display text-sm font-extrabold text-[var(--primary)]/40">
          {number}
        </span>
      </div>

      <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}