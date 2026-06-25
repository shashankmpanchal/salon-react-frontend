import { useEffect, useState } from 'react';
import { fetchDashboard } from '../api/dashboardApi';
import { bookingApi } from '../api/bookingApi';
import { fetchAllSeats } from '../api/seatsApi';
import { fetchAllServices } from '../api/servicesApi';
import RecentBookings from '../components/Admin/recentBooking';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { formatDisplayDate } from '../utils/dates';

let adminDashboardLoad = null;

function loadAdminDashboardData() {
  if (!adminDashboardLoad) {
    adminDashboardLoad = Promise.all([
      fetchDashboard(),
      fetchAllSeats(),
      fetchAllServices(),
    ]).finally(() => {
      adminDashboardLoad = null;
    });
  }
  return adminDashboardLoad;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [seats, setSeats] = useState([]);
  const [services, setServices] = useState([]);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAdminDashboard() {
      setLoading(true);
      setError('');

      try {
        const [dashboardData, seatsData, servicesData] =
          await loadAdminDashboardData();

        if (!cancelled) {
          setDashboard(dashboardData);
          setSeats(seatsData);
          setServices(servicesData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Failed to load admin dashboard',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAdminDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshDashboard = async () => {
    const dashboardData = await fetchDashboard();
    setDashboard(dashboardData);
  };

  const handleBookingStatus = async (bookingId, status) => {
    setUpdatingBookingId(bookingId);
    setError('');

    try {
      await bookingApi.updateStatus(bookingId, status);
      await refreshDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to update booking status',
      );
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const findSeat = (seatId) =>
    seats.find((seat) => seat.seatId === seatId || seat.id === seatId);

  const findService = (serviceId) =>
    services.find(
      (service) => service.serviceId === serviceId || service.id === serviceId,
    );

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const upcoming = dashboard?.upcomingBookings || [];
  const bookingsByStatus = dashboard?.bookingsByStatus || {};
  const settings = dashboard?.settings;

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

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <Card title="Today's booking summary">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s pending</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {dashboard?.todayPendingBookings ?? 0}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s confirmed</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {dashboard?.todayConfirmedBookings ?? 0}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s completed</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {dashboard?.todayCompletedBookings ?? 0}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s cancelled</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {dashboard?.todayCancelledBookings ?? 0}
            </p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-salon-500">Today&apos;s bookings</p>
            <p className="mt-1 text-3xl font-bold text-salon-900">
              {dashboard?.todayAllBookings ?? dashboard?.todayBookings ?? 0}
            </p>
          </Card>
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Total booking summary">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total cancelled</p>
              <p className="mt-1 text-3xl font-bold text-salon-900">
                {bookingsByStatus.cancelled ?? 0}
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total completed</p>
              <p className="mt-1 text-3xl font-bold text-salon-900">
                {bookingsByStatus.completed ?? 0}
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total bookings</p>
              <p className="mt-1 text-3xl font-bold text-salon-900">
                {dashboard?.totalBookings ?? 0}
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total users</p>
              <p className="mt-1 text-3xl font-bold text-salon-900">
                {dashboard?.totalUsers ?? 0}
              </p>
            </Card>
          </div>
        </Card>

        <Card title="Revenue summary">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Today&apos;s revenue</p>
              <p className="mt-1 flex items-center gap-1 text-3xl font-bold text-salon-900">
                <span className="text-xl text-salon-900">INR</span>
                {dashboard?.todayRevenue ?? 0}
              </p>
            </Card>
            <Card className="!p-4">
              <p className="text-sm text-salon-500">Total revenue</p>
              <p className="mt-1 flex items-center gap-1 text-3xl font-bold text-salon-900">
                <span className="text-xl text-salon-900">INR</span>
                {dashboard?.totalRevenue ?? 0}
              </p>
            </Card>
          </div>
        </Card>

        {settings && (
          <Card title="Salon settings">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="!p-4">
                <p className="text-sm text-salon-500">Opening hours</p>
                <p className="mt-1 text-lg font-semibold text-salon-900">
                  {settings.openingTime} – {settings.closingTime}
                </p>
              </Card>
              <Card className="!p-4">
                <p className="text-sm text-salon-500">Slot duration</p>
                <p className="mt-1 text-lg font-semibold text-salon-900">
                  {settings.slotDuration} min
                </p>
              </Card>
              <Card className="!p-4">
                <p className="text-sm text-salon-500">Total seats</p>
                <p className="mt-1 text-lg font-semibold text-salon-900">
                  {dashboard?.totalSeats ?? 0}
                </p>
              </Card>
              <Card className="!p-4">
                <p className="text-sm text-salon-500">Total services</p>
                <p className="mt-1 text-lg font-semibold text-salon-900">
                  {dashboard?.totalServices ?? 0}
                </p>
              </Card>
            </div>
          </Card>
        )}
      </div>

      <Card
        title="Upcoming bookings"
        subtitle="Next appointments across all customers"
      >
        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-salon-500">
            No upcoming bookings.
          </p>
        ) : (
          <ul className="divide-y divide-salon-100">
            {upcoming.map((booking) => {
              const seat = findSeat(booking.seatId);
              const service = findService(booking.serviceId);
              const isUpdating = updatingBookingId === booking.id;
              const isCancelled = booking.status === 'cancelled';
              const isConfirmed = booking.status === 'confirmed';

              return (
                <li
                  key={booking.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-salon-900">
                      {formatDisplayDate(booking.date)} at {booking.slot}
                    </p>
                    <p className="text-sm text-salon-500">
                      {seat?.name || 'Seat'} · {service?.name || 'Service'}
                    </p>
                    <p className="text-sm text-salon-500">
                      {booking?.userName} · {booking?.userPhone}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={booking.status}>{booking.status}</Badge>
                    <Button
                      size="sm"
                      disabled={isUpdating || isConfirmed || isCancelled}
                      onClick={() =>
                        handleBookingStatus(booking.id, 'confirmed')
                      }
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={isUpdating || isCancelled}
                      onClick={() =>
                        handleBookingStatus(booking.id, 'cancelled')
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <RecentBookings />

      <Card title="Seats">
        {seats.length === 0 ? (
          <p className="py-4 text-center text-salon-500">
            No seats configured.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center gap-3 rounded-xl border border-salon-100 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-salon-100 text-salon-700">
                  {seat.name?.[0] || 'S'}
                </div>
                <div>
                  <p className="font-medium text-salon-900">{seat.name}</p>
                  <p className="text-sm text-salon-500">Seat #{seat.seatId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Services">
        {services.length === 0 ? (
          <p className="py-4 text-center text-salon-500">
            No services configured.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-salon-100 bg-salon-50/50 p-4"
              >
                <p className="font-semibold text-salon-900">{service.name}</p>
                <p className="mt-1 text-sm text-salon-500">
                  INR {service.pricing}
                  {service.duration ? ` · ${service.duration} min` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
