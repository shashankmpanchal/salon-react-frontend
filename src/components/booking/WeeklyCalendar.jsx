import { formatDisplayDate, isPastDate } from '../../utils/dates'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function WeeklyCalendar({
  weekDates,
  weekAvailability,
  seats,
  slots,
  loading,
  onDayClick,
  selectedDate,
}) {
  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner className="mx-auto" />
      </div>
    )
  }

  const countAvailable = (date) => {
    if (isPastDate(date)) return 0

    const day = weekAvailability[date]
    if (!day) return 0
    let count = 0
    for (const seatId of Object.keys(day)) {
      for (const slot of slots) {
        if (day[seatId][slot]) count++
      }
    }
    return count
  }

  const totalSlots = (seats?.length || 6) * (slots?.length || 18)

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left font-medium text-salon-600">Day</th>
            {seats?.map((seat) => (
              <th key={seat.id} className="p-2 text-center font-medium text-salon-700">
                {seat.stylist}
              </th>
            ))}
            <th className="p-2 text-center font-medium text-salon-600">Open slots</th>
          </tr>
        </thead>
        <tbody>
          {weekDates.map((date) => {
            const past = isPastDate(date)
            const open = countAvailable(date)
            const pct = totalSlots ? Math.round((open / totalSlots) * 100) : 0
            const isSelected = selectedDate === date
            return (
              <tr
                key={date}
                onClick={() => !past && onDayClick?.(date)}
                className={`border-t border-salon-100 transition-colors ${
                  past
                    ? 'cursor-not-allowed bg-salon-50 text-salon-300'
                    : isSelected
                      ? 'cursor-pointer bg-salon-100'
                      : 'cursor-pointer hover:bg-salon-50'
                }`}
              >
                <td className="p-3 font-medium text-salon-900">
                  {formatDisplayDate(date)}
                </td>
                {seats?.map((seat) => {
                  const dayAvail = weekAvailability[date]?.[seat.id]
                  const seatOpen = !past && dayAvail
                    ? Object.values(dayAvail).filter(Boolean).length
                    : 0
                  const seatTotal = slots?.length || 18
                  const ratio = seatOpen / seatTotal
                  return (
                    <td key={seat.id} className="p-2 text-center">
                      <div
                        className={`mx-auto h-8 w-8 rounded-full text-xs font-semibold leading-8 ${
                          ratio === 0
                            ? 'bg-red-100 text-red-700'
                            : ratio < 0.3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}
                        title={`${seatOpen} slots available`}
                      >
                        {seatOpen}
                      </div>
                    </td>
                  )
                })}
                <td className="p-3 text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      pct === 0
                        ? 'bg-red-100 text-red-700'
                        : pct < 30
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {open} ({pct}%)
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
