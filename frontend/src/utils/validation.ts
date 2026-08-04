/**
 * Reusable Validation Utilities (SPR-301)
 */

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  // Minimum 8 characters
  return password.length >= 8;
}

export function isValidUUID(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function isNonEmptyString(val: any): boolean {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isInRange(val: number, min: number, max: number): boolean {
  return typeof val === 'number' && !isNaN(val) && val >= min && val <= max;
}

export function sanitizeInput(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/<[^>]*>?/gm, '').trim();
}
