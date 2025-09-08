"use client";

export function LocaleDateString({
  date,
  locale = undefined,
  options,
}: {
  date: string | Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return <>{d.toLocaleDateString(locale, options)}</>;
}

export function LocaleDateTimeString({
  date,
  locale = undefined,
  options,
}: {
  date: string | Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return <>{d.toLocaleString(locale, options)}</>;
}

export function LocaleTimeString({
  date,
  locale = undefined,
  options,
}: {
  date: string | Date;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return <>{d.toLocaleTimeString(locale, options)}</>;
}
