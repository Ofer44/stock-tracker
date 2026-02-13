export const COLORS = {
  green: '#34C759',
  greenFaded: 'rgba(52, 199, 89, 0.12)',
  red: '#FF3B30',
  redFaded: 'rgba(255, 59, 48, 0.12)',
  textPrimary: '#FFFFFF',
  textSecondary: '#98989D',
  background: '#000000',
  surface: '#1C1C1E',
  surfaceHover: '#2C2C2E',
  border: '#38383A',
} as const

export function priceColor(change: number): string {
  if (change > 0) return COLORS.green
  if (change < 0) return COLORS.red
  return COLORS.textSecondary
}

export function gradientTopColor(change: number): string {
  return change >= 0 ? COLORS.greenFaded : COLORS.redFaded
}

export function gradientBottomColor(_change: number): string {
  return 'rgba(0, 0, 0, 0)'
}

export function lineColor(change: number): string {
  return change >= 0 ? COLORS.green : COLORS.red
}
