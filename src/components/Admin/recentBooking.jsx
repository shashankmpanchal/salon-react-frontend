import { useDispatch, useSelector } from 'react-redux'
import {
  completeBooking,
  loadAllBookings,
} from '../../store/slices/bookingSlice';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDisplayDate } from '../../utils/dates';
import { useEffect, useRef } from 'react';

export default function RecentBookings() {
  const { allBookings } = useSelector((s) => s.booking);
  const dispatch = useDispatch();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    dispatch(loadAllBookings({ orderBy: 'desc' }));
  }, [dispatch]);

  // const findSeat = (seatId) =>
  //   seats.find((seat) => seat.seatId === seatId || seat.id === seatId);

  // const findService = (serviceId) =>
  //   services.find(
  //     (service) => service.serviceId === serviceId || service.id === serviceId,
  //   );

  const handleComplete = (bookingId) => {
    dispatch(completeBooking(bookingId));
  };

  return (
    <Card
      title="Recent bookings"
      subtitle="Latest appointments across all customers"
    >
      {!allBookings.length ? (
        <div className="py-12">
          <p className="text-center text-salon-500">No bookings yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-salon-200 text-salon-600">
                <th className="pb-3 pr-4 font-medium">Customer</th>
                <th className="pb-3 pr-4 font-medium">Date & Slot</th>
                <th className="pb-3 pr-4 font-medium">Service</th>
                <th className="pb-3 pr-4 font-medium">Pricing</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((b) => {
                return (
                  <tr key={b.id} className="border-b border-salon-50">
                    <td className="py-3 pr-4 font-medium text-salon-900">
                      {b.userName}
                    </td>
                    <td className="py-3 pr-4 text-salon-700">
                      {formatDisplayDate(b.date)},<br />
                      {b.slot}
                    </td>
                    <td className="py-3 pr-4 text-salon-700">
                      <p>
                        <span className="text-salon-500">Seat: </span>
                        <span className="font-medium text-salon-900 break-words">
                          {b.seatName}
                        </span>
                      </p>
                      <p>
                        <span className="text-salon-500">Service: </span>
                        <span className="font-medium text-salon-900 break-words">
                          {b.serviceLabel}
                        </span>
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-salon-700">
                      <p>
                        <span className="text-salon-500">Price: </span>
                        <span className="font-medium text-salon-900">
                          {b.price}
                        </span>
                      </p>
                      <p>
                        <span className="text-salon-500">Duration: </span>
                        <span className="font-medium text-salon-900">
                          {b.duration}
                        </span>
                      </p>
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
