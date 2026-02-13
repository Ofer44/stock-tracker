import { useEffect, useState } from 'react'
import type { WatchlistItem as WatchlistItemType, Quote } from '../../types'
import { getQuote } from '../../api/finnhub'
import { formatPrice, formatPercent } from '../../utils/formatters'
import { priceColor, COLORS } from '../../utils/colors'

interface WatchlistItemProps {
  item: WatchlistItemType
  selected: boolean
  onSelect: (item: WatchlistItemType) => void
  onRemove: (symbol: string) => void
}

export function WatchlistItemRow({ item, selected, onSelect, onRemove }: WatchlistItemProps) {
  const [quote, setQuote] = useState<Quote | null>(null)

  useEffect(() => {
    let cancelled = false
    getQuote(item.symbol)
      .then(q => { if (!cancelled) setQuote(q) })
      .catch(() => {})

    const interval = setInterval(() => {
      getQuote(item.symbol)
        .then(q => { if (!cancelled) setQuote(q) })
        .catch(() => {})
    }, 30_000)

    return () => { cancelled = true; clearInterval(interval) }
  }, [item.symbol])

  const change = quote?.dp ?? 0
  const color = priceColor(change)

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
        selected ? 'bg-[#1C1C1E]' : 'hover:bg-[#1C1C1E]/50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{item.displaySymbol}</div>
        <div className="text-xs text-[#98989D] truncate">{item.name}</div>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <div className="text-right">
          {quote ? (
            <>
              <div className="text-sm font-medium">{formatPrice(quote.c)}</div>
              <div
                className="text-xs font-medium px-1.5 py-0.5 rounded"
                style={{ backgroundColor: color + '22', color }}
              >
                {formatPercent(quote.dp)}
              </div>
            </>
          ) : (
            <div className="w-14 h-4 bg-[#1C1C1E] rounded animate-pulse" />
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onRemove(item.symbol) }}
          className="opacity-0 group-hover:opacity-100 ml-1 p-1 rounded hover:bg-[#38383A] transition-opacity text-[#98989D] hover:text-[#FF3B30]"
          title="Remove"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
