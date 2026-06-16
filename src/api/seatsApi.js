import api from './axios'

function mapSeat(seat) {
  return {
    id: seat._id,
    seatId: seat.seatId,
    seatName: seat.seatName,
    status: seat.status,
    createdAt: seat.createdAt,
    updatedAt: seat.updatedAt,
  }
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

  const response = await api.get('/admin/seats', {
    params: {
      page,
      limit,
      sortBy,
      sortOrder,
      ...(seatId ? { seatId } : {}),
      ...(seatName ? { seatName } : {}),
      ...(status ? { status } : {}),
    },
  })

  const { seats = [], pagination } = response.data.data

  return {
    seats: seats.map(mapSeat),
    pagination,
  }
}

export async function fetchSeatById(seatId) {
  const response = await api.get(`/admin/seats/${seatId}`)
  return mapSeat(response.data.data.seat || response.data.data)
}

export async function createSeat(payload) {
  const response = await api.post('/admin/seats', {
    seatName: payload.seatName.trim(),
    status: payload.status,
  })
  return mapSeat(response.data.data.seat || response.data.data)
}

export async function updateSeat(seatId, payload) {
  const body = {}
  if (payload.seatName?.trim()) body.seatName = payload.seatName.trim()
  if (payload.status) body.status = payload.status

  const response = await api.put(`/admin/seats/${seatId}`, body)
  return mapSeat(response.data.data.seat || response.data.data)
}

export async function deleteSeat(seatId) {
  await api.delete(`/admin/seats/${seatId}`)
}

export const seatsApi = {
  getAll: fetchSeats,
  getById: fetchSeatById,
  create: createSeat,
  update: updateSeat,
  delete: deleteSeat,
}
