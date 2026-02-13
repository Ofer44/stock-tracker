import type { SearchResult, WatchlistItem } from '../../types'

interface SearchResultsProps {
  results: SearchResult[]
  loading: boolean
  query: string
  hasItem: (symbol: string) => boolean
  onAdd: (item: WatchlistItem) => void
  onRemove: (symbol: string) => void
}

function inferType(result: SearchResult): WatchlistItem['type'] {
  if (result.symbol.startsWith('OANDA:') || result.type === 'Forex') return 'forex'
  return 'stock'
}

export function SearchResults({ results, loading, query, hasItem, onAdd, onRemove }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="flex items-center justify-center py-12 text-[#98989D] text-sm">
        Search by ticker or company name
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#34C759] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-[#98989D] text-sm">
        No results for "{query}"
      </div>
    )
  }

  return (
    <div className="overflow-y-auto max-h-[60vh] divide-y divide-[#38383A]/50">
      {results.map(result => {
        const inWatchlist = hasItem(result.symbol)
        return (
          <div
            key={result.symbol}
            className="flex items-center justify-between px-4 py-3 hover:bg-[#1C1C1E]/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{result.displaySymbol}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1C1C1E] text-[#98989D] uppercase">
                  {result.type}
                </span>
              </div>
              <div className="text-xs text-[#98989D] truncate mt-0.5">{result.description}</div>
            </div>
            <button
              onClick={() => {
                if (inWatchlist) {
                  onRemove(result.symbol)
                } else {
                  onAdd({
                    symbol: result.symbol,
                    displaySymbol: result.displaySymbol,
                    name: result.description,
                    type: inferType(result),
                  })
                }
              }}
              className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                inWatchlist
                  ? 'bg-[#38383A] text-[#FF3B30] hover:bg-[#FF3B30]/20'
                  : 'bg-[#34C759]/15 text-[#34C759] hover:bg-[#34C759]/25'
              }`}
            >
              {inWatchlist ? 'Remove' : 'Add'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
