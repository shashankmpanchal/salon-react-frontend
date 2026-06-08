import { useDispatch, useSelector } from 'react-redux';
import { completeBooking, loadAllBookings } from '../../store/slices/bookingSlice';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
// import LoadingSpinner from '../components/ui/LoadingSpinner'
import { SEATS } from '../../utils/constants';
import { formatDisplayDate, getWeekDates } from '../../utils/dates';
import { useEffect, useMemo, useRef } from 'react';

export default function RecentBookings() {
  const { allBookings } = useSelector((s) => s.booking);
  const dispatch = useDispatch();
  const weekDates = useMemo(() => getWeekDates(new Date()), []);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    dispatch(loadAllBookings({ limit: 5 }));
  }, [dispatch, weekDates]);

  const handleComplete = (bookingId) => {
    dispatch(completeBooking(bookingId));
  };

  return (
      <Card
        title="Recent bookings"
        subtitle="Latest appointments across all customers"
      >
        {!allBookings.length ? (
          // <LoadingSpinner className="py-12" />
          <div className="py-12">
            <p className="text-center text-salon-500">No bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-salon-200 text-salon-600">
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">Seat</th>
                  <th className="pb-3 pr-4 font-medium">Service</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.slice(0, 20).map((b) => {
                  const seat = SEATS.find((s) => s.id === b.seatId);
                  return (
                    <tr key={b.id} className="border-b border-salon-50">
                      <td className="py-3 pr-4 font-medium text-salon-900">
                        {b.userName}
                      </td>
                      <td className="py-3 pr-4 text-salon-700">
                        {formatDisplayDate(b.date)}
                      </td>
                      <td className="py-3 pr-4 text-salon-700">{b.slot}</td>
                      <td className="py-3 pr-4 text-salon-700">
                        {seat?.name} ({seat?.stylist})
                      </td>
                      <td className="py-3 pr-4 text-salon-700">
                        {b.serviceLabel}
                      </td>
                      <td className="py-3">
                        <Badge variant={b.status}>{b.status}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={b.status}>{b.payment}</Badge>
                      </td>
                      <td className="py-3">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={
                            b.status === 'completed' || b.status === 'cancelled'
                          }
                          onClick={() => handleComplete(b.id)}
                        >
                          Done
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
  );
}
