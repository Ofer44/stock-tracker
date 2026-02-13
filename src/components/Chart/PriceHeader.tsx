import type { Quote, WatchlistItem } from '../../types'
import { formatPrice, formatChange, formatPercent } from '../../utils/formatters'
import { priceColor } from '../../utils/colors'

interface PriceHeaderProps {
  item: WatchlistItem
  quote: Quote | null
  loading: boolean
}

export function PriceHeader({ item, quote, loading }: PriceHeaderProps) {
  const change = quote?.d ?? 0
  const color = priceColor(change)

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">{item.displaySymbol}</h1>
        <span className="text-sm text-[#98989D]">{item.name}</span>
      </div>
      {loading && !quote ? (
        <div className="mt-1 h-10 flex items-center">
          <div className="w-24 h-6 bg-[#1C1C1E] rounded animate-pulse" />
        </div>
      ) : quote ? (
        <div className="mt-1 flex items-baseline gap-3">
          <span className="text-3xl font-semibold tracking-tight">
            {formatPrice(quote.c)}
          </span>
          <span className="text-lg font-medium" style={{ color }}>
            {formatChange(quote.d)} ({formatPercent(quote.dp)})
          </span>
        </div>
      ) : null}
    </div>
  )
}
