import { useState, useEffect } from 'react'
import type { Candle, TimeRange } from '../types'
import { getCandles } from '../api/finnhub'
import { TIME_RANGES, getCacheTTL } from '../utils/timeRanges'
import { nowUnix } from '../api/helpers'

export function useCandles(symbol: string | null, range: TimeRange) {
  const [candles, setCandles] = useState<Candle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) {
      setCandles([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    const config = TIME_RANGES[range]
    const from = config.getFrom()
    const to = nowUnix()

    getCandles(symbol, config.resolution, from, to)
      .then(data => {
        if (!cancelled) {
          setCandles(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [symbol, range])

  return { candles, loading, error }
}
