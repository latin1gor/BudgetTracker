import { currencies } from "@/lib/currencies";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  );
}

export function getFormatterForCurrency(currency: string) {
  const locale = currencies.find((c) => c.value === currency)?.locale;

  return new Intl.NumberFormat(locale, { style: "currency", currency });
}
