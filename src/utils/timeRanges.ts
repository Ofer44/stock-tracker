import type { TimeRange, TimeRangeConfig } from '../types'

function nowUnix(): number {
  return Math.floor(Date.now() / 1000)
}

function daysAgo(days: number): number {
  return nowUnix() - days * 86400
}

function startOfYear(): number {
  const now = new Date()
  return Math.floor(new Date(now.getFullYear(), 0, 1).getTime() / 1000)
}

export const TIME_RANGES: Record<TimeRange, TimeRangeConfig> = {
  '1D': { resolution: '5', getFrom: () => daysAgo(1) },
  '1W': { resolution: '15', getFrom: () => daysAgo(7) },
  '1M': { resolution: '60', getFrom: () => daysAgo(30) },
  '3M': { resolution: 'D', getFrom: () => daysAgo(90) },
  'YTD': { resolution: 'D', getFrom: () => startOfYear() },
  '1Y': { resolution: 'D', getFrom: () => daysAgo(365) },
  '2Y': { resolution: 'W', getFrom: () => daysAgo(730) },
  'Max': { resolution: 'M', getFrom: () => daysAgo(365 * 20) },
}

export const TIME_RANGE_LABELS: TimeRange[] = ['1D', '1W', '1M', '3M', 'YTD', '1Y', '2Y', 'Max']

export function getCacheTTL(range: TimeRange): number {
  switch (range) {
    case '1D': return 60_000       // 1 min
    case '1W': return 120_000      // 2 min
    case '1M': return 300_000      // 5 min
    default: return 300_000        // 5 min
  }
}
