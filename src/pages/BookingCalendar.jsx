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
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import DatePicker from '../components/booking/DatePicker'
import SeatGrid from '../components/booking/SeatGrid'
import SlotPicker from '../components/booking/SlotPicker'
import WeeklyCalendar from '../components/booking/WeeklyCalendar'
import BookingSummary from '../components/booking/BookingSummary'
import { SEATS } from '../utils/constants'
// import { SERVICES, SEATS } from '../utils/constants';
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
    seats,
    slots,
    loading,
    bookingLoading,
    error,
    successMessage,
  } = useSelector((s) => s.booking)
  const hasLoadedRef = useRef(false);
  const dispatch = useDispatch()
  const [weekStart, setWeekStart] = useState(formatDate(new Date()))
  const weekDates = useMemo(() => getWeekDates(new Date(`${weekStart}T12:00:00`)), [weekStart])

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    dispatch(loadWeekAvailability(weekDates))
  }, [dispatch, weekDates])

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
    dispatch(clearBookingMessages())

    dispatch(loadAvailability(date))
  }

  const handleConfirm = () => {
    if (isPastDate(selectedDate)) return

    // const service = SERVICES.find((s) => s.id === selectedService)
    dispatch(
      bookAppointment({
        userId: user.id,
        date: selectedDate,
        seatId: selectedSeat,
        slot: selectedSlot,
        // serviceId: selectedService,
        // serviceLabel: service?.label,
        // price: service?.price,
        // seatName: SEATS.find((s) => s.id === selectedSeat)?.name,
        // stylist: SEATS.find((s) => s.id === selectedSeat)?.stylist,
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
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-salon-900">Book appointment</h1>
        <p className="mt-1 text-salon-600">Select a date, time slot, and available seat</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => dispatch(clearBookingMessages())} />
      )}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => dispatch(clearBookingMessages())} />
      )}

      <Card title="Weekly overview" subtitle="Click a day to book · numbers show open slots per stylist">
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
          seats={seats.length ? seats : SEATS}
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

          <Card title="2. Select time slot" subtitle="Green slots are available">
            <SlotPicker
              slots={slots}
              availability={availability}
              selectedSeat={selectedSeat}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => dispatch(setSelectedSlot(slot))}
            />
          </Card>

          <Card title="3. Choose your seat" subtitle="6 stylists · pick an available chair">
            <SeatGrid
              seats={seats.length ? seats : SEATS}
              availability={availability}
              selectedSeat={selectedSeat}
              selectedSlot={selectedSlot}
              disabled={isSelectedDatePast}
              onSelectSeat={(id) => dispatch(setSelectedSeat(id))}
            />
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingSummary
            date={selectedDate}
            seatId={selectedSeat}
            slot={selectedSlot}
            serviceId={selectedService}
            onServiceChange={(id) => dispatch(setSelectedService(id))}
            onConfirm={handleConfirm}
            loading={bookingLoading}
            canBook={canBook}
          />
        </div>
      </div>
    </div>
  )
}
