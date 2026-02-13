import type { TimeRange } from '../../types'
import { TIME_RANGE_LABELS } from '../../utils/timeRanges'

interface TimeRangeBarProps {
  selected: TimeRange
  onChange: (range: TimeRange) => void
}

export function TimeRangeBar({ selected, onChange }: TimeRangeBarProps) {
  return (
    <div className="flex gap-1 px-4 py-2">
      {TIME_RANGE_LABELS.map(range => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            selected === range
              ? 'bg-[#34C759] text-black'
              : 'bg-[#1C1C1E] text-[#98989D] hover:bg-[#2C2C2E] hover:text-white'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  )
}
