import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelBooking, clearBookingMessages, loadUserBookings } from '../store/slices/bookingSlice'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Alert from '../components/ui/Alert'
import { SEATS, SERVICES } from '../utils/constants'
import { formatDisplayDate } from '../utils/dates'

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed']

export default function BookingHistory() {
  const { user } = useSelector((s) => s.auth)
  const { history, error } = useSelector((s) => s.booking)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancellationReasonError, setCancellationReasonError] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.id) dispatch(loadUserBookings(user.id))
  }, [dispatch, user?.id])

  const handleCancel = (id) => {
    setBookingToCancel(id)
    setCancellationReason('')
    setCancellationReasonError('')
  }

  const handleConfirmCancel = () => {
    const reason = cancellationReason.trim()
    if (!reason) {
      setCancellationReasonError('Cancellation reason is required')
      return
    }

    if (bookingToCancel) {
      dispatch(cancelBooking({ bookingId: bookingToCancel, cancellationReason: reason }))
      setBookingToCancel(null)
      setCancellationReason('')
      setCancellationReasonError('')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-salon-900">Booking history</h1>
        <p className="mt-1 text-salon-600">All your past and upcoming appointments</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => dispatch(clearBookingMessages())} />
      )}

      <Card>
        {!history ? (
          <LoadingSpinner className="py-12" />
        ) : history.length === 0 ? (
          <p className="py-12 text-center text-salon-500">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {history.map((b) => {
              const seat = SEATS.find((s) => s.id === b.seatId)
              const service = SERVICES.find((s) => s.id === b.serviceId)
              const canCancel = ACTIVE_BOOKING_STATUSES.includes(b.status) && b.date >= today

              return (
                <article
                  key={b.id}
                  className="flex flex-col gap-4 rounded-xl border border-salon-100 bg-salon-50/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-salon-900">
                        {formatDisplayDate(b.date)} · {b.slot}
                      </h3>
                      <Badge variant={b.status}>{b.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-salon-600">
                      {seat?.name} with {seat?.stylist} · {service?.label || b.serviceLabel}
                    </p>
                    {b.price != null && (
                      <p className="mt-1 text-sm font-medium text-salon-800">INR {b.price}</p>
                    )}
                  </div>
                  {canCancel && (
                    <Button variant="danger" size="sm" onClick={() => handleCancel(b.id)}>
                      Cancel
                    </Button>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </Card>

      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-salon-950/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id="cancel-booking-title" className="font-display text-xl font-bold text-salon-900">
              Cancel appointment?
            </h2>
            <p className="mt-2 text-sm text-salon-600">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="mt-4">
              <label htmlFor="cancellationReason" className="mb-1.5 block text-sm font-medium text-salon-800">
                Cancellation reason
              </label>
              <textarea
                id="cancellationReason"
                name="cancellationReason"
                value={cancellationReason}
                onChange={(e) => {
                  setCancellationReason(e.target.value)
                  if (cancellationReasonError) setCancellationReasonError('')
                }}
                rows={3}
                maxLength={500}
                className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-salon-950 placeholder:text-salon-400 transition-colors focus:border-salon-500 focus:outline-none focus:ring-2 focus:ring-salon-200 ${
                  cancellationReasonError ? 'border-red-400' : 'border-salon-200'
                }`}
                placeholder="Enter reason"
              />
              {cancellationReasonError && (
                <p className="mt-1 text-sm text-red-600">{cancellationReasonError}</p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setBookingToCancel(null)
                  setCancellationReason('')
                  setCancellationReasonError('')
                }}
              >
                No
              </Button>
              <Button variant="danger" onClick={handleConfirmCancel}>
                Yes, cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
