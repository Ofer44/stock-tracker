import { useState, useEffect } from 'react'
import type { Candle, TimeRange } from '../types'
import { getCandles } from '../api/finnhub'
import { TIME_RANGES } from '../utils/timeRanges'

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

    getCandles(symbol, config.interval, config.outputsize)
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
