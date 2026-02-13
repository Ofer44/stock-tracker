export interface Quote {
  c: number   // current price
  d: number   // change
  dp: number  // percent change
  h: number   // high
  l: number   // low
  o: number   // open
  pc: number  // previous close
  t: number   // timestamp
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CandleResponse {
  c: number[]  // close
  h: number[]  // high
  l: number[]  // low
  o: number[]  // open
  t: number[]  // timestamps
  v: number[]  // volume
  s: string    // status: "ok" | "no_data"
}

export interface SearchResult {
  description: string
  displaySymbol: string
  symbol: string
  type: string
}

export interface WatchlistItem {
  symbol: string
  displaySymbol: string
  name: string
  type: 'stock' | 'forex' | 'bond'
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | 'YTD' | '1Y' | '2Y' | 'Max'

export interface TimeRangeConfig {
  range: string     // Yahoo Finance range param (e.g. '3mo')
  interval: string  // Yahoo Finance interval param (e.g. '1d')
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
}
