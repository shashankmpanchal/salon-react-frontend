import { useState } from 'react'
import { servicesApi } from '../../api/servicesApi'
import ServicesForm from './ServicesForm'
import ServicesList from './ServicesList'

export default function Services() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [serviceData, setServiceData] = useState(null)
  const [loadingService, setLoadingService] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const handleServiceSaved = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingServiceId(null)
    setServiceData(null)
    setFetchError(null)
    setLoadingService(false)
  }

  const handleCreateClick = () => {
    setEditingServiceId(null)
    setServiceData(null)
    setFetchError(null)
    setLoadingService(false)
    setShowForm(true)
  }

  const handleEditClick = async (serviceId) => {
    setEditingServiceId(serviceId)
    setServiceData(null)
    setFetchError(null)
    setShowForm(true)
    setLoadingService(true)

    try {
      const service = await servicesApi.getById(serviceId)
      setServiceData(service)
    } catch (err) {
      setFetchError(
        err.response?.data?.message || err.message || 'Failed to load service',
      )
    } finally {
      setLoadingService(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-salon-900">Services</h1>
        <p className="mt-1 text-salon-600">
          Create and manage salon services
        </p>
      </div>

      <ServicesForm
        open={showForm}
        serviceId={editingServiceId}
        serviceData={serviceData}
        loadingService={loadingService}
        fetchError={fetchError}
        onClose={handleCloseForm}
        onSuccess={handleServiceSaved}
      />
      <ServicesList
        refreshKey={refreshKey}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDeleteSuccess={handleServiceSaved}
      />
    </div>
  )
}
