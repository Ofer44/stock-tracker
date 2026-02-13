import { useState, useEffect } from 'react'
import type { Quote } from '../types'
import { getQuote } from '../api/finnhub'

export function useQuote(symbol: string | null) {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!symbol) {
      setQuote(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getQuote(symbol)
      .then(data => {
        if (!cancelled) {
          setQuote(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      getQuote(symbol)
        .then(data => { if (!cancelled) setQuote(data) })
        .catch(() => {})
    }, 30_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [symbol])

  return { quote, loading, error }
}
