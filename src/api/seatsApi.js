import { getApiEndPoints } from '../utils/common';
import api from './axios'

function mapSeat(seat) {
  return {
    id: seat.id || seat._id,
    seatId: seat.seatId,
    name: seat.name || seat.seatName,
    seatName: seat.seatName || seat.name,
    status: seat.status,
    createdAt: seat.createdAt,
    updatedAt: seat.updatedAt,
  }
}

/** Maps API seats for booking UI — availability keys use numeric seatId */
export function mapSeatForBooking(seat) {
  const mapped = mapSeat(seat)
  return {
    ...mapped,
    id: mapped.seatId,
    // seatId: mapped.seatId,
    stylist: mapped.name,
  };
}

let allSeatsLoad = null

export async function fetchAllSeatsForBooking() {
  if (!allSeatsLoad) {
    allSeatsLoad = fetchAllSeats()
      .then((seats) =>
        seats.map(mapSeatForBooking).sort((a, b) => a.seatId - b.seatId),
      )
      .finally(() => {
        allSeatsLoad = null
      })
  }
  return allSeatsLoad
}

export async function fetchSeats(params = {}) {
  const {
    page = 1,
    limit = 10,
    seatId = '',
    seatName = '',
    status = '',
    sortBy = 'seatId',
    sortOrder = 'asc',
  } = params

  const response = await api.get(`${getApiEndPoints()}seats`, {
    params: {
      page,
      limit,
      sortBy,
      sortOrder,
      ...(seatId ? { seatId } : {}),
      ...(seatName ? { seatName } : {}),
      ...(status ? { status } : {}),
    },
  });

  const { seats = [], pagination } = response.data.data

  return {
    seats: seats.map(mapSeat),
    pagination,
  }
}

export async function fetchAllSeats() {
  const response = await api.get(`${getApiEndPoints()}seats/all`);
  const seats = response.data.data.seats || []
  return seats.map(mapSeat)
}

export async function fetchSeatById(seatId) {
  const response = await api.get(`${getApiEndPoints()}seats/${seatId}`);
  return mapSeat(response.data.data.seat || response.data.data)
}

export async function createSeat(payload) {
  const response = await api.post(`${getApiEndPoints()}seats`, {
    seatName: payload.seatName.trim(),
    status: payload.status,
  });
  return mapSeat(response.data.data.seat || response.data.data)
}

export async function updateSeat(seatId, payload) {
  const body = {}
  if (payload.seatName?.trim()) body.seatName = payload.seatName.trim()
  if (payload.status) body.status = payload.status

  const response = await api.put(
    `${getApiEndPoints()}seats/${seatId}`,
    body,
  );
  return mapSeat(response.data.data.seat || response.data.data)
}

export async function deleteSeat(seatId) {
  await api.delete(`${getApiEndPoints()}seats/${seatId}`);
}

export const seatsApi = {
  getAll: fetchSeats,
  getAllSeats: fetchAllSeats,
  getAllForBooking: fetchAllSeatsForBooking,
  getById: fetchSeatById,
  create: createSeat,
  update: updateSeat,
  delete: deleteSeat,
}
