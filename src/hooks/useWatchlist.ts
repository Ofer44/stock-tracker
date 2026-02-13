import { useState, useCallback, useEffect } from 'react'
import type { WatchlistItem } from '../types'

const STORAGE_KEY = 'stock-tracker-watchlist'

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { symbol: 'AAPL', displaySymbol: 'AAPL', name: 'Apple Inc', type: 'stock' },
  { symbol: 'MSFT', displaySymbol: 'MSFT', name: 'Microsoft Corp', type: 'stock' },
  { symbol: 'GOOGL', displaySymbol: 'GOOGL', name: 'Alphabet Inc', type: 'stock' },
  { symbol: 'AMZN', displaySymbol: 'AMZN', name: 'Amazon.com Inc', type: 'stock' },
  { symbol: 'OANDA:EUR_USD', displaySymbol: 'EUR/USD', name: 'Euro / US Dollar', type: 'forex' },
]

function loadWatchlist(): WatchlistItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* use defaults */ }
  return DEFAULT_WATCHLIST
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(loadWatchlist)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((item: WatchlistItem) => {
    setItems(prev => {
      if (prev.some(i => i.symbol === item.symbol)) return prev
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((symbol: string) => {
    setItems(prev => prev.filter(i => i.symbol !== symbol))
  }, [])

  const hasItem = useCallback((symbol: string) => {
    return items.some(i => i.symbol === symbol)
  }, [items])

  return { items, addItem, removeItem, hasItem }
}
