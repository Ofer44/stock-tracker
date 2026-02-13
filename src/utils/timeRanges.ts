import type { TimeRange, TimeRangeConfig } from '../types'

export const TIME_RANGES: Record<TimeRange, TimeRangeConfig> = {
  '1D': { interval: '5min', outputsize: 78 },
  '1W': { interval: '15min', outputsize: 130 },
  '1M': { interval: '1h', outputsize: 154 },
  '3M': { interval: '1day', outputsize: 66 },
  'YTD': { interval: '1day', outputsize: 250 },
  '1Y': { interval: '1day', outputsize: 252 },
  '2Y': { interval: '1week', outputsize: 104 },
  'Max': { interval: '1month', outputsize: 300 },
}

export const TIME_RANGE_LABELS: TimeRange[] = ['1D', '1W', '1M', '3M', 'YTD', '1Y', '2Y', 'Max']

export function getCacheTTL(range: TimeRange): number {
  switch (range) {
    case '1D': return 60_000
    case '1W': return 120_000
    case '1M': return 300_000
    default: return 300_000
  }
}
