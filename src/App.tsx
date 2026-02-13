import { useState, useCallback } from 'react'
import type { WatchlistItem, TimeRange } from './types'
import { useWatchlist } from './hooks/useWatchlist'
import { useQuote } from './hooks/useQuote'
import { useCandles } from './hooks/useCandles'
import { AppShell } from './components/Layout/AppShell'
import { WatchlistPanel } from './components/Watchlist/WatchlistPanel'
import { PriceHeader } from './components/Chart/PriceHeader'
import { PriceChart } from './components/Chart/PriceChart'
import { TimeRangeBar } from './components/Chart/TimeRangeBar'
import { SearchModal } from './components/Search/SearchModal'

export default function App() {
  const { items, addItem, removeItem, hasItem } = useWatchlist()
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(items[0] ?? null)
  const [timeRange, setTimeRange] = useState<TimeRange>('3M')
  const [searchOpen, setSearchOpen] = useState(false)

  const { quote, loading: quoteLoading } = useQuote(selectedItem?.symbol ?? null)
  const { candles, loading: candlesLoading } = useCandles(selectedItem?.symbol ?? null, timeRange)

  const handleSelect = useCallback((item: WatchlistItem) => {
    setSelectedItem(item)
  }, [])

  const handleRemove = useCallback((symbol: string) => {
    removeItem(symbol)
    if (selectedItem?.symbol === symbol) {
      setSelectedItem(items.find(i => i.symbol !== symbol) ?? null)
    }
  }, [removeItem, selectedItem, items])

  const handleAdd = useCallback((item: WatchlistItem) => {
    addItem(item)
    setSelectedItem(item)
    setSearchOpen(false)
  }, [addItem])

  return (
    <>
      <AppShell
        sidebar={
          <WatchlistPanel
            items={items}
            selectedSymbol={selectedItem?.symbol ?? null}
            onSelect={handleSelect}
            onRemove={handleRemove}
            onOpenSearch={() => setSearchOpen(true)}
          />
        }
        main={
          selectedItem ? (
            <div className="flex flex-col">
              <PriceHeader item={selectedItem} quote={quote} loading={quoteLoading} />
              <PriceChart candles={candles} loading={candlesLoading} />
              <TimeRangeBar selected={timeRange} onChange={setTimeRange} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#98989D]">
              <div className="text-center">
                <p className="text-lg">No instrument selected</p>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="mt-3 text-sm text-[#34C759] hover:underline"
                >
                  Search and add stocks
                </button>
              </div>
            </div>
          )
        }
      />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        hasItem={hasItem}
        onAdd={handleAdd}
        onRemove={removeItem}
      />
    </>
  )
}
