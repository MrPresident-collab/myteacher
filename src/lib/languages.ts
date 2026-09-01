export type LanguageCode =
  | "english"
  | "french"
  | "portuguese"
  | "spanish"
  | "italian"
  | "mandarin";

export type Language = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flagCountryCode: string;
  description: string;
};

export const LANGUAGES: Language[] = [
  {
    code: "english",
    name: "Inglês",
    nativeName: "English",
    flagCountryCode: "gb",
    description: "Inglês britânico e internacional para trabalho, exames e conversação.",
  },
  {
    code: "french",
    name: "Francês",
    nativeName: "Français",
    flagCountryCode: "fr",
    description: "Francês para estudo, viagens e relações empresariais.",
  },
  {
    code: "portuguese",
    name: "Português",
    nativeName: "Português",
    flagCountryCode: "pt",
    description: "Português para aperfeiçoamento, comunicação formal e acadêmica.",
  },
  {
    code: "spanish",
    name: "Espanhol",
    nativeName: "Español",
    flagCountryCode: "es",
    description: "Espanhol para negócios globais, turismo e fluência conversacional.",
  },
  {
    code: "italian",
    name: "Italiano",
    nativeName: "Italiano",
    flagCountryCode: "it",
    description: "Italiano para cultura, intercâmbio e proficiência profissional.",
  },
  {
    code: "mandarin",
    name: "Mandarim",
    nativeName: "中文",
    flagCountryCode: "zh",
    description: "Mandarim para comércio internacional, parcerias e diplomacia.",
  },
];

export function getLanguage(code?: string): Language | undefined {
  if (!code) return undefined;
  const norm = code.toLowerCase().trim();
  return LANGUAGES.find((lang) => lang.code === norm || lang.name.toLowerCase() === norm || lang.nativeName.toLowerCase() === norm);
}

export type RegionalMarket = {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  phonePrefix: string;
  provinces: string[];
  active: boolean;
};

export const REGIONAL_MARKETS: RegionalMarket[] = [
  {
    code: "ao",
    name: "Angola",
    currencyCode: "AOA",
    currencySymbol: "Kz",
    phonePrefix: "+244",
    provinces: [
      "Luanda",
      "Benguela",
      "Huambo",
      "Huíla",
      "Cabinda",
      "Cuanza Sul",
      "Cuanza Norte",
      "Malanje",
      "Uíge",
      "Zaire",
      "Namibe",
      "Cunene",
      "Bié",
      "Moxico",
      "Cuando Cubango",
      "Lunda Norte",
      "Lunda Sul",
      "Bengo",
    ],
    active: true,
  },
  {
    code: "mz",
    name: "Moçambique",
    currencyCode: "MZN",
    currencySymbol: "MT",
    phonePrefix: "+258",
    provinces: [
      "Maputo",
      "Sofala",
      "Nampula",
      "Zambézia",
      "Inhambane",
      "Gaza",
      "Tete",
      "Manica",
      "Cabo Delgado",
      "Niassa",
    ],
    active: false,
  },
  {
    code: "pt",
    name: "Portugal",
    currencyCode: "EUR",
    currencySymbol: "€",
    phonePrefix: "+351",
    provinces: [
      "Lisboa",
      "Porto",
      "Braga",
      "Setúbal",
      "Aveiro",
      "Faro",
      "Coimbra",
      "Leiria",
      "Santarém",
      "Viseu",
      "Madeira",
      "Açores",
    ],
    active: false,
  },
  {
    code: "br",
    name: "Brasil",
    currencyCode: "BRL",
    currencySymbol: "R$",
    phonePrefix: "+55",
    provinces: [
      "São Paulo",
      "Rio de Janeiro",
      "Minas Gerais",
      "Bahia",
      "Paraná",
      "Rio Grande do Sul",
      "Pernambuco",
      "Ceará",
      "Distrito Federal",
    ],
    active: false,
  },
  {
    code: "cv",
    name: "Cabo Verde",
    currencyCode: "CVE",
    currencySymbol: "Esc",
    phonePrefix: "+238",
    provinces: [
      "Santiago (Praia)",
      "São Vicente (Mindelo)",
      "Sal",
      "Boa Vista",
      "Santo Antão",
      "Fogo",
    ],
    active: false,
  },
];

export function getActiveMarket(): RegionalMarket {
  return REGIONAL_MARKETS.find((m) => m.active) || REGIONAL_MARKETS[0];
}