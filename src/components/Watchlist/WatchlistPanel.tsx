import type { WatchlistItem as WatchlistItemType } from '../../types'
import { WatchlistItemRow } from './WatchlistItem'

interface WatchlistPanelProps {
  items: WatchlistItemType[]
  selectedSymbol: string | null
  onSelect: (item: WatchlistItemType) => void
  onRemove: (symbol: string) => void
  onOpenSearch: () => void
}

export function WatchlistPanel({ items, selectedSymbol, onSelect, onRemove, onOpenSearch }: WatchlistPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#38383A]">
        <h2 className="text-lg font-bold">Watchlist</h2>
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1C1E] hover:bg-[#2C2C2E] text-sm text-[#34C759] font-medium transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#38383A]/50">
        {items.map(item => (
          <WatchlistItemRow
            key={item.symbol}
            item={item}
            selected={selectedSymbol === item.symbol}
            onSelect={onSelect}
            onRemove={onRemove}
          />
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#98989D]">
            <p className="text-sm">No instruments</p>
            <button
              onClick={onOpenSearch}
              className="mt-2 text-sm text-[#34C759] hover:underline"
            >
              Add your first stock
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
