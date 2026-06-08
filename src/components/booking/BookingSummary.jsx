import { SEATS, SERVICES } from '../../utils/constants'
import { formatDisplayDate } from '../../utils/dates'
import Button from '../ui/Button'

export default function BookingSummary({
  date,
  seatId,
  slot,
  serviceId,
  onServiceChange,
  onConfirm,
  loading,
  canBook,
}) {
  const seat = SEATS.find((s) => s.id === seatId)
  const service = SERVICES.find((s) => s.id === serviceId)

  if (!date) return null

  return (
    <div className="rounded-xl border border-salon-200 bg-gradient-to-br from-salon-50 to-white p-5">
      <h3 className="font-display text-lg font-semibold text-salon-900">Booking summary</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-salon-500">Date</dt>
          <dd className="font-medium text-salon-900">{formatDisplayDate(date)}</dd>
        </div>
        {seat && (
          <div className="flex justify-between">
            <dt className="text-salon-500">Seat</dt>
            <dd className="font-medium text-salon-900">
              {seat.name} — {seat.stylist}
            </dd>
          </div>
        )}
        {slot && (
          <div className="flex justify-between">
            <dt className="text-salon-500">Time</dt>
            <dd className="font-medium text-salon-900">{slot}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-salon-700">Service</label>
        <div className="grid grid-cols-2 gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onServiceChange(s.id)}
              className={`rounded-lg border p-3 text-left text-sm transition-all INR {
                serviceId === s.id
                  ? 'border-salon-600 bg-salon-700 text-white'
                  : 'border-salon-200 bg-white hover:border-salon-400'
              }`}
            >
              <span className="font-medium">{s.label}</span>
              <span className={`mt-0.5 block text-xs INR {serviceId === s.id ? 'text-salon-200' : 'text-salon-500'}`}>
                INR {s.price} · {s.duration} min
              </span>
            </button>
          ))}
        </div>
      </div>

      {service && (
        <p className="mt-4 text-right text-lg font-bold text-salon-800">
          Total: INR {service.price}
        </p>
      )}

      <Button
        className="mt-5 w-full"
        size="lg"
        disabled={!canBook || loading}
        onClick={onConfirm}
      >
        {loading ? 'Booking…' : 'Confirm appointment'}
      </Button>
    </div>
  )
}
