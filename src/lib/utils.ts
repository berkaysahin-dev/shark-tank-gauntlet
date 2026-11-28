import { Language } from "@/locales/i18n";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPercent(value: number, lang: Language): string {
  const rounded = Math.round(value);
  return lang === "tr" ? `%${rounded}` : `${rounded}%`;
}
