export default function SlotPicker({ slots, availability, selectedSeat, selectedSlot, onSelectSlot }) {
  if (!slots?.length) return null

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {slots.map((slot) => {
        const available = selectedSeat
          ? availability[selectedSeat]?.[slot]
          : Object.values(availability).some((seatSlots) => seatSlots[slot])
        const selected = selectedSlot === slot
        const disabled = !available

        return (
          <button
            key={slot}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSlot(slot)}
            className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition-all ${
              disabled
                ? 'cursor-not-allowed border-salon-100 bg-salon-50 text-salon-300 line-through'
                : selected
                  ? 'border-salon-600 bg-salon-700 text-white shadow-md'
                  : 'border-salon-200 bg-white text-salon-800 hover:border-salon-400'
            }`}
          >
            {slot}
          </button>
        )
      })}
    </div>
  )
}
