import { getApiEndPoints } from '../utils/common'
import api from './axios'

function mapService(service) {
  return {
    id: service.id || service._id,
    serviceId: service.serviceId,
    name: service.name,
    pricing: service.pricing,
    duration: service.duration,
    status: service.status,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  }
}

export function mapServiceForBooking(service) {
  const mapped = mapService(service)
  return {
    ...mapped,
    serviceId: mapped.serviceId,
    id: mapped.serviceId,
  };
}

let allServicesLoad = null

export async function fetchAllServicesForBooking() {
  if (!allServicesLoad) {
    allServicesLoad = fetchAllServices()
      .then((services) =>
        services.map(mapServiceForBooking).sort((a, b) => a.serviceId - b.serviceId),
      )
      .finally(() => {
        allServicesLoad = null
      })
  }
  return allServicesLoad
}

export async function fetchServices(params = {}) {
  const {
    page = 1,
    limit = 10,
    serviceId = '',
    serviceName = '',
    status = '',
    sortBy = 'serviceId',
    sortOrder = 'asc',
  } = params

  const response = await api.get(`${getApiEndPoints()}services`, {
    params: {
      page,
      limit,
      sortBy,
      sortOrder,
      ...(serviceId ? { serviceId } : {}),
      ...(serviceName ? { serviceName } : {}),
      ...(status ? { status } : {}),
    },
  });

  const { services = [], pagination } = response.data.data

  return {
    services: services.map(mapService),
    pagination,
  }
}

export async function fetchAllServices() {
  const response = await api.get(`${getApiEndPoints()}services/all`);
  const services = response.data.data.services || []
  return services.map(mapService)
}

export async function fetchServiceById(serviceId) {
  const response = await api.get(`${getApiEndPoints()}services/${serviceId}`);
  return mapService(response.data.data.service || response.data.data)
}

export async function createService(payload) {
  const response = await api.post(`${getApiEndPoints()}services`, {
    name: payload.name.trim(),
    duration: payload.duration,
    pricing: payload.pricing,
    status: payload.status,
  });
  return mapService(response.data.data.service || response.data.data)
}

export async function updateService(serviceId, payload) {
  const body = {}
  if (payload.name?.trim()) body.name = payload.name.trim()
  if (payload.duration != null) body.duration = payload.duration
  if (payload.pricing != null) body.pricing = payload.pricing
  if (payload.status) body.status = payload.status

  const response = await api.put(
    `${getApiEndPoints()}services/${serviceId}`,
    body,
  );
  return mapService(response.data.data.service || response.data.data)
}

export async function deleteService(serviceId) {
  await api.delete(`${getApiEndPoints()}services/${serviceId}`);
}

export const servicesApi = {
  getAll: fetchServices,
  getAllServices: fetchAllServices,
  getAllForBooking: fetchAllServicesForBooking,
  getById: fetchServiceById,
  create: createService,
  update: updateService,
  delete: deleteService,
}
