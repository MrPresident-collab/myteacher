import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe, Heart, Shield, Sparkles, Target, Users } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-5 pb-16 pt-12 md:pb-24 md:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--primary)] shadow-sm">
            <Sparkles className="size-3.5" />
            A Nossa Missão
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Ligar pessoas e abrir portas através do{" "}
            <span className="text-[var(--primary)]">conhecimento</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            O MyTeacher nasceu para transformar a forma como as línguas são aprendidas
            em Angola e no espaço lusófono, combinando tecnologia intuitiva e o toque humano
            de professores apaixonados por ensinar.
          </p>
        </div>
      </section>

      {/* STORY & VISION */}
      <section className="border-y border-[var(--border)] bg-white/60 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Origem & Compromisso
              </span>
              <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
                Criado para a realidade angolana, preparado para o mundo
              </h2>
              <p className="mt-4 leading-7 text-[var(--muted)]">
                Em Angola e em vários países de língua portuguesa, o domínio de idiomas como
                o Inglês, Francês ou Mandarim é um acelerador decisivo de carreira, negócios
                e intercâmbio acadêmico. No entanto, encontrar professores qualificados e
                experiências de aprendizagem estruturadas sempre foi um desafio.
              </p>
              <p className="mt-4 leading-7 text-[var(--muted)]">
                O MyTeacher resolve este obstáculo proporcionando uma infraestrutura transparente,
                com verificação de professores, turmas acessíveis e métodos que colocam a conversação
                no centro de cada aula.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                  <p className="font-display text-2xl font-extrabold text-[var(--primary)]">100%</p>
                  <p className="text-xs text-[var(--muted)] mt-1">Supervisão Humana de Qualidade</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                  <p className="font-display text-2xl font-extrabold text-[var(--primary)]">Max. 5</p>
                  <p className="text-xs text-[var(--muted)] mt-1">Alunos por Turma de Grupo</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-white p-2 shadow-xl">
              <img
                src={heroImage}
                alt="Professores e Alunos MyTeacher"
                className="aspect-[4/3] w-full rounded-[2rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Valores
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">
              Os princípios que guiam cada decisão
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ValueCard
              icon={<Shield className="size-6" />}
              title="Confiança & Verificação"
              description="Não concedemos selos de verificação de forma automática. Analisamos documentação e qualificações rigorosamente."
            />
            <ValueCard
              icon={<Heart className="size-6" />}
              title="Centrado no Aluno"
              description="Seja com aulas particulares ou grupos de 5 pessoas, adaptamos a experiência aos objetivos individuais de cada estudante."
            />
            <ValueCard
              icon={<Globe className="size-6" />}
              title="Flexibilidade Regional"
              description="Construído em Angola e desenhado com arquitetura de dados extensível para Moçambique, Portugal, Brasil e Cabo Verde."
            />
            <ValueCard
              icon={<Users className="size-6" />}
              title="Aprender em Comunidade"
              description="Acreditamos no poder da troca de experiências entre colegas de estudo para acelerar a retenção e a prática oral."
            />
            <ValueCard
              icon={<Target className="size-6" />}
              title="Resultados Práticos"
              description="Foco no uso real da língua: entrevistas de emprego, reuniões internacionais, exames e dia-a-dia."
            />
            <ValueCard
              icon={<Sparkles className="size-6" />}
              title="Automação com Toque Humano"
              description="A tecnologia gere a logística; os nossos humanos cuidam da empatia, qualidade e mediação."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[var(--primary)] p-8 text-center text-white md:p-14">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Junte-se à revolução da aprendizagem
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85 text-base leading-7">
            Quer pretenda aprender um novo idioma ou partilhar o seu talento como professor, o MyTeacher é o seu espaço.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-[var(--primary)] shadow-md transition hover:bg-white/90"
            >
              Começar como Aluno
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/tornar-se-professor"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white transition hover:bg-white/20"
            >
              Candidatar como Professor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-7 shadow-xs">
      <div className="grid size-12 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  );
}
