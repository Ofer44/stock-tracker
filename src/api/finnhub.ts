import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from '../config'
import type { Quote, Candle, SearchResult } from '../types'
import { getCached, setCache } from './helpers'

const TWELVE_DATA_KEY = 'demo'
const TWELVE_DATA_BASE = 'https://api.twelvedata.com'

// ── Finnhub helpers ──

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

function toFinnhubSymbol(symbol: string): string {
  // Convert Twelve Data forex format (EUR/USD) to Finnhub (OANDA:EUR_USD)
  const forexMatch = symbol.match(/^([A-Z]{3})\/([A-Z]{3})$/)
  if (forexMatch) {
    return `OANDA:${forexMatch[1]}_${forexMatch[2]}`
  }
  return symbol
}

export async function getQuote(symbol: string): Promise<Quote> {
  const finnhubSymbol = toFinnhubSymbol(symbol)
  const cacheKey = `quote:${finnhubSymbol}`
  const cached = getCached<Quote>(cacheKey, 30_000)
  if (cached) return cached

  const data = await fetchFinnhub<Quote>('/quote', { symbol: finnhubSymbol })
  setCache(cacheKey, data)
  return data
}

// ── Chart data (Twelve Data — free, CORS-friendly) ──

interface TwelveDataResponse {
  values?: Array<{
    datetime: string
    open: string
    high: string
    low: string
    close: string
    volume?: string
  }>
  status: string
  message?: string
}

export async function getCandles(
  symbol: string,
  interval: string,
  outputsize: number,
): Promise<Candle[]> {
  const cacheKey = `candles:${symbol}:${interval}:${outputsize}`
  const cached = getCached<Candle[]>(cacheKey, 60_000)
  if (cached) return cached

  const url = new URL(`${TWELVE_DATA_BASE}/time_series`)
  url.searchParams.set('symbol', symbol)
  url.searchParams.set('interval', interval)
  url.searchParams.set('outputsize', outputsize.toString())
  url.searchParams.set('apikey', TWELVE_DATA_KEY)

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`Twelve Data error: ${res.status}`)
  }

  const data: TwelveDataResponse = await res.json()
  if (data.status !== 'ok' || !data.values) return []

  // Twelve Data returns newest first — reverse for chart
  const candles: Candle[] = data.values
    .map(v => ({
      time: Math.floor(new Date(v.datetime).getTime() / 1000),
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: v.volume ? parseInt(v.volume, 10) : 0,
    }))
    .reverse()

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

// ── Static forex pairs (Twelve Data format: BASE/QUOTE) ──

export const FOREX_PAIRS: { symbol: string; displaySymbol: string; name: string }[] = [
  { symbol: 'EUR/USD', displaySymbol: 'EUR/USD', name: 'Euro / US Dollar' },
  { symbol: 'GBP/USD', displaySymbol: 'GBP/USD', name: 'British Pound / US Dollar' },
  { symbol: 'USD/JPY', displaySymbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
  { symbol: 'USD/CHF', displaySymbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
  { symbol: 'AUD/USD', displaySymbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
  { symbol: 'USD/CAD', displaySymbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
  { symbol: 'NZD/USD', displaySymbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar' },
]
