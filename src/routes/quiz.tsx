import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flag } from "@/components/common/Flag";
import { LANGUAGES, type LanguageCode } from "@/lib/languages";
import {
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Sparkles,
  BookOpen,
  Briefcase,
  Plane,
  Share2,
  Copy,
  PauseCircle,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";

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

const shuffleArray = <T,>(items: T[]) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const buildQuizAttempt = (language: LanguageCode, category: Category) => {
  const rawQuestions = QUIZ_BANK[language] || QUIZ_BANK.english;
  const categoryPool = rawQuestions.filter((question) => question.category === category);
  const remainingPool = rawQuestions.filter(
    (question) => !categoryPool.some((candidate) => candidate.id === question.id),
  );

  const seedPool = categoryPool.length >= 5 ? categoryPool : [...categoryPool, ...remainingPool];
  return shuffleArray(seedPool).slice(0, Math.min(5, seedPool.length));
};

const QUIZ_BANK: Record<LanguageCode, QuizItem[]> = {
  english: [
    {
      id: "en-grammar-01",
      category: "grammar",
      question: "Which sentence uses the present perfect continuous correctly?",
      options: [
        "I have been working here since three years.",
        "I have been working here for three years.",
        "I am working here since three years.",
        "I had been work here for three years.",
      ],
      correct: 1,
      explanation: "Use 'for' with a duration such as three years and 'since' with a specific point in time.",
    },
    {
      id: "en-grammar-02",
      category: "grammar",
      question: "Choose the correct sentence:",
      options: [
        "She don’t like coffee.",
        "She doesn’t likes coffee.",
        "She doesn’t like coffee.",
        "She not like coffee.",
      ],
      correct: 2,
      explanation: "In the present simple, the third-person singular form needs 'doesn't' + the base verb: 'doesn't like'.",
    },
    {
      id: "en-grammar-03",
      category: "grammar",
      question: "Which option completes the sentence correctly? 'If I _____ earlier, I would have caught the train.'",
      options: ["leave", "left", "had left", "was leaving"],
      correct: 2,
      explanation: "This is a third conditional sentence, so it takes 'had left' in the if-clause.",
    },
    {
      id: "en-vocabulary-01",
      category: "vocabulary",
      question: "What is the best synonym of 'curtail'?",
      options: ["expand", "reduce", "celebrate", "ignore"],
      correct: 1,
      explanation: "'Curtail' means to reduce or limit something.",
    },
    {
      id: "en-vocabulary-02",
      category: "vocabulary",
      question: "Which word means 'to make a decision after thinking carefully'?",
      options: ["neglect", "consider", "borrow", "delay"],
      correct: 1,
      explanation: "'Consider' means to think carefully before deciding.",
    },
    {
      id: "en-vocabulary-03",
      category: "vocabulary",
      question: "The company is looking for a candidate with strong _____ skills.",
      options: ["courageous", "negotiation", "appetizing", "familiar"],
      correct: 1,
      explanation: "In a business context, 'negotiation skills' is the natural phrase.",
    },
    {
      id: "en-business-01",
      category: "business",
      question: "What does 'ASAP' mean in a business email?",
      options: ["As Soon As Possible", "Always Send All Papers", "After Some Additional Planning", "Action System And Protocol"],
      correct: 0,
      explanation: "'ASAP' is widely used to mean 'as soon as possible'.",
    },
    {
      id: "en-business-02",
      category: "business",
      question: "Which phrase is most appropriate for a professional meeting?",
      options: [
        "Can we touch base tomorrow?",
        "I will maybe appear later.",
        "I am not into this meeting.",
        "Your plan is nonsense.",
      ],
      correct: 0,
      explanation: "'Touch base' is a common professional expression for a brief follow-up conversation.",
    },
    {
      id: "en-business-03",
      category: "business",
      question: "What is the purpose of a 'meeting agenda'?",
      options: [
        "To record only the final decision",
        "To list the points to discuss and the order for the meeting",
        "To replace the conversation",
        "To hide the meeting objectives",
      ],
      correct: 1,
      explanation: "An agenda gives structure and helps everyone prepare for the main points of the meeting.",
    },
    {
      id: "en-travel-01",
      category: "travel",
      question: "At the airport, where do you collect your checked luggage?",
      options: ["Boarding gate", "Baggage claim", "Duty-free shop", "Security check"],
      correct: 1,
      explanation: "Passengers pick up checked baggage in the baggage claim area after arrival.",
    },
    {
      id: "en-travel-02",
      category: "travel",
      question: "Which sentence is correct when asking for directions?",
      options: [
        "Where is the train station, please?",
        "Where the train station is, please?",
        "Train station where is, please?",
        "Please, where is the train station?",
      ],
      correct: 0,
      explanation: "The natural sentence is 'Where is the train station, please?' with a polite tone.",
    },
    {
      id: "en-travel-03",
      category: "travel",
      question: "What does 'reservation' mean in travel?",
      options: ["a tourist guide", "a booking for a room, ticket, or seat", "a passport photo", "a local map"],
      correct: 1,
      explanation: "A reservation is a booking made in advance for a service such as a hotel room or flight seat.",
    },
    {
      id: "en-business-04",
      category: "business",
      question: "Which sentence is most appropriate for an email opening?",
      options: [
        "Dear Mr. Silva, thank you for your email.",
        "Hello my friend, how are you?",
        "Hi there, just writing.",
        "I answer in a hurry.",
      ],
      correct: 0,
      explanation: "A professional email opening is usually formal and courteous.",
    },
    {
      id: "en-vocabulary-04",
      category: "vocabulary",
      question: "Choose the best option: 'The supplier promised a ____ delivery.'",
      options: ["timely", "timeless", "timid", "tiny"],
      correct: 0,
      explanation: "'Timely' means happening at the right time or without delay.",
    },
    {
      id: "en-grammar-04",
      category: "grammar",
      question: "Which sentence is correct?",
      options: [
        "By the time I arrived, they left.",
        "By the time I arrived, they had left.",
        "By the time I arrived, they have left.",
        "By the time I arrived, they was left.",
      ],
      correct: 1,
      explanation: "When one action happened before another in the past, the earlier action uses the past perfect.",
    },
    {
      id: "en-travel-04",
      category: "travel",
      question: "Which phrase is best for a hotel check-in?",
      options: [
        "I would like to check in, please.",
        "I would like to check out, please.",
        "I would like to cancel the room.",
        "I want to pay in advance.",
      ],
      correct: 0,
      explanation: "'Check in' is the correct phrase when arriving at a hotel and registering your stay.",
    },
  ],
  french: [
    {
      id: "fr-grammar-01",
      category: "grammar",
      question: "Complétez : 'Ce livre ? Je _____ ai lu hier.'",
      options: ["l'", "lui", "y", "en"],
      correct: 0,
      explanation: "Le pronom 'le' s'élide devant une voyelle : 'l'ai lu'.",
    },
    {
      id: "fr-grammar-02",
      category: "grammar",
      question: "Choisissez la phrase correcte :",
      options: [
        "Nous allons au cinéma demain.",
        "Nous allons au cinéma demain ?",
        "Nous allons demain au cinéma.",
        "Nous allons demain au cinéma, n'est-ce pas ?",
      ],
      correct: 0,
      explanation: "La phrase affirmative la plus naturelle est 'Nous allons au cinéma demain.'",
    },
    {
      id: "fr-grammar-03",
      category: "grammar",
      question: "Le mot 'beaucoup' est utilisé pour :",
      options: ["demander une quantité", "exprimer un lieu", "décrire un vêtement", "donner un ordre"],
      correct: 0,
      explanation: "'Beaucoup' sert à exprimer une grande quantité ou une forte intensité.",
    },
    {
      id: "fr-vocabulary-01",
      category: "vocabulary",
      question: "Que signifie 'rencontrer' dans un contexte professionnel ?",
      options: ["devoirs", "avoir une réunion", "manger", "écrire un cv"],
      correct: 1,
      explanation: "'Rencontrer' peut aussi signifier 'avoir une réunion' ou 'se réunir'.",
    },
    {
      id: "fr-vocabulary-02",
      category: "vocabulary",
      question: "Quel mot correspond à 'coûter'?",
      options: ["acheter", "coûter", "rentrer", "apprendre"],
      correct: 1,
      explanation: "'Coûter' signifie avoir un prix ou demander un effort financier.",
    },
    {
      id: "fr-vocabulary-03",
      category: "vocabulary",
      question: "Complétez : 'Je voudrais réserver une chambre _____ deux nuits.'",
      options: ["pendant", "pour", "avec", "sans"],
      correct: 1,
      explanation: "Le bon choix est 'pour' pour indiquer la durée d'une réservation.",
    },
    {
      id: "fr-business-01",
      category: "business",
      question: "Comment dit-on 'suivi' ou 'poursuite' dans un contexte professionnel ?",
      options: ["le suivi", "la visite", "la pause", "la commande"],
      correct: 0,
      explanation: "'Le suivi' est l'expression standard pour le contrôle ou l'état d'avancement d'un dossier.",
    },
    {
      id: "fr-business-02",
      category: "business",
      question: "Que signifie 'une réunion de cadrage' ?",
      options: ["une réunion de lancement", "un départ de vacances", "un déplacement rapide", "un lunch improvisé"],
      correct: 0,
      explanation: "'Cadrage' désigne le moment où les objectifs, le plan et les responsabilités sont définis.",
    },
    {
      id: "fr-business-03",
      category: "business",
      question: "Quel mot correspond le mieux à 'deadline'?",
      options: ["date limite", "budget", "événement", "mail"],
      correct: 0,
      explanation: "'Date limite' est l'équivalent français le plus naturel de 'deadline'.",
    },
    {
      id: "fr-travel-01",
      category: "travel",
      question: "Quelle est la phrase la plus naturelle pour demander un billet ?",
      options: [
        "Je veux un billet pour Paris.",
        "Je voudrais un billet pour Paris, s'il vous plaît.",
        "Un billet pour Paris, merci.",
        "Paris billet, s'il vous plaît.",
      ],
      correct: 1,
      explanation: "'Je voudrais...' est plus poli et naturel dans une demande de service.",
    },
    {
      id: "fr-travel-02",
      category: "travel",
      question: "Que signifie 'la gare'?",
      options: ["the airport", "the train station", "the bus stop", "the hotel"],
      correct: 1,
      explanation: "'La gare' correspond à la gare ferroviaire.",
    },
    {
      id: "fr-travel-03",
      category: "travel",
      question: "Choisissez la bonne manière de demander la direction :",
      options: [
        "Où est l'hôpital, s'il vous plaît ?",
        "Où est l'hôpital, vraiment ?",
        "L'hôpital est où ?",
        "L'hôpital et moi ?",
      ],
      correct: 0,
      explanation: "'Où est l'hôpital, s'il vous plaît ?' est correct et poli.",
    },
    {
      id: "fr-grammar-04",
      category: "grammar",
      question: "Complétez : 'Ils _____ déjà partir quand nous sommes arrivés.'",
      options: ["ont", "avaient", "sont", "étaient"],
      correct: 1,
      explanation: "Le plus-que-parfait ('avaient déjà parti') convient pour une action antérieure à une autre dans le passé.",
    },
    {
      id: "fr-vocabulary-04",
      category: "vocabulary",
      question: "Quel est le sens de 'généreux' ?",
      options: ["triste", "libéral", "timide", "bruyant"],
      correct: 1,
      explanation: "'Généreux' décrit quelqu'un qui donne ou aide spontanément.",
    },
    {
      id: "fr-business-04",
      category: "business",
      question: "Dans un e-mail professionnel, 'Je vous remercie' est utilisé pour :",
      options: ["souligner un remerciement formel", "donner un ordre", "sauter la signature", "décrire un voyage"],
      correct: 0,
      explanation: "Cette formule est standard pour remercier de manière professionnelle et polie.",
    },
  ],
  portuguese: [
    {
      id: "pt-grammar-01",
      category: "grammar",
      question: "Qual frase está correta?",
      options: [
        "Ontem eu fui ao mercado e comprei pão.",
        "Ontem eu fui ao mercado e comprava pão.",
        "Ontem eu fui ao mercado e comprar pão.",
        "Ontem eu ia ao mercado e comprei pão.",
      ],
      correct: 0,
      explanation: "O pretérito perfeito 'fui' e 'comprei' é a forma correta para ações concluídas no passado.",
    },
    {
      id: "pt-grammar-02",
      category: "grammar",
      question: "Indique a frase em voz passiva analítica:",
      options: [
        "O relatório foi aprovado pela diretoria.",
        "A diretoria aprovou o relatório.",
        "Aprovou-se o relatório.",
        "Eles aprovaram o relatório rapidamente.",
      ],
      correct: 0,
      explanation: "A voz passiva analítica usa verbo auxiliar + particípio: 'foi aprovado'.",
    },
    {
      id: "pt-grammar-03",
      category: "grammar",
      question: "Qual opção completa corretamente: 'Se eu _____ mais cedo, teria chegado a tempo.'",
      options: ["saio", "saísse", "sairia", "saí"],
      correct: 1,
      explanation: "No condicional composto, a oração condicional usa o pretérito do subjuntivo: 'se eu saísse'.",
    },
    {
      id: "pt-vocabulary-01",
      category: "vocabulary",
      question: "Qual palavra significa 'reducir' no contexto de custos?",
      options: ["aumentar", "reduzir", "congelar", "esconder"],
      correct: 1,
      explanation: "'Reduzir' é o termo mais direto para diminuir custos ou despesas.",
    },
    {
      id: "pt-vocabulary-02",
      category: "vocabulary",
      question: "Qual é o sinônimo de 'desafiante'?",
      options: ["fácil", "complexo", "rápido", "nulo"],
      correct: 1,
      explanation: "'Desafiante' e 'complexo' estão relacionados ao fato de exigir esforço ou atenção.",
    },
    {
      id: "pt-vocabulary-03",
      category: "vocabulary",
      question: "Complete: 'A empresa precisa de uma solução _____ para o problema.'",
      options: ["eficaz", "antigo", "frágil", "voluntário"],
      correct: 0,
      explanation: "'Eficaz' descreve uma solução que produz o resultado desejado.",
    },
    {
      id: "pt-business-01",
      category: "business",
      question: "O que significa a sigla 'ASAP' em e-mails profissionais?",
      options: ["Até logo", "O mais rápido possível", "Agenda semanal anual", "Aumento salarial anual"],
      correct: 1,
      explanation: "'ASAP' significa 'as soon as possible': o mais rápido possível.",
    },
    {
      id: "pt-business-02",
      category: "business",
      question: "Qual frase é adequada em reunião de negócios?",
      options: [
        "Podemos fazer um follow-up amanhã?",
        "Eu não quero falar com ninguém.",
        "Isso é uma perda de tempo.",
        "Vamos cancelar tudo.",
      ],
      correct: 0,
      explanation: "'Follow-up' é uma expressão comum para contato posterior após uma reunião.",
    },
    {
      id: "pt-business-03",
      category: "business",
      question: "Qual palavra melhor completa: 'Preciso revisar o _____ do projeto.'",
      options: ["orçamento", "jardim", "carro", "caderno"],
      correct: 0,
      explanation: "Em contexto profissional, 'orçamento' é a palavra mais adequada.",
    },
    {
      id: "pt-travel-01",
      category: "travel",
      question: "Onde você faz o check-in em um hotel?",
      options: ["Na recepção", "Na garagem", "Na cozinha", "No elevador"],
      correct: 0,
      explanation: "O check-in acontece normalmente na recepção do hotel.",
    },
    {
      id: "pt-travel-02",
      category: "travel",
      question: "Qual frase é mais natural para pedir direções?",
      options: [
        "Onde fica a estação de comboios, por favor?",
        "A estação fica onde?",
        "Você vai para a estação?",
        "Estação onde fica?",
      ],
      correct: 0,
      explanation: "A pergunta direta e educada 'Onde fica a estação de comboios, por favor?' é a mais natural.",
    },
    {
      id: "pt-travel-03",
      category: "travel",
      question: "O que significa 'reservation' em contexto de viagem?",
      options: ["um mapa", "uma reserva", "um guia turístico", "uma mala"],
      correct: 1,
      explanation: "'Reservation' é uma reserva prévia para quarto, voo ou outro serviço.",
    },
    {
      id: "pt-grammar-04",
      category: "grammar",
      question: "Complete: 'Quando cheguei, eles _____ já saído.'",
      options: ["tinham", "têm", "são", "foram"],
      correct: 0,
      explanation: "A forma correta é 'tinham saído', que indica uma ação concluída antes de outra no passado.",
    },
    {
      id: "pt-vocabulary-04",
      category: "vocabulary",
      question: "Qual é a melhor tradução de 'timely'?",
      options: ["atrasado", "pontual", "difícil", "curto"],
      correct: 1,
      explanation: "'Timely' significa oportuno ou no momento certo, também pode ser traduzido como pontual.",
    },
    {
      id: "pt-business-04",
      category: "business",
      question: "Qual expressão é adequada para encerrar um e-mail profissional?",
      options: [
        "Atenciosamente,",
        "Tudo bem?",
        "Ei,",
        "Sem mais.",
      ],
      correct: 0,
      explanation: "'Atenciosamente' é uma forma correta e formal de encerrar um e-mail profissional.",
    },
  ],
  spanish: [
    {
      id: "es-grammar-01",
      category: "grammar",
      question: "¿Qué frase está correcta?",
      options: ["Yo soy estudiante desde dos años.", "Yo llevo dos años estudiando.", "Yo estoy estudiado dos años.", "Yo he estudiado desde dos años."],
      correct: 1,
      explanation: "La forma correcta suele ser 'llevo + periodo + gerundio' para expresar continuidad.",
    },
    {
      id: "es-grammar-02",
      category: "grammar",
      question: "Elige la opción correcta: 'Si yo _____ más, habría entendido mejor.'",
      options: ["escuché", "escuchara", "escucho", "habría escuchado"],
      correct: 1,
      explanation: "En condicionales con hipótesis irreal, se usa el imperfecto del subjuntivo: 'escuchara'.",
    },
    {
      id: "es-grammar-03",
      category: "grammar",
      question: "¿Qué significa 'ya'?",
      options: ["todavía", "ya / en este momento", "nunca", "mañana"],
      correct: 1,
      explanation: "'Ya' se usa para expresar que algo ya ocurrió o ya está hecho.",
    },
    {
      id: "es-vocabulary-01",
      category: "vocabulary",
      question: "¿Qué significa 'seguir'?",
      options: ["parar", "continuar", "comprar", "guardar"],
      correct: 1,
      explanation: "'Seguir' significa continuar o avanzar en una acción.",
    },
    {
      id: "es-vocabulary-02",
      category: "vocabulary",
      question: "La palabra 'conocimiento' se relaciona con:",
      options: ["conocimiento / saber", "dinero", "calor", "ruido"],
      correct: 0,
      explanation: "'Conocimiento' se refiere al saber, la información o la comprensión.",
    },
    {
      id: "es-vocabulary-03",
      category: "vocabulary",
      question: "Completa: 'Necesitamos una solución _____ para el problema.'",
      options: ["eficaz", "rápida", "casual", "vieja"],
      correct: 0,
      explanation: "'Eficaz' describe una respuesta útil que resuelve el problema.",
    },
    {
      id: "es-business-01",
      category: "business",
      question: "¿Qué significa 'hacer un seguimiento'?",
      options: ["Cancelar la reunión", "Acompañar el progreso tras la reunión", "Pedir un préstamo", "Despedir al equipo"],
      correct: 1,
      explanation: "'Hacer un seguimiento' significa revisar avances y próximos pasos tras una conversación o reunión.",
    },
    {
      id: "es-business-02",
      category: "business",
      question: "¿Qué es un 'presupuesto'?",
      options: ["Un plan de gastos e ingresos", "Un contrato laboral", "Un horario de vacaciones", "Un producto de marketing"],
      correct: 0,
      explanation: "Un presupuesto es el cálculo de ingresos y gastos previstos para un periodo.",
    },
    {
      id: "es-business-03",
      category: "business",
      question: "¿Cuál es la forma más apropiada para abrir un correo profesional?",
      options: ["Hola amigo, ¿qué tal?", "Estimado Sr. García, recibí su mensaje.", "Mira esto.", "Saludos, compañero."],
      correct: 1,
      explanation: "En un correo formal, se emplea un saludo respetuoso y una frase neutra.",
    },
    {
      id: "es-travel-01",
      category: "travel",
      question: "¿Dónde se recoge el equipaje al llegar?",
      options: ["En la zona de recogida", "En la puerta de embarque", "En la seguridad", "En el supermercado"],
      correct: 0,
      explanation: "La zona de recogida es el lugar donde se recogen las maletas después del vuelo.",
    },
    {
      id: "es-travel-02",
      category: "travel",
      question: "¿Qué significa 'reservación'?",
      options: ["un libro de viaje", "una reserva previa", "un mapa", "un billete de tren"],
      correct: 1,
      explanation: "Una reservación es una confirmación previa de un servicio como hotel o transporte.",
    },
    {
      id: "es-travel-03",
      category: "travel",
      question: "¿Cómo pedir una dirección de forma educada?",
      options: [
        "¿Dónde está la estación, por favor?",
        "La estación está dónde?",
        "¿Estación dónde?",
        "Dónde está la estación, rápido?",
      ],
      correct: 0,
      explanation: "La fórmula polite y natural es '¿Dónde está la estación, por favor?'",
    },
    {
      id: "es-grammar-04",
      category: "grammar",
      question: "Completa: 'Cuando llegué, ellos _____ ya se habían ido.'",
      options: ["habían", "tienen", "fueron", "eran"],
      correct: 0,
      explanation: "El pretérito pluscuamperfecto ('habían ido') expresa una acción previa a otra en el pasado.",
    },
    {
      id: "es-vocabulary-04",
      category: "vocabulary",
      question: "El adjetivo 'puntual' se relaciona con:",
      options: ["ser retrasado", "estar a tiempo", "ser callado", "ser pesado"],
      correct: 1,
      explanation: "'Puntual' significa cumplir a tiempo y con precisión.",
    },
    {
      id: "es-business-04",
      category: "business",
      question: "¿Qué palabra es más natural en una reunión corporativa?",
      options: ["agenda", "murmullo", "casa", "fruta"],
      correct: 0,
      explanation: "'Agenda' es un término esencial para organizar una reunión y los puntos a tratar.",
    },
  ],
  italian: [
    {
      id: "it-grammar-01",
      category: "grammar",
      question: "Completa: 'Ieri ho comprato un libro e _____ parlato con il venditore.'",
      options: ["ho", "sono", "avevo", "essere"],
      correct: 0,
      explanation: "Con i verbi transitivi al passato, si usa il verbo avere: 'ho parlato'.",
    },
    {
      id: "it-grammar-02",
      category: "grammar",
      question: "Quale frase è corretta?",
      options: ["Non ho mai visto questo film.", "Non mai visto questo film.", "Non ho visto mai questo film.", "Non ho visto questo film mai."],
      correct: 0,
      explanation: "La posizione corretta del 'mai' è dopo l'ausiliare: 'non ho mai visto'.",
    },
    {
      id: "it-grammar-03",
      category: "grammar",
      question: "Che cosa indica 'da' in 'Vivo qui da tre anni'?",
      options: ["una durata", "una causa", "un luogo", "una quantità"],
      correct: 0,
      explanation: "'Da' indica l'inizio di un periodo che continua nel presente: 'da tre anni'.",
    },
    {
      id: "it-vocabulary-01",
      category: "vocabulary",
      question: "Che cosa significa 'risorsa'?",
      options: ["spesa", "recurso", "tempo libero", "casa"],
      correct: 1,
      explanation: "'Risorsa' indica un elemento utile, utile per raggiungere un obiettivo o svolgere un'attività.",
    },
    {
      id: "it-vocabulary-02",
      category: "vocabulary",
      question: "Quale parola significa 'obiettivo'?",
      options: ["meta", "soldo", "disegno", "amico"],
      correct: 0,
      explanation: "'Meta' è il termine italiano per 'goal' o 'obiettivo'.",
    },
    {
      id: "it-vocabulary-03",
      category: "vocabulary",
      question: "Completa: 'Abbiamo bisogno di una soluzione _____.'",
      options: ["efficace", "stancante", "ritardata", "piena"],
      correct: 0,
      explanation: "'Efficace' indica una soluzione che dà il risultato desiderato.",
    },
    {
      id: "it-business-01",
      category: "business",
      question: "Che cosa significa 'follow-up'?",
      options: ["recapito di un pacco", "contatto successivo dopo una riunione", "ferie annuali", "cambio di ufficio"],
      correct: 1,
      explanation: "Un follow-up è il contatto o il controllo successivo a un incontro o a un accordo.",
    },
    {
      id: "it-business-02",
      category: "business",
      question: "Come si dice 'agenda' in italiano?",
      options: ["programma", "notizia", "cassa", "libro"],
      correct: 0,
      explanation: "'Agenda' è spesso usata, ma 'programma' è il termine più naturale in italiano per un ordine dei lavori.",
    },
    {
      id: "it-business-03",
      category: "business",
      question: "Quale espressione è appropriata per una e-mail professionale?",
      options: ["Ciao caro, ti scrivo.", "Gentile Sig. Rossi, le scrivo in merito alla sua richiesta.", "Ehi, ci sei?", "Tutto a posto?"],
      correct: 1,
      explanation: "In una mail professionale è preferibile un tono formale e chiaro.",
    },
    {
      id: "it-travel-01",
      category: "travel",
      question: "Dove si fa il check-in in albergo?",
      options: ["Alla reception", "In cucina", "In piscina", "In ascensore"],
      correct: 0,
      explanation: "Il check-in si effettua normalmente alla reception dell'hotel.",
    },
    {
      id: "it-travel-02",
      category: "travel",
      question: "Come si chiede la direzione in modo educato?",
      options: ["Dov'è la stazione, per favore?", "La stazione dove va?", "Stazione dove?", "Per favore, stazione?"],
      correct: 0,
      explanation: "La forma più naturale e cortese è 'Dov'è la stazione, per favore?'.",
    },
    {
      id: "it-travel-03",
      category: "travel",
      question: "Che cosa significa 'prenotazione'?",
      options: ["una mappa", "una reserva", "una visita medica", "una chiamata"],
      correct: 1,
      explanation: "'Prenotazione' indica la conferma anticipata di un servizio, come hotel o volo.",
    },
    {
      id: "it-grammar-04",
      category: "grammar",
      question: "Completa: 'Quando sono arrivato, loro _____ già partiti.'",
      options: ["erano", "sono", "hanno", "avranno"],
      correct: 0,
      explanation: "L'uso del trapassato prossimo ('erano già partiti') descrive un'azione precedente rispetto a un'altra nel passato.",
    },
    {
      id: "it-vocabulary-04",
      category: "vocabulary",
      question: "Quale parola significa 'ponto de encontro' in italiano?",
      options: ["meta", "appuntamento", "cassetto", "riunione"],
      correct: 1,
      explanation: "'Appuntamento' è un termine naturale per indicare un incontro o un appuntamento prestabilito.",
    },
    {
      id: "it-business-04",
      category: "business",
      question: "Qual è la formula formale per chiudere una e-mail?",
      options: ["Ciao,", "Cordiali saluti,", "Buongiorno!", "Ci vediamo."],
      correct: 1,
      explanation: "'Cordiali saluti' è una chiusura adeguata e professional per una e-mail ufficiale.",
    },
  ],
  mandarin: [
    {
      id: "zh-grammar-01",
      category: "grammar",
      question: "Which sentence is correct in Mandarin when saying 'I am going to the market' using pinyin?",
      options: ["Wǒ qù shìchǎng.", "Wǒ xiǎng qù shìchǎng.", "Wǒ yào qù shìchǎng.", "Wǒ huí shìchǎng."],
      correct: 2,
      explanation: "'Yào qù shìchǎng' is the most direct and natural way to express intent to go to the market.",
    },
    {
      id: "zh-grammar-02",
      category: "grammar",
      question: "How would you say 'I have eaten' in Mandarin?",
      options: ["Wǒ chīle.", "Wǒ yǐjīng chīle.", "Wǒ chī fàn.", "Wǒ hǎo chī."],
      correct: 1,
      explanation: "'Yǐjīng chīle' is a clear way to say that the action is already completed.",
    },
    {
      id: "zh-grammar-03",
      category: "grammar",
      question: "Which character means 'person' (person/people)?",
      options: ["人", "水", "山", "日"],
      correct: 0,
      explanation: "The character 人 means person, and it is one of the most important basic Hanzi.",
    },
    {
      id: "zh-vocabulary-01",
      category: "vocabulary",
      question: "What does the word 朋友 (péngyou) mean?",
      options: ["student", "friend", "teacher", "food"],
      correct: 1,
      explanation: "朋友 means friend.",
    },
    {
      id: "zh-vocabulary-02",
      category: "vocabulary",
      question: "What is the meaning of 工作 (gōngzuò)?",
      options: ["to sleep", "work", "to buy", "holiday"],
      correct: 1,
      explanation: "工作 means work or job.",
    },
    {
      id: "zh-vocabulary-03",
      category: "vocabulary",
      question: "Which phrase means 'good morning'?",
      options: ["你好", "早上好", "谢谢", "再见"],
      correct: 1,
      explanation: "早上好 is the standard greeting for good morning in Mandarin.",
    },
    {
      id: "zh-business-01",
      category: "business",
      question: "In a Chinese business setting, how are business cards typically exchanged?",
      options: [
        "With one hand and a quick toss",
        "With both hands and a slight nod",
        "Without looking at the other person",
        "By placing them directly into a pocket",
      ],
      correct: 1,
      explanation: "Business cards are typically exchanged with both hands as a sign of respect.",
    },
    {
      id: "zh-business-02",
      category: "business",
      question: "What is the meaning of 会议 (huìyì)?",
      options: ["meeting", "bookstore", "restaurant", "language class"],
      correct: 0,
      explanation: "会议 means a meeting or conference.",
    },
    {
      id: "zh-business-03",
      category: "business",
      question: "Which word is closest to 'contract' in Mandarin?",
      options: ["合同", "公司", "手机", "地址"],
      correct: 0,
      explanation: "合同 is the standard term for a contract.",
    },
    {
      id: "zh-travel-01",
      category: "travel",
      question: "Which word means 'train station'?",
      options: ["火车站", "机场", "学校", "银行"],
      correct: 0,
      explanation: "火车站 means train station.",
    },
    {
      id: "zh-travel-02",
      category: "travel",
      question: "What is the meaning of 票 (piào)?",
      options: ["ticket", "map", "passport", "phone"],
      correct: 0,
      explanation: "票 means ticket.",
    },
    {
      id: "zh-travel-03",
      category: "travel",
      question: "How do you say 'excuse me' in Mandarin?",
      options: ["谢谢", "对不起", "再见", "你好"],
      correct: 1,
      explanation: "对不起 is the common expression for 'excuse me' or 'sorry'.",
    },
    {
      id: "zh-grammar-04",
      category: "grammar",
      question: "Which character means 'good' in Mandarin?",
      options: ["好", "门", "水", "天"],
      correct: 0,
      explanation: "好 means good / well and is one of the most common Chinese characters.",
    },
    {
      id: "zh-vocabulary-04",
      category: "vocabulary",
      question: "What does the phrase 你好吗 (nǐ hǎo ma) mean?",
      options: ["How are you?", "See you later", "My name is...", "What time is it?"],
      correct: 0,
      explanation: "你好吗 is a common way to ask 'How are you?' in Mandarin.",
    },
    {
      id: "zh-business-04",
      category: "business",
      question: "Which phrase best matches 'Thank you' in Mandarin?",
      options: ["不客气", "谢谢", "早上好", "再见"],
      correct: 1,
      explanation: "谢谢 is the standard and natural way to say 'thank you' in Mandarin.",
    },
  ],
};

const QUIZ_STORAGE_KEY = "myteacher:quiz-attempt";

const getShareUrl = () => {
  if (typeof window === "undefined") {
    return "https://myteacher.app/quiz";
  }

  return `${window.location.origin}${window.location.pathname}`;
};

const getShareText = (score: number, total: number, language: LanguageCode) => {
  const languageLabel = LANGUAGES.find((entry) => entry.code === language)?.name ?? "English";
  return `🎯 I scored ${score}/${total} on the MyTeacher ${languageLabel} quiz!\n\nThink you can beat me? Try it yourself.`;
};

export function QuizPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("english");
  const [selectedCategory, setSelectedCategory] = useState<Category>("grammar");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [completed, setCompleted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [attemptQuestions, setAttemptQuestions] = useState<QuizItem[]>(() => buildQuizAttempt("english", "grammar"));
  const [shareState, setShareState] = useState<string | null>(null);

  const resetAttempt = (language: LanguageCode = selectedLanguage, category: Category = selectedCategory) => {
    const nextQuestions = buildQuizAttempt(language, category);
    setAttemptQuestions(nextQuestions);
    setCurrentIdx(0);
    setAnswers({});
    setCompleted(false);
    setPaused(false);
    setShareState(null);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const payload = {
      selectedLanguage,
      selectedCategory,
      currentIdx,
      answers,
      completed,
      paused,
      attemptQuestions,
    };

    window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));
  }, [answers, attemptQuestions, completed, currentIdx, paused, selectedCategory, selectedLanguage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as {
        selectedLanguage?: LanguageCode;
        selectedCategory?: Category;
        currentIdx?: number;
        answers?: Record<number, number>;
        completed?: boolean;
        paused?: boolean;
        attemptQuestions?: QuizItem[];
      };

      if (!saved.selectedLanguage || !saved.selectedCategory || !saved.attemptQuestions?.length) return;

      const restoreTimer = window.setTimeout(() => {
        setSelectedLanguage(saved.selectedLanguage!);
        setSelectedCategory(saved.selectedCategory!);
        setCurrentIdx(saved.currentIdx ?? 0);
        setAnswers(saved.answers ?? {});
        setCompleted(Boolean(saved.completed));
        setPaused(Boolean(saved.paused));
        setAttemptQuestions(saved.attemptQuestions!);
      }, 0);

      return () => window.clearTimeout(restoreTimer);
    } catch (error) {
      console.warn("Unable to restore quiz state", error);
    }
  }, []);

  const questions = attemptQuestions.length > 0 ? attemptQuestions : buildQuizAttempt(selectedLanguage, selectedCategory);
  const currentQ = questions[currentIdx];

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      return answers[index] === question.correct ? total + 1 : total;
    }, 0);
  }, [answers, questions]);

  const handleSelect = (idx: number) => {
    if (paused || completed) return;
    setAnswers((previous) => ({ ...previous, [currentIdx]: idx }));
  };

  const handleNext = () => {
    if (answers[currentIdx] === undefined) return;
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((previous) => previous + 1);
      return;
    }
    setCompleted(true);
    setPaused(false);
  };

  const handleRestart = () => {
    const confirmed = window.confirm("This will discard the current attempt and create a fresh randomized 5-question quiz. Continue?");
    if (confirmed) {
      resetAttempt(selectedLanguage, selectedCategory);
    }
  };

  const handleCopyShare = async () => {
    const shareText = getShareText(score, questions.length, selectedLanguage);
    const fullText = `${shareText}\n${getShareUrl()}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setShareState("Copied!");
    } catch (error) {
      console.warn("Clipboard API unavailable", error);
      setShareState("Copy not supported in this browser.");
    }
  };

  const handleNativeShare = async () => {
    const shareText = getShareText(score, questions.length, selectedLanguage);
    const fullText = `${shareText}\n${getShareUrl()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "MyTeacher Quiz",
          text: fullText,
          url: getShareUrl(),
        });
        setShareState("Shared!");
      } catch {
        setShareState("Share cancelled.");
      }
      return;
    }

    setShareState("Native sharing is not available in this browser.");
  };

  const handleShare = (platform: "whatsapp" | "facebook" | "x" | "linkedin") => {
    const shareText = getShareText(score, questions.length, selectedLanguage);
    const url = getShareUrl();
    const encodedText = encodeURIComponent(`${shareText}\n${url}`);
    const target = new URL("https://www.example.com");

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodedText}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "facebook") {
      target.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(target.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "x") {
      target.href = `https://twitter.com/intent/tweet?text=${encodedText}`;
      window.open(target.toString(), "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "linkedin") {
      target.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(target.toString(), "_blank", "noopener,noreferrer");
      return;
    }
  };

  const percent = Math.round((score / (questions.length || 1)) * 100);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-3">
          <HelpCircle className="size-6" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Quizzes de Línguas
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Prática guiada, aleatória e adaptada ao idioma e categoria que estás a aprender.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              setSelectedLanguage(lang.code);
              resetAttempt(lang.code, selectedCategory);
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

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                resetAttempt(selectedLanguage, cat.id);
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

      <div className="mt-10 rounded-[2rem] border border-[var(--border)] bg-white p-6 sm:p-10 shadow-sm">
        {!completed && currentQ ? (
          <div>
            <div className="mb-3 flex flex-col gap-3 text-xs font-bold text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
              <span>5 perguntas</span>
              <div className="flex items-center gap-2">
                <span className="capitalize">{currentQ.category}</span>
                <button
                  type="button"
                  onClick={() => setPaused((previous) => !previous)}
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 font-bold text-[var(--foreground)]"
                >
                  {paused ? <PlayCircle className="size-3.5" /> : <PauseCircle className="size-3.5" />}
                  {paused ? "Continue Quiz" : "Pause Quiz"}
                </button>
              </div>
            </div>

            {paused ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                <p className="text-lg font-extrabold text-amber-800">Quiz paused</p>
                <p className="mt-2 text-sm text-amber-700">Your progress is preserved. Continue when you are ready.</p>
                <button
                  type="button"
                  onClick={() => setPaused(false)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white"
                >
                  <PlayCircle className="size-4" />
                  Continue Quiz
                </button>
              </div>
            ) : (
              <>
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

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  >
                    <RotateCcw className="size-4" />
                    Restart Quiz
                  </button>
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
              </>
            )}
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
              5 perguntas · {score} de {questions.length} ({percent}%)
            </p>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Idioma: {LANGUAGES.find((lang) => lang.code === selectedLanguage)?.name} · Categoria: {CATEGORIES.find((cat) => cat.id === selectedCategory)?.label}
            </p>

            <p className="mt-4 text-sm text-[var(--muted)] max-w-md mx-auto">
              Continue a praticar diariamente e use este resultado como referência de progresso, sem que represente uma certificação oficial de nível CEFR.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-6 py-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--secondary)]"
              >
                <RotateCcw className="size-4" />
                Restart Quiz
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
