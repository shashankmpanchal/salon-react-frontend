import { useSelector } from 'react-redux'
import Card from '../components/ui/Card'
import { SEATS } from '../utils/constants'
import { formatDate } from '../utils/dates'
import RecentBookings from '../components/Admin/recentBooking'

export default function AdminDashboard() {
  const { allBookings } = useSelector((s) => s.booking)
  
  const cancelled = allBookings.filter((b) => b.status === 'cancelled')
  const today = formatDate(new Date())
  const todayBookings = allBookings.filter((b) => b.date === today)
  const todaysPending = allBookings.filter(
    (b) => b.status === 'pending' && b.date === today,
  );
  const todaysConfirmed = allBookings.filter(
    (b) => b.status === 'confirmed' && b.date === today,
  );
  const todaysCompleted = allBookings.filter(
    (b) => b.status === 'completed' && b.date === today,
  );
  const todaysCancelled = allBookings.filter(
    (b) => b.status === 'cancelled'  && b.date === today,
  );
  const totalCompleted = allBookings.filter(
    (b) => b.status === 'completed',
  );

  const revenue = todaysConfirmed.reduce((sum, b) => sum + (b.price || 0), 0);
  const totalRevenue = totalCompleted.reduce(
    (sum, b) => sum + (b.price || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-salon-900">
          Admin dashboard
        </h1>
        <p className="mt-1 text-salon-600">
          Salon overview and booking management
        </p>
      </div>

      <Card title="Todays Booking Summary">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s Pending</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {todaysPending.length}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s Confirmed</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {todaysConfirmed.length}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s completed</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {todaysCompleted.length}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s Cancelled</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {todaysCancelled.length}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s Bookings</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {todayBookings.length}
            </p>
          </Card>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <Card title="Total Booking Summary">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total Cancelled</p>
              <p className="mt-1 text-3xl font-bold text-salon-900">
                {cancelled.length}
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total Bookings</p>
              <p className="mt-1 text-3xl font-bold text-salon-900">
                {totalCompleted.length}
              </p>
            </Card>
          </div>
        </Card>

        <Card title="Revenue Summary">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Today&apos;s Revenue</p>
              <p className="flex gap-1 items-center mt-1 text-3xl font-bold text-salon-900">
                <span className="text-xl text-salon-900">INR</span> {revenue}
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total Revenue</p>
              <p className="flex gap-1 items-center mt-1 text-3xl font-bold text-salon-900">
                <span className="text-xl text-salon-900">INR</span>{' '}
                {totalRevenue}
              </p>
            </Card>
          </div>
        </Card>
      </div>

      <RecentBookings />

      <Card title="Stylists & chairs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SEATS.map((seat) => (
            <div
              key={seat.id}
              className="flex items-center gap-3 rounded-xl border border-salon-100 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-salon-100 text-salon-700">
                {seat.stylist[0]}
              </div>
              <div>
                <p className="font-medium text-salon-900">{seat.stylist}</p>
                <p className="text-sm text-salon-500">{seat.name}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
