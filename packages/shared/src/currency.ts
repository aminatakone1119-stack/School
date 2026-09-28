/**
 * School Management System - Currency Utilities (FCFA)
 * Spec: Use BIGINT in database, no decimals for FCFA, safe formatting
 */

export function formatFCFA(amount: number | bigint | string | null | undefined, locale: 'fr' | 'ar' = 'fr'): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return locale === 'ar' ? '0 ف.إف' : '0 FCFA';
  }

  const numericValue = typeof amount === 'bigint' ? Number(amount) : Math.round(Number(amount));
  
  // Format with space as thousands separator
  const formattedNumber = new Intl.NumberFormat(locale === 'ar' ? 'ar-FR' : 'fr-FR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numericValue);

  if (locale === 'ar') {
    return `${formattedNumber} د.إ.س (FCFA)`;
  }
  return `${formattedNumber} FCFA`;
}

export function parseFCFA(input: string): number {
  const cleaned = input.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}
