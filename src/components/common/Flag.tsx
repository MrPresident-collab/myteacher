import React from "react";
import type { LanguageCode } from "@/lib/languages";

interface FlagProps extends React.SVGProps<SVGSVGElement> {
  code?: LanguageCode | string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Flag({ code, className = "", size = "md", ...props }: FlagProps) {
  const normalized = (code || "").toLowerCase().trim();

  const sizeClasses = {
    sm: "w-5 h-3.5 rounded-[3px]",
    md: "w-7 h-5 rounded-[4px]",
    lg: "w-10 h-7 rounded-md",
    xl: "w-14 h-9 rounded-lg",
  }[size];

  const baseClasses = `inline-block shrink-0 shadow-xs object-cover border border-black/5 overflow-hidden ${sizeClasses} ${className}`;

  // BRITISH FLAG (Union Jack) for English
  if (normalized === "english" || normalized === "en" || normalized === "gb" || normalized === "uk") {
    return (
      <svg
        viewBox="0 0 60 30"
        className={baseClasses}
        aria-label="Bandeira do Reino Unido (Inglês)"
        {...props}
      >
        <clipPath id="flag-uk-clip-s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="flag-uk-clip-t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#flag-uk-clip-s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#flag-uk-clip-t)" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    );
  }

  // FRENCH FLAG
  if (normalized === "french" || normalized === "fr" || normalized === "francais" || normalized === "français") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira da França (Francês)"
        {...props}
      >
        <rect width="20" height="40" fill="#002395" />
        <rect x="20" width="20" height="40" fill="#FFFFFF" />
        <rect x="40" width="20" height="40" fill="#ED2939" />
      </svg>
    );
  }

  // PORTUGUESE FLAG
  if (normalized === "portuguese" || normalized === "pt" || normalized === "portugues" || normalized === "português") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira de Portugal (Português)"
        {...props}
      >
        <rect width="24" height="40" fill="#046A38" />
        <rect x="24" width="36" height="40" fill="#DA291C" />
        {/* Armillary sphere & shield */}
        <circle cx="24" cy="20" r="8" fill="#FFCD00" stroke="#000" strokeWidth="0.5" />
        <circle cx="24" cy="20" r="4.5" fill="#FFFFFF" stroke="#DA291C" strokeWidth="1.5" />
        <path d="M21.5 17h5v6h-5z" fill="#DA291C" />
        <circle cx="24" cy="20" r="1.5" fill="#002395" />
      </svg>
    );
  }

  // SPANISH FLAG
  if (normalized === "spanish" || normalized === "es" || normalized === "espanhol" || normalized === "español") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira da Espanha (Espanhol)"
        {...props}
      >
        <rect width="60" height="10" fill="#AA151B" />
        <rect y="10" width="60" height="20" fill="#F1BF00" />
        <rect y="30" width="60" height="10" fill="#AA151B" />
        <rect x="12" y="15" width="5" height="10" rx="1" fill="#AA151B" opacity="0.8" />
      </svg>
    );
  }

  // ITALIAN FLAG
  if (normalized === "italian" || normalized === "it" || normalized === "italiano") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira da Itália (Italiano)"
        {...props}
      >
        <rect width="20" height="40" fill="#009246" />
        <rect x="20" width="20" height="40" fill="#FFFFFF" />
        <rect x="40" width="20" height="40" fill="#CE2B37" />
      </svg>
    );
  }

  // CHINESE / MANDARIN FLAG
  if (normalized === "mandarin" || normalized === "chinese" || normalized === "zh" || normalized === "zh-cn" || normalized === "mandarim" || normalized === "中文") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira da China (Mandarim)"
        {...props}
      >
        <rect width="60" height="40" fill="#DE2910" />
        <polygon points="10,4 12,11 18,11 13,15 15,22 10,18 5,22 7,15 2,11 8,11" fill="#FFDE00" />
        <circle cx="21" cy="6" r="1.5" fill="#FFDE00" />
        <circle cx="25" cy="10" r="1.5" fill="#FFDE00" />
        <circle cx="25" cy="16" r="1.5" fill="#FFDE00" />
        <circle cx="21" cy="20" r="1.5" fill="#FFDE00" />
      </svg>
    );
  }

  // ANGOLA FLAG
  if (normalized === "ao" || normalized === "angola") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira de Angola"
        {...props}
      >
        <rect width="60" height="20" fill="#CC092F" />
        <rect y="20" width="60" height="20" fill="#000000" />
        <circle cx="30" cy="20" r="7" fill="none" stroke="#FFD100" strokeWidth="2.5" strokeDasharray="14 8" />
        <line x1="24" y1="26" x2="36" y2="14" stroke="#FFD100" strokeWidth="2" strokeLinecap="round" />
        <polygon points="30,17 31,20 34,20 31.5,22 32.5,25 30,23 27.5,25 28.5,22 26,20 29,20" fill="#FFD100" transform="scale(0.6) translate(20, 13)" />
      </svg>
    );
  }

  // MOZAMBIQUE FLAG
  if (normalized === "mz" || normalized === "mozambique" || normalized === "moçambique") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira de Moçambique"
        {...props}
      >
        <rect width="60" height="12" fill="#006600" />
        <rect y="12" width="60" height="2" fill="#FFFFFF" />
        <rect y="14" width="60" height="12" fill="#000000" />
        <rect y="26" width="60" height="2" fill="#FFFFFF" />
        <rect y="28" width="60" height="12" fill="#FFCC00" />
        <polygon points="0,0 24,20 0,40" fill="#D21034" />
        <polygon points="8,15 9.5,19 14,19 10.5,21.5 12,25.5 8,23 4,25.5 5.5,21.5 2,19 6.5,19" fill="#FFD100" />
      </svg>
    );
  }

  // BRAZIL FLAG
  if (normalized === "br" || normalized === "brazil" || normalized === "brasil") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira do Brasil"
        {...props}
      >
        <rect width="60" height="40" fill="#009c3b" />
        <polygon points="30,4 54,20 30,36 6,20" fill="#ffdf00" />
        <circle cx="30" cy="20" r="7" fill="#002776" />
      </svg>
    );
  }

  // CABO VERDE FLAG
  if (normalized === "cv" || normalized === "cape_verde" || normalized === "cabo verde") {
    return (
      <svg
        viewBox="0 0 60 40"
        className={baseClasses}
        aria-label="Bandeira de Cabo Verde"
        {...props}
      >
        <rect width="60" height="40" fill="#003893" />
        <rect y="20" width="60" height="8" fill="#CF142B" />
        <rect y="18" width="60" height="2" fill="#FFFFFF" />
        <rect y="28" width="60" height="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // GENERIC FALLBACK
  return (
    <svg
      viewBox="0 0 60 40"
      className={baseClasses}
      aria-label="Idioma"
      {...props}
    >
      <rect width="60" height="40" fill="currentColor" opacity="0.12" />
      <circle cx="30" cy="20" r="10" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export default Flag;
