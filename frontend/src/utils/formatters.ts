/**
 * Utility Layer - Framework-Independent Formatters (SPR-301)
 */

export function formatDate(dateInput: string | Date | number, formatStr: 'short' | 'long' | 'iso' = 'short'): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  if (formatStr === 'iso') {
    return d.toISOString().split('T')[0];
  }

  if (formatStr === 'long') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(dateInput: string | Date | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function formatNumber(val: number, decimals: number = 0): string {
  if (typeof val !== 'number' || isNaN(val)) return '0';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(val: number): string {
  if (typeof val !== 'number' || isNaN(val)) return '0%';
  return `${Math.round(val)}%`;
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
