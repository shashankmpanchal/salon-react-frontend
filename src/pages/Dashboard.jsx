import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserBookings } from '../store/slices/bookingSlice'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { ROUTES, SEATS, SERVICES } from '../utils/constants'
import { formatDisplayDate } from '../utils/dates'

const ACTIVE_BOOKING_STATUSES = ['pending', 'confirmed']

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth)
  const { history, loading } = useSelector((s) => s.booking)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.id) dispatch(loadUserBookings(user.id))
  }, [dispatch, user?.id])

  const upcoming = history.filter((b) => ACTIVE_BOOKING_STATUSES.includes(b.status))
  const completedVisits = history.filter((b) => b.status === 'completed').length

  const findSeat = (seatId) => SEATS.find((seat) => seat.id === seatId)
  const findService = (serviceId) => SERVICES.find((service) => service.id === serviceId)

  if (loading && history.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-salon-900">
            Hello, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-salon-600">Manage your salon appointments</p>
        </div>
        <Link to={ROUTES.BOOK}>
          <Button size="lg">Book appointment</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-sm text-salon-500">Upcoming</p>
          <p className="mt-1 text-3xl font-bold text-salon-900">{upcoming.length}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-salon-500">Completed visits</p>
          <p className="mt-1 text-3xl font-bold text-salon-900">{completedVisits}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-salon-500">Available chairs</p>
          <p className="mt-1 text-3xl font-bold text-salon-900">{SEATS.length}</p>
        </Card>
      </div>

      <Card title="Upcoming appointments" subtitle="Your next visits at LuxeCuts">
        {upcoming.length === 0 ? (
          <div className="py-8 text-center text-salon-500">
            <p>No upcoming appointments.</p>
            <Link to={ROUTES.BOOK} className="mt-4 inline-block">
              <Button variant="secondary">Book now</Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-salon-100">
            {upcoming.slice(0, 5).map((booking) => {
              const seat = findSeat(booking.seatId)
              const service = findService(booking.serviceId)

              return (
                <li
                  key={booking.id}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-salon-900">
                      {formatDisplayDate(booking.date)} at {booking.slot}
                    </p>
                    <p className="text-sm text-salon-500">
                      {seat?.name || 'Seat'} · {service?.label || booking.serviceLabel || 'Service'}
                    </p>
                  </div>
                  <Badge variant={booking.status}>{booking.status}</Badge>
                </li>
              )
            })}
          </ul>
        )}
        {upcoming.length > 0 && (
          <Link
            to={ROUTES.HISTORY}
            className="mt-4 inline-block text-sm font-medium text-salon-700 hover:text-salon-900"
          >
            View all history →
          </Link>
        )}
      </Card>

      <Card title="Our services">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-salon-100 bg-salon-50/50 p-4"
            >
              <p className="font-semibold text-salon-900">{service.label}</p>
              <p className="mt-1 text-sm text-salon-500">
                INR {service.price} · {service.duration} min
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
