import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import { Flame, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lightbulb, Share2, Copy } from "lucide-react";

interface DailyChallenge {
  id: string;
  language: LanguageCode;
  title: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}

type DailyCompletion = {
  date: string;
  language: LanguageCode;
  challengeId: string;
  selectedOption: number;
  correct: boolean;
  completedAt: string;
};

const DAILY_STORAGE_KEY = "myteacher:daily-challenge-progress";

const getDateKey = (date = new Date()) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const getChallengeIndex = (language: LanguageCode, date = new Date()) => {
  const bank = DAILY_CHALLENGE_BANK[language] || DAILY_CHALLENGE_BANK.english;
  const seed = Array.from(getDateKey(date)).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return seed % bank.length;
};

const getStoredCompletions = (): DailyCompletion[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DailyCompletion[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Unable to restore daily challenge state", error);
    return [];
  }
};

const computeStreak = (language: LanguageCode) => {
  const completions = getStoredCompletions().filter((entry) => entry.language === language);
  const uniqueDates = [...new Set(completions.map((entry) => entry.date))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const cursor = new Date();

  for (const date of uniqueDates) {
    const current = new Date(date);
    const difference = Math.round((cursor.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    if (difference === streak) {
      streak += 1;
    } else if (difference === 0 && streak === 0) {
      streak = 1;
      break;
    } else {
      break;
    }
  }

  return streak;
};

const DAILY_CHALLENGE_BANK: Record<LanguageCode, DailyChallenge[]> = {
  english: [
    { id: "en-daily-1", language: "english", title: "Business expression: 'Break the ice'", prompt: "What does the idiom 'to break the ice' mean in a professional setting?", options: ["To cancel a meeting unexpectedly", "To start a conversation and reduce tension", "To solve a technical issue", "To ask for a salary increase"], correct: 1, explanation: "'To break the ice' means to start a conversation and ease the initial awkwardness or tension between people." },
    { id: "en-daily-2", language: "english", title: "Work vocabulary", prompt: "Which word best completes the sentence: 'The company needs to _____ costs this quarter.'", options: ["curtail", "expand", "decorate", "delay"], correct: 0, explanation: "'Curtail' means to reduce or limit something such as costs." },
    { id: "en-daily-3", language: "english", title: "Travel phrase", prompt: "Which option is the most natural when checking in at a hotel?", options: ["I would like to check in, please.", "I would like to check out, please.", "I would like to cancel the room.", "I want to pay in cash."], correct: 0, explanation: "'Check in' is the correct phrase when arriving at a hotel and registering your room." },
    { id: "en-daily-4", language: "english", title: "Grammar check", prompt: "Choose the correct sentence:", options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not like coffee."], correct: 2, explanation: "The correct form is 'doesn't' + base verb: 'She doesn't like coffee.'" },
    { id: "en-daily-5", language: "english", title: "Email etiquette", prompt: "Which phrase is best for a professional email opening?", options: ["Hi mate, what’s up?", "Dear Mr. Silva, thank you for your email.", "Hey there, quick question.", "Yo, can you reply?"], correct: 1, explanation: "A formal professional email opening should be polite and clear." },
  ],
  french: [
    { id: "fr-daily-1", language: "french", title: "Vocabulaire professionnel", prompt: "Que signifie 'le suivi' dans un contexte de travail?", options: ["Le départ d'une réunion", "Le contrôle ou l'état d'avancement d'un projet", "Le salaire mensuel", "Le lieu de travail"], correct: 1, explanation: "'Le suivi' désigne le contrôle, l'avancement et les actions à faire ensuite dans un projet ou un dossier." },
    { id: "fr-daily-2", language: "french", title: "Expression utile", prompt: "Comment dit-on 'Je voudrais un billet pour Paris, s'il vous plaît' de façon naturelle?", options: ["Je voudrais un billet pour Paris, s'il vous plaît.", "Paris billet, s'il vous plaît.", "Je veux billet Paris, merci.", "Billet pour Paris, je désire."], correct: 0, explanation: "La structure la plus naturelle et polie est 'Je voudrais ... s'il vous plaît'." },
    { id: "fr-daily-3", language: "french", title: "Grammaire", prompt: "Complétez : 'Je _____ lu ce livre hier.'", options: ["ai", "suis", "vais", "étais"], correct: 0, explanation: "Le passé composé de 'lire' avec le sujet 'Je' se construit avec l'auxiliaire 'avoir' : 'J'ai lu'." },
    { id: "fr-daily-4", language: "french", title: "Mots utiles", prompt: "Que veut dire 'rapidement' ?", options: ["Slowly", "Quickly", "Quietly", "Carefully"], correct: 1, explanation: "'Rapidement' signifie 'quickly' ou 'de manière rapide'." },
    { id: "fr-daily-5", language: "french", title: "Voyage", prompt: "Quelle phrase demande une direction de façon polie ?", options: ["Où est la gare, s'il vous plaît ?", "La gare est où ?", "Gare où est ?", "La gare, s'il vous plaît ?"], correct: 0, explanation: "La formule la plus naturelle et polie est 'Où est la gare, s'il vous plaît ?'" },
  ],
  portuguese: [
    { id: "pt-daily-1", language: "portuguese", title: "Gramática prática", prompt: "Qual frase está correta?", options: ["O projeto teve início há duas semanas.", "O projeto teve início à duas semanas.", "O projeto teve início a duas semanas atrás.", "O projeto teve início há duas semanas atrás."], correct: 0, explanation: "Para indicar tempo decorrido, usa-se 'há duas semanas'. A forma 'há ... atrás' é redundante." },
    { id: "pt-daily-2", language: "portuguese", title: "Vocabulário profissional", prompt: "Qual palavra melhor completa: 'Precisamos ____ os custos deste mês.'", options: ["redigir", "reduzir", "revisar", "romper"], correct: 1, explanation: "'Reduzir' é a forma correta para diminuir custos." },
    { id: "pt-daily-3", language: "portuguese", title: "Viagem", prompt: "Qual frase é mais natural para pedir o cartão de quarto no hotel?", options: ["Quero fazer o check-in, por favor.", "Quero sair do hotel, por favor.", "Quero o quarto, obrigado.", "Quero cancelar a recepção."], correct: 0, explanation: "'Check-in' é a expressão usada ao chegar ao hotel para registar a sua estadia." },
    { id: "pt-daily-4", language: "portuguese", title: "Uso de pronome", prompt: "Complete: 'Ela _____ explicou a tarefa ao colega.'", options: ["mesmo", "já", "outra", "lhe"], correct: 3, explanation: "O pronome 'lhe' é o correto quando o verbo exige complemento indireto: 'explicou-lhe a tarefa'." },
    { id: "pt-daily-5", language: "portuguese", title: "Correspondência", prompt: "Que expressão é adequada para encerrar um e-mail profissional?", options: ["Atenciosamente,", "Oi,", "Tudo bem?", "Até logo!"], correct: 0, explanation: "'Atenciosamente' é a fórmula mais apropriada e formal para um e-mail profissional." },
  ],
  spanish: [
    { id: "es-daily-1", language: "spanish", title: "Expresión de trabajo", prompt: "¿Qué significa 'estar al tanto'?", options: ["Estar cansado", "Estar informado y al corriente", "Querer cancelar", "Estar muy lejos"], correct: 1, explanation: "'Estar al tanto' significa estar informado o al corriente de un asunto." },
    { id: "es-daily-2", language: "spanish", title: "Vocabulario", prompt: "¿Qué palabra significa 'seguir' o 'continuar'?", options: ["borrar", "seguir", "llamar", "leer"], correct: 1, explanation: "'Seguir' significa continuar." },
    { id: "es-daily-3", language: "spanish", title: "Gramática", prompt: "Completa: 'Si yo _____ antes, habría llegado a tiempo.'", options: ["salgo", "saliera", "salgo", "salgo"], correct: 1, explanation: "La forma correcta para una hipótesis irreal es 'saliera' o 'saliese' según el registro." },
    { id: "es-daily-4", language: "spanish", title: "Viaje", prompt: "¿Cómo pedir una dirección de forma educada?", options: ["¿Dónde está la estación, por favor?", "¿Estación dónde está?", "¿Dónde la estación?", "¿La estación está?"], correct: 0, explanation: "La forma más natural y cortés es '¿Dónde está la estación, por favor?'" },
    { id: "es-daily-5", language: "spanish", title: "Correo profesional", prompt: "Cuál frase es más apropiada para abrir un correo formal?", options: ["Hola amigo, ¿qué tal?", "Estimado Sr. García, recibí su mensaje.", "Mira esto.", "Eres genial."], correct: 1, explanation: "La apertura formal es la más adecuada para un correo profesional." },
  ],
  italian: [
    { id: "it-daily-1", language: "italian", title: "Espressione idiomatica", prompt: "Quando qualcuno dice 'In bocca al lupo!', qual è la risposta tradizionale?", options: ["Grazie mille!", "Crepi il lupo!", "Buona notte!", "Prego!"], correct: 1, explanation: "La risposta tradizionale è 'Crepi il lupo!'" },
    { id: "it-daily-2", language: "italian", title: "Lavoro", prompt: "Che cosa significa 'follow-up'?", options: ["Un viaggio", "Un contatto successivo dopo una riunione", "Un rinnovo di contratto", "Un documento legale"], correct: 1, explanation: "Il follow-up è il controllo o il contatto successivo a un accordo o a una riunione." },
    { id: "it-daily-3", language: "italian", title: "Grammatica", prompt: "Completa: 'Ieri ho comprato un libro e _____ parlato con il venditore.'", options: ["ho", "sono", "avevo", "essere"], correct: 0, explanation: "Con i verbi transitivi al passato, si usa l'ausiliare 'avere': 'ho parlato'." },
    { id: "it-daily-4", language: "italian", title: "Viaggio", prompt: "Come si dice 'Dov'è la stazione, per favore?' in English?", options: ["Where is the station, please?", "The station is where?", "Where station?", "Please station?"], correct: 0, explanation: "La forma corretta in inglese è 'Where is the station, please?'" },
    { id: "it-daily-5", language: "italian", title: "Mail professionale", prompt: "Qual è la chiusura più appropriata per una e-mail formale?", options: ["Ciao!", "Cordiali saluti,", "Buona fortuna!", "Ci vediamo."], correct: 1, explanation: "'Cordiali saluti' è una chiusura corretta e professionale." },
  ],
  mandarin: [
    { id: "zh-daily-1", language: "mandarin", title: "Culture & characters", prompt: "Which character means 'good' or 'well'?", options: ["好", "门", "水", "天"], correct: 0, explanation: "好 means good / well and is a very common character in Mandarin." },
    { id: "zh-daily-2", language: "mandarin", title: "Daily phrases", prompt: "Which phrase means 'good morning'?", options: ["你好", "早上好", "谢谢", "再见"], correct: 1, explanation: "早上好 is the standard greeting for good morning." },
    { id: "zh-daily-3", language: "mandarin", title: "Travel", prompt: "Which term means 'train station'?", options: ["机场", "火车站", "学校", "银行"], correct: 1, explanation: "火车站 literally means train station." },
    { id: "zh-daily-4", language: "mandarin", title: "Business Chinese", prompt: "Which term means 'meeting'?", options: ["会议", "朋友", "公司", "手机"], correct: 0, explanation: "会议 means meeting or conference." },
    { id: "zh-daily-5", language: "mandarin", title: "Friendship", prompt: "What does 朋友 (péngyou) mean?", options: ["teacher", "friend", "food", "book"], correct: 1, explanation: "朋友 means friend." },
  ],
};

export function DailyChallengePage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("english");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [shareState, setShareState] = useState<string | null>(null);
  const streak = useMemo(() => computeStreak(selectedLanguage), [selectedLanguage]);

  const challenge = useMemo(() => {
    const bank = DAILY_CHALLENGE_BANK[selectedLanguage] || DAILY_CHALLENGE_BANK.english;
    return bank[getChallengeIndex(selectedLanguage)];
  }, [selectedLanguage]);

  useEffect(() => {
    const completions = getStoredCompletions();
    const todayKey = getDateKey();
    const todayEntry = completions.find(
      (entry) => entry.language === selectedLanguage && entry.date === todayKey && entry.challengeId === challenge.id,
    );

    const restoreTimer = window.setTimeout(() => {
      if (todayEntry) {
        setSelectedOption(todayEntry.selectedOption);
        setSubmitted(true);
        return;
      }

      setSelectedOption(null);
      setSubmitted(false);
      setShareState(null);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, [challenge.id, selectedLanguage]);

  const isCorrect = selectedOption === challenge.correct;

  const handleAnswer = (index: number) => {
    if (submitted) return;

    const completions = getStoredCompletions();
    const todayKey = getDateKey();
    const alreadyCompleted = completions.some(
      (entry) => entry.language === selectedLanguage && entry.date === todayKey && entry.challengeId === challenge.id,
    );

    if (alreadyCompleted) {
      setSubmitted(true);
      setSelectedOption(index);
      return;
    }

    const completion: DailyCompletion = {
      date: todayKey,
      language: selectedLanguage,
      challengeId: challenge.id,
      selectedOption: index,
      correct: index === challenge.correct,
      completedAt: new Date().toISOString(),
    };

    const nextCompletions = [...completions, completion];
    window.localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(nextCompletions));

    setSelectedOption(index);
    setSubmitted(true);
    setShareState(null);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setShareState(null);
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "https://myteacher.app/desafio-diario";
    return `${window.location.origin}${window.location.pathname}`;
  };

  const getShareText = () => {
    const languageName = LANGUAGES.find((entry) => entry.code === selectedLanguage)?.name ?? "English";
    return `🔥 I completed today's MyTeacher ${languageName} challenge!\n\nCan you beat my result?`;
  };

  const handleCopyShare = async () => {
    const text = `${getShareText()}\n${getShareUrl()}`;

    try {
      await navigator.clipboard.writeText(text);
      setShareState("Copied!");
    } catch (error) {
      console.warn("Clipboard API unavailable", error);
      setShareState("Copy not supported in this browser.");
    }
  };

  const handleShare = (platform: "whatsapp" | "facebook" | "x" | "linkedin") => {
    const text = `${getShareText()}\n${getShareUrl()}`;
    const encoded = encodeURIComponent(text);
    const target = new URL("https://www.example.com");

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "facebook") {
      target.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
      window.open(target.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "x") {
      target.href = `https://twitter.com/intent/tweet?text=${encoded}`;
      window.open(target.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "linkedin") {
      target.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
      window.open(target.toString(), "_blank", "noopener,noreferrer");
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      setShareState("Native sharing is not available in this browser.");
      return;
    }

    try {
      await navigator.share({
        title: "MyTeacher Daily Challenge",
        text: getShareText(),
        url: getShareUrl(),
      });
      setShareState("Shared!");
    } catch {
      setShareState("Share cancelled.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700 shadow-sm mb-3">
          <Flame className="size-4 text-orange-500 fill-orange-500" />
          Daily streak: {streak} days
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
          MyTeacher Daily Challenge
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          A new personalized challenge each day to keep your learning consistent and useful.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              setSelectedLanguage(lang.code);
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

        {submitted && (
          <div className="mt-8 border-t border-[var(--border)] pt-6">
            <div className={`flex items-start gap-3 rounded-2xl p-4 text-sm ${
              isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"
            }`}>
              <Lightbulb className="size-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold">{isCorrect ? "Correct answer! Great work." : "Not this time. Keep practicing."}</p>
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
                Try again
              </button>

              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--primary-dark)]"
              >
                Learn more with a teacher
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-left">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
                <Share2 className="size-4 text-[var(--primary)]" />
                Share your result
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => handleShare("whatsapp")} className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-bold text-[var(--foreground)]">WhatsApp</button>
                <button type="button" onClick={() => handleShare("facebook")} className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-bold text-[var(--foreground)]">Facebook</button>
                <button type="button" onClick={() => handleShare("x")} className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-bold text-[var(--foreground)]">X</button>
                <button type="button" onClick={() => handleShare("linkedin")} className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-bold text-[var(--foreground)]">LinkedIn</button>
                <button type="button" onClick={handleCopyShare} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-bold text-[var(--foreground)]"><Copy className="size-3.5" />Copy</button>
                <button type="button" onClick={handleNativeShare} className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-2 text-xs font-bold text-white"><Share2 className="size-3.5" />Share</button>
              </div>
              {shareState && <p className="mt-3 text-xs font-semibold text-[var(--primary)]">{shareState}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
