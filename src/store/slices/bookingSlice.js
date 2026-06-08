import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingApi } from '../../api/bookingApi'

export const loadAvailability = createAsyncThunk(
  'booking/loadAvailability',
  async (date, { rejectWithValue }) => {
    try {
      return await bookingApi.getAvailability(date)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const loadWeekAvailability = createAsyncThunk(
  'booking/loadWeekAvailability',
  async (weekDates, { rejectWithValue }) => {
    try {
      return await bookingApi.getWeekAvailability(weekDates)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const bookAppointment = createAsyncThunk(
  'booking/bookAppointment',
  async (payload, { rejectWithValue }) => {
    try {
      return await bookingApi.create(payload)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const loadUserBookings = createAsyncThunk(
  'booking/loadUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      return await bookingApi.getByUser(userId)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const loadAllBookings = createAsyncThunk(
  'booking/loadAllBookings',
  async (params, { rejectWithValue }) => {
    try {
      return await bookingApi.getAll(params)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async ({ bookingId, cancellationReason }, { rejectWithValue }) => {
    try {
      return await bookingApi.cancel(bookingId, cancellationReason)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const completeBooking = createAsyncThunk(
  'booking/completeBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      return await bookingApi.updateStatus(bookingId, 'completed');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    selectedDate: null,
    selectedSeat: null,
    selectedSlot: null,
    selectedService: null,
    availability: {},
    weekAvailability: {},
    seats: [],
    slots: [],
    history: [],
    allBookings: [],
    allBookingsPagination: null,
    loading: false,
    bookingLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
      state.selectedSeat = null
      state.selectedSlot = null
      state.successMessage = null
    },
    setSelectedSeat: (state, action) => {
      state.selectedSeat = action.payload
      state.selectedSlot = null
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload
    },
    clearBookingSelection: (state) => {
      state.selectedSeat = null
      state.selectedSlot = null
      state.selectedService = null
      state.successMessage = null
      state.error = null
    },
    clearBookingMessages: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAvailability.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadAvailability.fulfilled, (state, action) => {
        state.loading = false
        state.availability = action.payload.availability
        state.seats = action.payload.seats
        state.slots = action.payload.slots
        state.selectedDate = action.payload.date
      })
      .addCase(loadAvailability.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loadWeekAvailability.pending, (state) => {
        state.loading = true
      })
      .addCase(loadWeekAvailability.fulfilled, (state, action) => {
        state.loading = false
        state.weekAvailability = action.payload.availability
        if (action.payload.seats?.length) state.seats = action.payload.seats
        if (action.payload.slots?.length) state.slots = action.payload.slots
      })
      .addCase(loadWeekAvailability.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(bookAppointment.pending, (state) => {
        state.bookingLoading = true
        state.error = null
        state.successMessage = null
      })
      .addCase(bookAppointment.fulfilled, (state) => {
        state.bookingLoading = false
        state.successMessage = 'Appointment booked successfully!'
        state.selectedSeat = null
        state.selectedSlot = null
        state.selectedService = null
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingLoading = false
        state.error = action.payload
      })
      .addCase(loadUserBookings.fulfilled, (state, action) => {
        state.history = action.payload
      })
      .addCase(loadAllBookings.pending, (state) => {
        state.loading = true
      })
      .addCase(loadAllBookings.fulfilled, (state, action) => {
        state.loading = false
        state.allBookings = action.payload.bookings
        state.allBookingsPagination = action.payload.pagination
      })
      .addCase(loadAllBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const updated = action.payload
        state.error = null
        state.history = state.history.map((b) =>
          b.id === updated.id ? updated : b,
        )
        state.allBookings = state.allBookings.map((b) =>
          b.id === updated.id ? updated : b,
        )
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        const updated = action.payload
        state.error = null
        state.history = state.history.map((b) =>
          b.id === updated.id ? updated : b,
        )
        state.allBookings = state.allBookings.map((b) =>
          b.id === updated.id ? updated : b,
        )
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const {
  setSelectedDate,
  setSelectedSeat,
  setSelectedSlot,
  setSelectedService,
  clearBookingSelection,
  clearBookingMessages,
} = bookingSlice.actions

export default bookingSlice.reducer
