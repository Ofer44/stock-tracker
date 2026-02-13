import type { TimeRange, TimeRangeConfig } from '../types'

export const TIME_RANGES: Record<TimeRange, TimeRangeConfig> = {
  '1D': { range: '1d', interval: '5m' },
  '1W': { range: '5d', interval: '15m' },
  '1M': { range: '1mo', interval: '1h' },
  '3M': { range: '3mo', interval: '1d' },
  'YTD': { range: 'ytd', interval: '1d' },
  '1Y': { range: '1y', interval: '1d' },
  '2Y': { range: '2y', interval: '1wk' },
  'Max': { range: 'max', interval: '1mo' },
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
