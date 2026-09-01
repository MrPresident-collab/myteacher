import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { ArrowRight, CheckCircle2, RotateCcw, Sparkles, Award } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
}

const TEST_QUESTIONS: Record<LanguageCode, Question[]> = {
  english: [
    {
      id: 1,
      question: "Complete the sentence: 'She _____ to work by bus every morning.'",
      options: ["go", "goes", "going", "gone"],
      correct: 1,
      level: "A1",
    },
    {
      id: 2,
      question: "Which question is grammatically correct?",
      options: [
        "Where did you went yesterday?",
        "Where did you go yesterday?",
        "Where you went yesterday?",
        "Where you go yesterday?",
      ],
      correct: 1,
      level: "A2",
    },
    {
      id: 3,
      question: "If I _____ his contact number, I would have invited him to the meeting.",
      options: ["had had", "would have", "have had", "had"],
      correct: 0,
      level: "B1",
    },
    {
      id: 4,
      question: "Despite _____ exhausted, the team completed the financial report on time.",
      options: ["they were", "of being", "being", "to be"],
      correct: 2,
      level: "B2",
    },
    {
      id: 5,
      question: "Hardly _____ the office when the urgent client call came through.",
      options: ["had he entered", "he had entered", "did he entered", "he was entered"],
      correct: 0,
      level: "C1",
    },
  ],
  french: [
    {
      id: 1,
      question: "Choisissez la bonne forme: 'Je _____ étudiant à Luanda.'",
      options: ["est", "suis", "sommes", "êtes"],
      correct: 1,
      level: "A1",
    },
    {
      id: 2,
      question: "Hier soir, nous _____ au restaurant.",
      options: ["sommes allés", "avons allé", "allons", "sont allés"],
      correct: 0,
      level: "A2",
    },
    {
      id: 3,
      question: "Il faut que vous _____ votre passeport avant le départ.",
      options: ["prenez", "preniez", "prendre", "pris"],
      correct: 1,
      level: "B1",
    },
    {
      id: 4,
      question: "Si j'avais su, je ne serais pas _____ en retard.",
      options: ["venu", "venue", "venais", "viendrai"],
      correct: 0,
      level: "B2",
    },
    {
      id: 5,
      question: "Quoiqu'il _____ compétent, il doit encore perfectionner sa communication.",
      options: ["est", "soit", "sera", "étant"],
      correct: 1,
      level: "C1",
    },
  ],
  portuguese: [
    {
      id: 1,
      question: "Indique a forma correta: 'Nós _____ todos os dias.'",
      options: ["estuda", "estudamos", "estudam", "estudo"],
      correct: 1,
      level: "A1",
    },
    {
      id: 2,
      question: "Identifique a frase com pontuação e concordância adequadas:",
      options: [
        "Haviam muitas pessoas na conferência.",
        "Havia muitas pessoas na conferência.",
        "Houveram muitas pessoas na conferência.",
        "Fazem dois anos que não o vejo.",
      ],
      correct: 1,
      level: "B1",
    },
    {
      id: 3,
      question: "Se nós _____ mais cedo, teríamos assistido à palestra inicial.",
      options: ["chegássemos", "chegamos", "tivéssemos chegado", "chegaremos"],
      correct: 2,
      level: "B2",
    },
    {
      id: 4,
      question: "Assinale a opção com o uso correto da próclise:",
      options: [
        "Não entregue-me o relatório agora.",
        "Não me entregue o relatório agora.",
        "Entregue-me não o relatório agora.",
        "Me não entregue o relatório agora.",
      ],
      correct: 1,
      level: "C1",
    },
    {
      id: 5,
      question: "O pronome relativo está empregado com a regência correta em:",
      options: [
        "Este é o projeto que simpatizo.",
        "Este é o projeto com que simpatizo.",
        "Este é o projeto em que simpatizo.",
        "Este é o projeto onde simpatizo.",
      ],
      correct: 1,
      level: "C1",
    },
  ],
  spanish: [
    {
      id: 1,
      question: "Completa: 'Ella _____ dos hermanas en Madrid.'",
      options: ["tiene", "tener", "tienes", "tenemos"],
      correct: 0,
      level: "A1",
    },
    {
      id: 2,
      question: "¿Cuál es la opción correcta para el pasado?",
      options: ["Ayer yo comí paella.", "Ayer yo comía paella.", "Ayer yo comer paella.", "Ayer yo he comer paella."],
      correct: 0,
      level: "A2",
    },
    {
      id: 3,
      question: "Espero que tú _____ un excelente viaje de negocios.",
      options: ["tienes", "tengas", "tener", "tenías"],
      correct: 1,
      level: "B1",
    },
    {
      id: 4,
      question: "Si hubiera tenido más tiempo, te _____ llamado antes.",
      options: ["habría", "habrías", "había", "he"],
      correct: 0,
      level: "B2",
    },
    {
      id: 5,
      question: "Por mucho que _____ esforzado, las condiciones del mercado cambiaron.",
      options: ["se hayan", "se hubieran", "se han", "se estarían"],
      correct: 1,
      level: "C1",
    },
  ],
  italian: [
    {
      id: 1,
      question: "Completa la frase: 'Io _____ italiano con MyTeacher.'",
      options: ["imparo", "impari", "impara", "impariamo"],
      correct: 0,
      level: "A1",
    },
    {
      id: 2,
      question: "Ieri sera noi _____ una pizza fantastica.",
      options: ["abbiamo mangiato", "siamo mangiati", "mangiamo", "hanno mangiato"],
      correct: 0,
      level: "A2",
    },
    {
      id: 3,
      question: "Penso che Marco _____ ragione in questa discussione.",
      options: ["ha", "abbia", "avere", "avrà"],
      correct: 1,
      level: "B1",
    },
    {
      id: 4,
      question: "Se tu fossi venuto ieri, ti _____ presentato il nostro nuovo professore.",
      options: ["avrei", "avresti", "avessi", "ero"],
      correct: 0,
      level: "B2",
    },
    {
      id: 5,
      question: "Benché _____ tardi, gli studenti sono rimasti per fare domande.",
      options: ["era", "fosse", "sia", "sarebbe"],
      correct: 1,
      level: "C1",
    },
  ],
  mandarin: [
    {
      id: 1,
      question: "Qual é o significado de '谢谢' (Xièxie)?",
      options: ["Olá", "Obrigado", "Adeus", "Desculpe"],
      correct: 1,
      level: "A1",
    },
    {
      id: 2,
      question: "Qual frase expressa 'Eu sou angolano'?",
      options: [
        "我是安哥拉人 (Wǒ shì āngēlā rén)",
        "我不是安哥拉人 (Wǒ bùshì āngēlā rén)",
        "我是中国人 (Wǒ shì zhōngguó rén)",
        "我学习安哥拉 (Wǒ xuéxí āngēlā)",
      ],
      correct: 0,
      level: "A2",
    },
    {
      id: 3,
      question: "O classificador (measure word) mais comum em Mandarim é:",
      options: ["个 (gè)", "本 (běn)", "张 (zhāng)", "只 (zhī)"],
      correct: 0,
      level: "B1",
    },
    {
      id: 4,
      question: "Em Mandarim, a partícula '了' (le) indica geralmente:",
      options: ["Uma negação", "Uma mudança de estado ou ação concluída", "Uma pergunta de cortesia", "Um futuro distante"],
      correct: 1,
      level: "B2",
    },
    {
      id: 5,
      question: "Como se traduz 'Relações comerciais de benefício mútuo'?",
      options: ["互利共赢 (Hùlì gòngyíng)", "马马虎虎 (Mǎmǎhǔhǔ)", "一路顺风 (Yīlù shùnfēng)", "不客气 (Bù kèqì)"],
      correct: 0,
      level: "C1",
    },
  ],
};

export function LevelTestPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("english");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = TEST_QUESTIONS[selectedLanguage] || TEST_QUESTIONS.english;
  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  // Calculate score & level
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correct) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / questions.length) * 100);

  const estimatedLevel =
    percentage >= 85
      ? { level: "Avançado (C1)", desc: "Excelente domínio de estruturas complexas e vocabulário." }
      : percentage >= 60
      ? { level: "Intermédio (B1/B2)", desc: "Boa compreensão geral com capacidade para conversação fluida." }
      : percentage >= 40
      ? { level: "Elementar (A2)", desc: "Domina frases do dia-a-dia e saudações básicas." }
      : { level: "Iniciante (A1)", desc: "Ponto de partida ideal para construir as bases do idioma." };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-3">
          <Award className="size-6" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Teste de Nível Gratuito
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">
          Descubra o seu nível linguístico em menos de 5 minutos e receba recomendações personalizadas de professores e turmas.
        </p>
      </div>

      {/* LANGUAGE SELECTOR */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              setSelectedLanguage(lang.code);
              handleRestart();
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedLanguage === lang.code
                ? "bg-[var(--primary)] text-white shadow-md"
                : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[var(--secondary)]"
            }`}
          >
            <Flag code={lang.code} size="sm" />
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {/* TEST CONTAINER */}
      <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-10 shadow-sm">
        {!submitted ? (
          <div>
            {/* PROGRESS BAR */}
            <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-3">
              <span>Pergunta {currentIndex + 1} de {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% concluído</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
              <div
                className="h-full bg-[var(--primary)] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* QUESTION */}
            <div className="mt-8">
              <div className="inline-block rounded-lg bg-[var(--secondary)] px-2.5 py-1 text-xs font-bold text-[var(--muted)]">
                Nível da Questão: {currentQ.level}
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-[var(--foreground)] sm:text-2xl">
                {currentQ.question}
              </h2>
            </div>

            {/* OPTIONS */}
            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition ${
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)]/30 hover:bg-[var(--secondary)]"
                    }`}
                  >
                    <span>{opt}</span>
                    <span
                      className={`grid size-5 place-items-center rounded-full border text-xs ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-[var(--border)]"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="size-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CONTROLS */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={selectedAnswers[currentIndex] === undefined}
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
              >
                {currentIndex === questions.length - 1 ? "Concluir Teste" : "Seguinte"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          /* RESULT VIEW */
          <div className="text-center py-6">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
              <Sparkles className="size-10" />
            </div>

            <h2 className="font-display text-3xl font-extrabold text-[var(--foreground)]">
              Resultado do Teste de Nível
            </h2>

            <div className="mt-6 inline-block rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 max-w-md w-full">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Nível Recomendado
              </p>
              <p className="mt-1 font-display text-3xl font-extrabold text-emerald-800">
                {estimatedLevel.level}
              </p>
              <p className="mt-2 text-sm text-emerald-900/80">
                {estimatedLevel.desc}
              </p>
              <p className="mt-4 border-t border-emerald-200 pt-3 text-xs font-bold text-emerald-700">
                Acertou {correctCount} de {questions.length} perguntas ({percentage}%)
              </p>
            </div>

            <p className="mt-6 text-sm text-[var(--muted)] max-w-lg mx-auto">
              Pronto para evoluir? Encontre professores certificados para o seu nível ou junte-se a uma turma compatível de até 5 alunos.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/onboarding"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
              >
                Começar a Aprender
                <ArrowRight className="size-4" />
              </Link>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--secondary)]"
              >
                <RotateCcw className="size-4" />
                Refazer Teste
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
