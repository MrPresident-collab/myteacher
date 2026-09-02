import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { HelpCircle, CheckCircle2, RotateCcw, ArrowRight, Sparkles, BookOpen, Briefcase, Plane, type LucideIcon } from "lucide-react";

type Category = "grammar" | "vocabulary" | "business" | "travel";

interface QuizItem {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const CATEGORIES: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: "grammar", label: "Gramática", icon: BookOpen },
  { id: "vocabulary", label: "Vocabulário", icon: Sparkles },
  { id: "business", label: "Negócios & Trabalho", icon: Briefcase },
  { id: "travel", label: "Viagens & Turismo", icon: Plane },
];

const QUIZ_BANK: Record<LanguageCode, QuizItem[]> = {
  english: [
    {
      id: "en-1",
      category: "grammar",
      question: "Which sentence uses the present perfect continuous correctly?",
      options: [
        "I have been working here since three years.",
        "I have been working here for three years.",
        "I am working here since three years.",
        "I had been work here for three years.",
      ],
      correct: 1,
      explanation: "Use 'for' with duration (three years) and 'since' with a specific point in time (since 2023).",
    },
    {
      id: "en-2",
      category: "business",
      question: "What does 'ASAP' stand for in business emails?",
      options: [
        "As Soon As Possible",
        "Always Send All Papers",
        "Action System And Protocol",
        "After Some Additional Planning",
      ],
      correct: 0,
      explanation: "'ASAP' is the common acronym for 'As Soon As Possible'.",
    },
    {
      id: "en-3",
      category: "vocabulary",
      question: "Select the word that best completes: 'The company needs to _____ costs.'",
      options: ["curtail", "expand", "celebrate", "postpone"],
      correct: 0,
      explanation: "'To curtail' means to reduce or restrict (e.g., curtail costs).",
    },
    {
      id: "en-4",
      category: "travel",
      question: "At the airport, where do you retrieve your checked luggage?",
      options: ["Boarding gate", "Baggage claim", "Duty-free shop", "Security check"],
      correct: 1,
      explanation: "'Baggage claim' is the area where arriving passengers collect checked bags.",
    },
  ],
  french: [
    {
      id: "fr-1",
      category: "grammar",
      question: "Complétez avec le bon pronom: 'Ce livre? Je _____ ai lu hier.'",
      options: ["l'", "lui", "y", "en"],
      correct: 0,
      explanation: "Le pronom d'objet direct 'le' s'élide en 'l'' devant la voyelle 'a' (l'ai lu).",
    },
    {
      id: "fr-2",
      category: "business",
      question: "Comment appelle-t-on le 'Chief Executive Officer' (CEO) en français?",
      options: ["Président-Directeur Général (PDG)", "Comptable", "Ressources Humaines", "Stagiaire"],
      correct: 0,
      explanation: "Le sigle français équivalent à CEO est PDG (Président-Directeur Général).",
    },
  ],
  portuguese: [
    {
      id: "pt-1",
      category: "grammar",
      question: "Indique a oração que contém voz passiva analítica:",
      options: [
        "O relatório foi aprovado pela diretoria.",
        "Aprovou-se o relatório.",
        "A diretoria aprovou o relatório.",
        "Eles aprovaram o relatório rapidamente.",
      ],
      correct: 0,
      explanation: "A voz passiva analítica é formada pelo verbo auxiliar (foi) + particípio (aprovado) + agente da passiva.",
    },
  ],
  spanish: [
    {
      id: "es-1",
      category: "business",
      question: "En una reunión de negocios, ¿qué significa 'hacer un seguimiento'?",
      options: ["Follow up / Acompanhar o progresso", "Cancelar o contrato", "Pedir um empréstimo", "Demitir um funcionário"],
      correct: 0,
      explanation: "'Hacer un seguimiento' significa acompanhar os passos seguintes acordados numa reunião.",
    },
  ],
  italian: [
    {
      id: "it-1",
      category: "vocabulary",
      question: "Che cosa significa 'l'assegno' in ambito finanziario?",
      options: ["Cheque bancário", "Contrato", "Fatura", "Recibo"],
      correct: 0,
      explanation: "'L'assegno' in italiano è il termine per 'cheque bancário'.",
    },
  ],
  mandarin: [
    {
      id: "zh-1",
      category: "business",
      question: "Em reuniões na China, como se entrega um cartão de visita (名片)?",
      options: [
        "Com ambas as mãos e uma ligeira reverência",
        "Apenas com a mão esquerda",
        "Atirando sobre a mesa",
        "No bolso da outra pessoa",
      ],
      correct: 0,
      explanation: "Na etiqueta de negócios chinesa, os cartões de visita são sempre entregues e recebidos com ambas as mãos em sinal de respeito.",
    },
  ],
};

export function QuizPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("english");
  const [selectedCategory, setSelectedCategory] = useState<Category>("grammar");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);

  const rawQuestions = QUIZ_BANK[selectedLanguage] || QUIZ_BANK.english;
  const filteredQuestions = rawQuestions.filter((q) => q.category === selectedCategory);
  const questions = filteredQuestions.length > 0 ? filteredQuestions : rawQuestions;
  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    setAnswers({ ...answers, [currentIdx]: idx });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setCompleted(false);
  };

  let score = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.correct) score++;
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-3">
          <HelpCircle className="size-6" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Quizzes de Línguas
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Teste o seu vocabulário, gramática e expressões práticas em situações reais.
        </p>
      </div>

      {/* LANGUAGE BAR */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              setSelectedLanguage(lang.code);
              handleReset();
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

      {/* CATEGORY BAR */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                handleReset();
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? "bg-[var(--foreground)] text-white"
                  : "bg-white/80 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="size-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* QUIZ CONTAINER */}
      <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-10 shadow-sm">
        {!completed && currentQ ? (
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[var(--muted)] mb-3">
              <span>Questão {currentIdx + 1} de {questions.length}</span>
              <span className="capitalize">{currentQ.category}</span>
            </div>

            <h2 className="mt-4 font-display text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              {currentQ.question}
            </h2>

            <div className="mt-6 space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentIdx] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition ${
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30 hover:bg-[var(--secondary)]"
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

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                disabled={answers[currentIdx] === undefined}
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)] disabled:opacity-50"
              >
                {currentIdx === questions.length - 1 ? "Ver Resultado" : "Próxima"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
              <Sparkles className="size-10" />
            </div>

            <h2 className="font-display text-3xl font-extrabold text-[var(--foreground)]">
              Quiz Concluído!
            </h2>

            <p className="mt-2 text-lg font-bold text-[var(--primary)]">
              Pontuação: {score} de {questions.length} ({Math.round((score / (questions.length || 1)) * 100)}%)
            </p>

            <p className="mt-4 text-sm text-[var(--muted)] max-w-md mx-auto">
              Continue a praticar diariamente ou conecte-se com um professor certificado para evoluir a sua conversação.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--secondary)]"
              >
                <RotateCcw className="size-4" />
                Repetir Quiz
              </button>
              <Link
                to="/professores"
                search={{ language: selectedLanguage }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
              >
                Ver Professores de {LANGUAGES.find((l) => l.code === selectedLanguage)?.name}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
