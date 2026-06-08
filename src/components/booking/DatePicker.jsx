import { formatDisplayDate, isPastDate, isToday } from '../../utils/dates'

export default function DatePicker({ dates, selectedDate, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {dates.map((date) => {
        const past = isPastDate(date)
        const selected = selectedDate === date
        return (
          <button
            key={date}
            type="button"
            disabled={past}
            onClick={() => !past && onSelect(date)}
            className={`flex min-w-[4.5rem] shrink-0 flex-col items-center rounded-xl border px-3 py-3 text-center transition-all ${
              past
                ? 'cursor-not-allowed border-salon-100 bg-salon-50 text-salon-300'
                : selected
                  ? 'border-salon-600 bg-salon-700 text-white shadow-md'
                  : 'border-salon-200 bg-white text-salon-800 hover:border-salon-400 hover:shadow-sm'
            }`}
          >
            <span className="text-xs font-medium uppercase opacity-80">
              {isToday(date) ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className="mt-1 text-lg font-bold">
              {new Date(date + 'T12:00:00').getDate()}
            </span>
            <span className="text-[10px] opacity-70">{formatDisplayDate(date).split(',')[1]?.trim()}</span>
          </button>
        )
      })}
    </div>
  )
}
