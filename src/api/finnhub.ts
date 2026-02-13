import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from '../config'
import type { Quote, Candle, CandleResponse, SearchResult } from '../types'
import { getCached, setCache, nowUnix } from './helpers'

async function fetchJson<T>(endpoint: string, params: Record<string, string>): Promise<T> {
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

export async function getQuote(symbol: string): Promise<Quote> {
  const cacheKey = `quote:${symbol}`
  const cached = getCached<Quote>(cacheKey, 30_000)
  if (cached) return cached

  const data = await fetchJson<Quote>('/quote', { symbol })
  setCache(cacheKey, data)
  return data
}

function isForex(symbol: string): boolean {
  return symbol.startsWith('OANDA:')
}

export async function getCandles(
  symbol: string,
  resolution: string,
  from: number,
  to?: number,
): Promise<Candle[]> {
  const toTs = to ?? nowUnix()
  const cacheKey = `candles:${symbol}:${resolution}:${from}:${toTs}`
  const cached = getCached<Candle[]>(cacheKey, 60_000)
  if (cached) return cached

  const endpoint = isForex(symbol) ? '/forex/candles' : '/stock/candles'
  const data = await fetchJson<CandleResponse>(endpoint, {
    symbol,
    resolution,
    from: from.toString(),
    to: toTs.toString(),
  })

  if (data.s !== 'ok' || !data.t) return []

  const candles: Candle[] = data.t.map((t, i) => ({
    time: t,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v?.[i] ?? 0,
  }))

  setCache(cacheKey, candles)
  return candles
}

export async function searchSymbol(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 1) return []

  const cacheKey = `search:${query}`
  const cached = getCached<SearchResult[]>(cacheKey, 300_000)
  if (cached) return cached

  const data = await fetchJson<{ count: number; result: SearchResult[] }>('/search', { q: query })
  const results = data.result?.slice(0, 20) ?? []
  setCache(cacheKey, results)
  return results
}

export const FOREX_PAIRS: { symbol: string; displaySymbol: string; name: string }[] = [
  { symbol: 'OANDA:EUR_USD', displaySymbol: 'EUR/USD', name: 'Euro / US Dollar' },
  { symbol: 'OANDA:GBP_USD', displaySymbol: 'GBP/USD', name: 'British Pound / US Dollar' },
  { symbol: 'OANDA:USD_JPY', displaySymbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
  { symbol: 'OANDA:USD_CHF', displaySymbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
  { symbol: 'OANDA:AUD_USD', displaySymbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
  { symbol: 'OANDA:USD_CAD', displaySymbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
  { symbol: 'OANDA:NZD_USD', displaySymbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar' },
]
