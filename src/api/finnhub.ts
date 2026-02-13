import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from '../config'
import type { Quote, Candle, SearchResult } from '../types'
import { getCached, setCache } from './helpers'

async function fetchFinnhub<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`)
  url.searchParams.set('token', FINNHUB_API_KEY)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// ── Quotes (Finnhub — works on free tier) ──

export async function getQuote(symbol: string): Promise<Quote> {
  // For forex symbols like EURUSD=X, convert to Finnhub format for quote
  const finnhubSymbol = yahooToFinnhubSymbol(symbol)
  const cacheKey = `quote:${finnhubSymbol}`
  const cached = getCached<Quote>(cacheKey, 30_000)
  if (cached) return cached

  const data = await fetchFinnhub<Quote>('/quote', { symbol: finnhubSymbol })
  setCache(cacheKey, data)
  return data
}

function yahooToFinnhubSymbol(symbol: string): string {
  // Convert Yahoo forex format (EURUSD=X) to Finnhub format (OANDA:EUR_USD)
  const forexMatch = symbol.match(/^([A-Z]{3})([A-Z]{3})=X$/)
  if (forexMatch) {
    return `OANDA:${forexMatch[1]}_${forexMatch[2]}`
  }
  return symbol
}

// ── Chart data (Yahoo Finance — free, no key needed) ──

interface YahooChartResponse {
  chart: {
    result: Array<{
      timestamp: number[]
      indicators: {
        quote: Array<{
          open: (number | null)[]
          high: (number | null)[]
          low: (number | null)[]
          close: (number | null)[]
          volume: (number | null)[]
        }>
      }
    }> | null
    error: { description: string } | null
  }
}

export async function getCandles(
  symbol: string,
  range: string,
  interval: string,
): Promise<Candle[]> {
  const cacheKey = `candles:${symbol}:${range}:${interval}`
  const cached = getCached<Candle[]>(cacheKey, 60_000)
  if (cached) return cached

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Yahoo Finance error: ${res.status}`)
  }

  const data: YahooChartResponse = await res.json()
  if (!data.chart.result || data.chart.result.length === 0) return []

  const result = data.chart.result[0]
  const timestamps = result.timestamp
  const quote = result.indicators.quote[0]

  if (!timestamps || !quote) return []

  const candles: Candle[] = []
  for (let i = 0; i < timestamps.length; i++) {
    const close = quote.close[i]
    if (close == null) continue
    candles.push({
      time: timestamps[i],
      open: quote.open[i] ?? close,
      high: quote.high[i] ?? close,
      low: quote.low[i] ?? close,
      close,
      volume: quote.volume[i] ?? 0,
    })
  }

  setCache(cacheKey, candles)
  return candles
}

// ── Search (Finnhub — works on free tier) ──

export async function searchSymbol(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 1) return []

  const cacheKey = `search:${query}`
  const cached = getCached<SearchResult[]>(cacheKey, 300_000)
  if (cached) return cached

  const data = await fetchFinnhub<{ count: number; result: SearchResult[] }>('/search', { q: query })
  const results = data.result?.slice(0, 20) ?? []
  setCache(cacheKey, results)
  return results
}

// ── Static forex pairs (Yahoo Finance format) ──

export const FOREX_PAIRS: { symbol: string; displaySymbol: string; name: string }[] = [
  { symbol: 'EURUSD=X', displaySymbol: 'EUR/USD', name: 'Euro / US Dollar' },
  { symbol: 'GBPUSD=X', displaySymbol: 'GBP/USD', name: 'British Pound / US Dollar' },
  { symbol: 'JPY=X', displaySymbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
  { symbol: 'CHF=X', displaySymbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
  { symbol: 'AUDUSD=X', displaySymbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
  { symbol: 'CAD=X', displaySymbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
  { symbol: 'NZDUSD=X', displaySymbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar' },
]
