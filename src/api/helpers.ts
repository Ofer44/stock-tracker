import type { CacheEntry } from '../types'

const cache = new Map<string, CacheEntry<unknown>>()

export function getCached<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > ttl) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export function nowUnix(): number {
  return Math.floor(Date.now() / 1000)
}
