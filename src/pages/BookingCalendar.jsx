import { useEffect, useMemo, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  bookAppointment,
  clearBookingMessages,
  loadAvailability,
  loadWeekAvailability,
  setSelectedDate,
  setSelectedSeat,
  setSelectedService,
  setSelectedSlot,
} from '../store/slices/bookingSlice'
import { fetchAllSeatsForBooking } from '../api/seatsApi';
import { fetchAllServicesForBooking } from '../api/servicesApi';
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DatePicker from '../components/booking/DatePicker'
import SeatGrid from '../components/booking/SeatGrid'
import SlotPicker from '../components/booking/SlotPicker'
import WeeklyCalendar from '../components/booking/WeeklyCalendar'
import BookingSummary from '../components/booking/BookingSummary';
import { addDays, formatDate, getWeekDates, isPastDate } from '../utils/dates'

export default function BookingCalendar() {
  const { user } = useSelector((s) => s.auth)
  const {
    selectedDate,
    selectedSeat,
    selectedSlot,
    selectedService,
    availability,
    weekAvailability,
    slots,
    loading,
    bookingLoading,
    error,
    successMessage,
  } = useSelector((s) => s.booking);
  const hasLoadedRef = useRef(false);
  const dispatch = useDispatch()
  const [weekStart, setWeekStart] = useState(formatDate(new Date()))
  const [bookingSeats, setBookingSeats] = useState([]);
  const [bookingServices, setBookingServices] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const weekDates = useMemo(() => getWeekDates(new Date(`${weekStart}T12:00:00`)), [weekStart])

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchAllSeatsForBooking(), fetchAllServicesForBooking()])
      .then(([seats, services]) => {
        if (!cancelled) {
          setBookingSeats(seats);
          setBookingServices(services);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCatalogError(
            err.response?.data?.message ||
              err.message ||
              'Failed to load booking catalog',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    dispatch(loadWeekAvailability(weekDates));
  }, [dispatch, weekDates]);

  useEffect(() => {
    const today = formatDate(new Date())
    if (!selectedDate) {
      dispatch(setSelectedDate(today))
      dispatch(loadAvailability(today))
      hasLoadedRef.current = true;
    }
  }, [dispatch, selectedDate])

  const handleDateSelect = (date) => {
    if (isPastDate(date)) return

    dispatch(setSelectedDate(date))
    dispatch(clearBookingMessages());
    dispatch(loadAvailability(date))
  }

  const handleConfirm = () => {
    if (isPastDate(selectedDate)) return

    dispatch(
      bookAppointment({
        userId: user.id,
        date: selectedDate,
        seatId: selectedSeat,
        serviceId: selectedService,
        slot: selectedSlot,
      }),
    ).then((result) => {
      if (bookAppointment.fulfilled.match(result)) {
        dispatch(loadAvailability(selectedDate));
        dispatch(loadWeekAvailability(weekDates));
      }
    });
  }

  const extendedDates = weekDates
  const isSelectedDatePast = isPastDate(selectedDate)

  const canBook =
    selectedDate && !isSelectedDatePast && selectedSeat && selectedSlot && selectedService

  if (catalogLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  console.log('bookingServices ===>>> ', bookingServices);

  return (
    <div className="space-y-6">
      <>
        <h1 className="font-display text-3xl font-bold text-salon-900">
          Book appointment Test
        </h1>
        <p className="mt-1 text-salon-600">
          Select a date, time slot, and available seat
        </p>
      </>
      {catalogError && (
        <Alert
          type="error"
          message={catalogError}
          onClose={() => setCatalogError('')}
        />
      )}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => dispatch(clearBookingMessages())}
        />
      )}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => dispatch(clearBookingMessages())}
        />
      )}
      <Card
        title="Weekly overview"
        subtitle="Click a day to book · numbers show open slots per stylist"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="rounded-lg border border-salon-200 px-3 py-1.5 text-sm hover:bg-salon-50"
          >
            ← Previous week
          </button>
          <span className="text-sm font-medium text-salon-700">
            {weekDates[0]} — {weekDates[6]}
          </span>
          <button
            type="button"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="rounded-lg border border-salon-200 px-3 py-1.5 text-sm hover:bg-salon-50"
          >
            Next week →
          </button>
        </div>
        <WeeklyCalendar
          weekDates={weekDates}
          weekAvailability={weekAvailability}
          seats={bookingSeats}
          slots={slots}
          loading={loading && !Object.keys(weekAvailability).length}
          selectedDate={selectedDate}
          onDayClick={handleDateSelect}
        />
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="1. Select date">
            <DatePicker
              dates={extendedDates}
              selectedDate={selectedDate}
              onSelect={handleDateSelect}
            />
          </Card>

          <Card
            title="2. Choose your seat"
            subtitle={`${bookingSeats.length} seats · pick an available chair`}
          >
            {bookingSeats.length === 0 ? (
              <p className="py-4 text-center text-salon-500">
                No seats available.
              </p>
            ) : (
              <SeatGrid
                seats={bookingSeats}
                availability={availability}
                selectedSeat={selectedSeat}
                selectedSlot={selectedSlot}
                disabled={isSelectedDatePast}
                onSelectSeat={(id) => dispatch(setSelectedSeat(id))}
              />
            )}
          </Card>

          <Card
            title="3. Choose your service"
            subtitle={`${bookingServices.length} services · pick a service `}
          >
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-salon-700">
                Service
              </label>
              {bookingServices.length === 0 ? (
                <p className="text-sm text-salon-500">No services available.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {bookingServices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => dispatch(setSelectedService(s.id))}
                      className={`rounded-lg border p-3 text-left text-sm transition-all ${
                        selectedService === s.id
                          ? 'border-salon-600 bg-salon-700 text-white'
                          : 'border-salon-200 bg-white hover:border-salon-400'
                      }`}
                    >
                      <span className="font-medium">{s.name}</span>
                      <span
                        className={`mt-0.5 block text-xs ${
                          selectedService === s.id
                            ? 'text-salon-200'
                            : 'text-salon-500'
                        }`}
                      >
                        INR {s.pricing}
                        {s.duration ? ` · ${s.duration} min` : ''}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card
            title="4. Select time slot"
            subtitle="Green slots are available"
          >
            <SlotPicker
              slots={slots}
              availability={availability}
              selectedSeat={selectedSeat}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => dispatch(setSelectedSlot(slot))}
            />
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingSummary
            date={selectedDate}
            seatId={selectedSeat}
            slot={selectedSlot}
            serviceId={selectedService}
            seats={bookingSeats}
            services={bookingServices}
            onServiceChange={(id) => dispatch(setSelectedService(id))}
            onConfirm={handleConfirm}
            loading={bookingLoading}
            canBook={canBook}
          />
        </div>
      </div>
    </div>
  );
}
