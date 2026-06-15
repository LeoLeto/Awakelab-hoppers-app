const currencyFormatters: Record<string, Intl.NumberFormat> = {};

function getFormatter(currency: string): Intl.NumberFormat {
  if (!currencyFormatters[currency]) {
    const locale = currency === "USD" ? "en-US" : currency === "BRL" ? "pt-BR" : "es-ES";
    currencyFormatters[currency] = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return currencyFormatters[currency];
}

export function formatCurrency(amount: number, currency: string): string {
  return getFormatter(currency).format(amount);
}

export function formatSalaryRange(
  min: number,
  max: number,
  currency: string
): string {
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
}

export function formatDailyRate(
  min: number,
  max: number,
  currency: string
): string {
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)} / dia`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-ES").format(num);
}

export function formatPercentage(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function abbreviateNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  return num.toString();
}
