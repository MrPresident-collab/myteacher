import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { Flame, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb } from "lucide-react";

interface DailyChallenge {
  id: string;
  language: LanguageCode;
  title: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}

const DAILY_CHALLENGES: Record<LanguageCode, DailyChallenge> = {
  english: {
    id: "en-daily-1",
    language: "english",
    title: "Expressão do Dia: 'Break the ice'",
    prompt: "O que significa a expressão idiomática 'to break the ice' no ambiente profissional?",
    options: [
      "Cancelar uma reunião de última hora",
      "Iniciar uma conversa para aliviar o desconforto ou timidez",
      "Resolver um problema técnico complexo",
      "Pedir um aumento salarial com firmeza",
    ],
    correct: 1,
    explanation: "'To break the ice' significa dar o primeiro passo para quebrar a frieza inicial entre pessoas que não se conhecem.",
  },
  french: {
    id: "fr-daily-1",
    language: "french",
    title: "Vocabulário do Dia: 'Les faux amis'",
    prompt: "Em francês, a palavra 'actuellement' significa:",
    options: [
      "Na realidade / De facto",
      "Atualmente / Neste momento",
      "Eventualmente / Talvez",
      "Raramente",
    ],
    correct: 1,
    explanation: "'Actuellement' significa 'no momento presente / agora'. Cuidado com o falso amigo em inglês ('actually' = na verdade).",
  },
  portuguese: {
    id: "pt-daily-1",
    language: "portuguese",
    title: "Gramática Prática: 'Crase & Tempo'",
    prompt: "Qual das frases apresenta o uso correto?",
    options: [
      "O projeto teve início à duas semanas.",
      "O projeto teve início há duas semanas.",
      "O projeto teve início a duas semanas atrás.",
      "O projeto teve início à duas semanas atrás.",
    ],
    correct: 1,
    explanation: "Para indicar tempo decorrido no passado, usa-se o verbo 'haver' ('há duas semanas'). A construção 'há ... atrás' é pleonástica.",
  },
  spanish: {
    id: "es-daily-1",
    language: "spanish",
    title: "Expressões de Negócios: 'Estar al tanto'",
    prompt: "O que expressa a frase: 'Estoy al tanto de las negociaciones'?",
    options: [
      "Estou cansado das negociações",
      "Estou informado / a par das negociações",
      "Quero cancelar as negociações",
      "Vou atrasar as negociações",
    ],
    correct: 1,
    explanation: "'Estar al tanto' significa estar a par, atualizado ou ciente de um assunto.",
  },
  italian: {
    id: "it-daily-1",
    language: "italian",
    title: "Saudações & Cortesia: 'In bocca al lupo'",
    prompt: "Quando alguém lhe diz 'In bocca al lupo!', qual é a resposta tradicional?",
    options: [
      "Grazie mille!",
      "Crepi il lupo!",
      "Buona notte!",
      "Prego!",
    ],
    correct: 1,
    explanation: "A resposta tradicional e supersticiosa a 'In bocca al lupo' (boa sorte) é 'Crepi il lupo!' (ou simplesmente 'Crepi!').",
  },
  mandarin: {
    id: "zh-daily-1",
    language: "mandarin",
    title: "Caráter do Dia: '好' (Hǎo)",
    prompt: "O caráter '好' (bom/bem) é formado pela junção dos radicais de:",
    options: [
      "Homem + Montanha",
      "Mulher (女) + Filho/Criança (子)",
      "Sol + Lua",
      "Árvore + Água",
    ],
    correct: 1,
    explanation: "Tradicionalmente, a combinação de 'mulher' (女) e 'filho' (子) representava a harmonia e o que é bom ('好').",
  },
};

export function DailyChallengePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("english");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [streak, setStreak] = useState(3);

  const challenge = DAILY_CHALLENGES[selectedLanguage] || DAILY_CHALLENGES.english;
  const isCorrect = selectedOption === challenge.correct;

  const handleAnswer = (index: number) => {
    if (submitted) return;
    setSelectedOption(index);
    setSubmitted(true);
    if (index === challenge.correct) {
      setStreak((s) => s + 1);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      {/* HEADER */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700 shadow-sm mb-3">
          <Flame className="size-4 text-orange-500 fill-orange-500" />
          Ofensiva diária: {streak} dias seguidos
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          Desafio Diário MyTeacher
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          1 minuto por dia para exercitar o cérebro e consolidar o seu vocabulário.
        </p>
      </div>

      {/* LANGUAGE PICKER */}
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

      {/* CHALLENGE CARD */}
      <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-10 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
          {challenge.title}
        </span>
        <h2 className="mt-3 font-display text-xl font-bold text-[var(--foreground)] sm:text-2xl">
          {challenge.prompt}
        </h2>

        <div className="mt-6 space-y-3">
          {challenge.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isTheCorrectOne = idx === challenge.correct;

            let buttonStyle = "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30 hover:bg-[var(--secondary)]";
            if (submitted) {
              if (isTheCorrectOne) {
                buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
              } else if (isSelected && !isTheCorrectOne) {
                buttonStyle = "border-red-500 bg-red-50 text-red-900";
              } else {
                buttonStyle = "border-[var(--border)] bg-[var(--background)] opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={submitted}
                onClick={() => handleAnswer(idx)}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition ${buttonStyle}`}
              >
                <span>{opt}</span>
                {submitted && isTheCorrectOne && <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />}
                {submitted && isSelected && !isTheCorrectOne && <XCircle className="size-5 text-red-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* FEEDBACK */}
        {submitted && (
          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <div className={`flex items-start gap-3 rounded-2xl p-4 text-sm ${
              isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"
            }`}>
              <Lightbulb className="size-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold">{isCorrect ? "Resposta Correta! Parabéns!" : "Não foi desta vez!"}</p>
                <p className="mt-1 leading-relaxed text-xs">{challenge.explanation}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <RotateCcw className="size-4" />
                Tentar novamente
              </button>

              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
              >
                Aprender Mais com um Professor
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
