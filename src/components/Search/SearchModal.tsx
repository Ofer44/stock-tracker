import { useEffect } from 'react'
import type { WatchlistItem } from '../../types'
import { useSearch } from '../../hooks/useSearch'
import { SearchInput } from './SearchInput'
import { SearchResults } from './SearchResults'

interface SearchModalProps {
  open: boolean
  onClose: () => void
  hasItem: (symbol: string) => boolean
  onAdd: (item: WatchlistItem) => void
  onRemove: (symbol: string) => void
}

export function SearchModal({ open, onClose, hasItem, onAdd, onRemove }: SearchModalProps) {
  const { query, setQuery, results, loading } = useSearch()

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Reset on close
  useEffect(() => {
    if (!open) setQuery('')
  }, [open, setQuery])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[#1C1C1E] rounded-2xl border border-[#38383A] shadow-2xl overflow-hidden">
        <SearchInput value={query} onChange={setQuery} onClose={onClose} />
        <SearchResults
          results={results}
          loading={loading}
          query={query}
          hasItem={hasItem}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </div>
    </div>
  )
}
