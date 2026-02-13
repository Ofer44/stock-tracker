interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

export function SearchInput({ value, onChange, onClose }: SearchInputProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-[#38383A]">
      <div className="flex-1 relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98989D]"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search stocks, currencies..."
          autoFocus
          className="w-full bg-[#1C1C1E] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#98989D] outline-none focus:ring-1 focus:ring-[#34C759]/50"
        />
      </div>
      <button
        onClick={onClose}
        className="text-sm text-[#34C759] font-medium hover:opacity-80"
      >
        Cancel
      </button>
    </div>
  )
}
