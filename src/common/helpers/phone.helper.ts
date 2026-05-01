const PHONE_REGEX = /^\+998\d{9}$/;

/**
 * Normalizes raw phone input to +998XXXXXXXXX format.
 * Handles: "90 123 45 67", "998901234567", "+998901234567", "0901234567"
 */
export function normalizePhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-\(\)]/g, '');

  if (PHONE_REGEX.test(cleaned)) return cleaned;
  if (/^998\d{9}$/.test(cleaned)) return '+' + cleaned;
  if (/^0\d{9}$/.test(cleaned)) return '+998' + cleaned.slice(1);
  if (/^\d{9}$/.test(cleaned)) return '+998' + cleaned;

  return cleaned;
}

export function isPhone(value: string): boolean {
  return PHONE_REGEX.test(value);
}

/** True if value looks like a phone after normalization (used before DB lookup). */
export function looksLikePhone(value: string): boolean {
  return isPhone(normalizePhone(value.replace(/[\s\-\(\)]/g, '')));
}
