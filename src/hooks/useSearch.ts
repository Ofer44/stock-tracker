import { useState, useEffect, useRef } from 'react'
import type { SearchResult } from '../types'
import { searchSymbol, FOREX_PAIRS } from '../api/finnhub'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    debounceRef.current = setTimeout(async () => {
      try {
        const apiResults = await searchSymbol(query)

        // Supplement with matching forex pairs
        const q = query.toLowerCase()
        const forexMatches = FOREX_PAIRS
          .filter(f =>
            f.displaySymbol.toLowerCase().includes(q) ||
            f.name.toLowerCase().includes(q)
          )
          .map(f => ({
            description: f.name,
            displaySymbol: f.displaySymbol,
            symbol: f.symbol,
            type: 'Forex',
          }))

        // Merge: forex first if query looks currency-like, otherwise API first
        const isCurrencyQuery = /^[a-z]{3}(\/[a-z]{3})?$/i.test(q) || ['eur', 'gbp', 'jpy', 'chf', 'aud', 'cad', 'nzd', 'forex', 'fx'].some(c => q.includes(c))

        const merged = isCurrencyQuery
          ? [...forexMatches, ...apiResults]
          : [...apiResults, ...forexMatches]

        // Deduplicate by symbol
        const seen = new Set<string>()
        const unique = merged.filter(r => {
          if (seen.has(r.symbol)) return false
          seen.add(r.symbol)
          return true
        })

        setResults(unique.slice(0, 15))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return { query, setQuery, results, loading }
}
