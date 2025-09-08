"use client";

export function localeDateString(
  date: string | Date,
  locale: string | undefined = undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, options);
}
