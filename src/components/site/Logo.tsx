import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-2.5"
      aria-label="MyTeacher"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-[var(--primary)] text-white shadow-sm transition-transform group-hover:-rotate-6">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 8.5 12 4l10 4.5-10 4.5L2 8.5Z"
            fill="currentColor"
          />
          <path
            d="M6.5 10.7v4.1c0 1.6 2.5 2.9 5.5 2.9s5.5-1.3 5.5-2.9v-4.1"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M20.5 9.3V14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="font-display text-xl font-extrabold tracking-tight text-[var(--foreground)]">
        My<span className="text-[var(--primary)]">Teacher</span>
      </span>
    </Link>
  );
}