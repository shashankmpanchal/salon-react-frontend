import { formatDisplayDate } from '../../utils/dates';
import Button from '../ui/Button';

export default function BookingSummary({
  date,
  seatId,
  slot,
  serviceId,
  seats = [],
  services = [],
  onConfirm,
  loading,
  canBook,
}) {
  const seat = seats.find((s) => s.id === seatId);
  const service = services.find((s) => s.id === serviceId);

  if (!date) return null;

  return (
    <div className="rounded-xl border border-salon-200 bg-gradient-to-br from-salon-50 to-white p-5">
      <h3 className="font-display text-lg font-semibold text-salon-900">
        Booking summary
      </h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-salon-500">Date</dt>
          <dd className="font-medium text-salon-900">
            {formatDisplayDate(date)}
          </dd>
        </div>
        {seat && (
          <div className="flex justify-between">
            <dt className="text-salon-500">Seat</dt>
            <dd className="font-medium text-salon-900">{seat.name}</dd>
          </div>
        )}
        {slot && (
          <div className="flex justify-between">
            <dt className="text-salon-500">Time</dt>
            <dd className="font-medium text-salon-900">{slot}</dd>
          </div>
        )}
      </dl>

      {service && (
        <p className="mt-4 text-right text-lg font-bold text-salon-800">
          Total: INR {service.pricing}
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
  );
}
