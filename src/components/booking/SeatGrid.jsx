import Badge from '../ui/Badge'

export default function SeatGrid({
  seats,
  availability,
  selectedSeat,
  onSelectSeat,
  selectedSlot,
  disabled = false,
}) {
  if (!seats?.length) return null

  const getSeatStatus = (seatId) => {
    if (!availability[seatId] || !selectedSlot) {
      const slots = availability[seatId]
      if (!slots) return 'unknown'
      const availableCount = Object.values(slots).filter(Boolean).length
      if (availableCount === 0) return 'full'
      if (availableCount < 6) return 'limited'
      return 'available'
    }
    return availability[seatId][selectedSlot] ? 'available' : 'occupied'
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {seats.map((seat) => {
        const status = getSeatStatus(seat.id)
        const isSelected = selectedSeat === seat.id
        const isDisabled = disabled || (selectedSlot && status === 'occupied')
        return (
          <button
            key={seat.id}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && onSelectSeat(seat.id)}
            className={`relative flex flex-col items-center rounded-xl border-2 p-4 transition-all ${
              isSelected
                ? 'border-salon-600 bg-salon-50 ring-2 ring-salon-300'
                : isDisabled
                  ? 'cursor-not-allowed border-red-100 bg-red-50/50 opacity-60'
                  : 'border-salon-200 bg-white hover:border-salon-400 hover:shadow-sm'
            }`}
          >
            <div
              className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full text-lg ${
                status === 'occupied'
                  ? 'bg-red-100 text-red-600'
                  : status === 'full'
                    ? 'bg-salon-100 text-salon-400'
                    : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              💺
            </div>
            <span className="font-semibold text-salon-900">{seat.name}</span>
            <span className="text-xs text-salon-500">{seat.stylist}</span>
            <div className="mt-2">
              {selectedSlot ? (
                <Badge variant={status === 'available' ? 'available' : 'occupied'}>
                  {disabled ? 'Unavailable' : status === 'available' ? 'Open' : 'Taken'}
                </Badge>
              ) : (
                <span className="text-[10px] text-salon-400">
                  {disabled
                    ? 'Unavailable'
                    : status === 'full'
                      ? 'Fully booked'
                      : status === 'limited'
                        ? 'Few slots'
                        : 'Available'}
                </span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
