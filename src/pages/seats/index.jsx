import { useState } from 'react'
import { seatsApi } from '../../api/seatsApi'
import SeatsForm from './SeatsForm'
import SeatsList from './SeatsList'

export default function Seats() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingSeatId, setEditingSeatId] = useState(null)
  const [seatData, setSeatData] = useState(null)
  const [loadingSeat, setLoadingSeat] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const handleSeatSaved = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingSeatId(null)
    setSeatData(null)
    setFetchError(null)
    setLoadingSeat(false)
  }

  const handleCreateClick = () => {
    setEditingSeatId(null)
    setSeatData(null)
    setFetchError(null)
    setLoadingSeat(false)
    setShowForm(true)
  }

  const handleEditClick = async (seatId) => {
    setEditingSeatId(seatId)
    setSeatData(null)
    setFetchError(null)
    setShowForm(true)
    setLoadingSeat(true)

    try {
      const seat = await seatsApi.getById(seatId)
      setSeatData(seat)
    } catch (err) {
      setFetchError(
        err.response?.data?.message || err.message || 'Failed to load seat',
      )
    } finally {
      setLoadingSeat(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-salon-900">Seats</h1>
        <p className="mt-1 text-salon-600">
          Create and manage salon seats and stylist assignments
        </p>
      </div>

      <SeatsForm
        open={showForm}
        seatId={editingSeatId}
        seatData={seatData}
        loadingSeat={loadingSeat}
        fetchError={fetchError}
        onClose={handleCloseForm}
        onSuccess={handleSeatSaved}
      />
      <SeatsList
        refreshKey={refreshKey}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDeleteSuccess={handleSeatSaved}
      />
    </div>
  )
}
