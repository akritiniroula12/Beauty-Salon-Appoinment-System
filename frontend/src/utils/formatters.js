export function formatCurrency(value, options = {}) {
  const { locale = 'en-US', currency = 'USD' } = options;

  const num =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : NaN;

  if (!Number.isFinite(num)) return '';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    // Fallback if Intl/currency is misconfigured in runtime
    return `$${num.toFixed(2)}`;
  }
}


